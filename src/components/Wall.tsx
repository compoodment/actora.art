import { useEffect, useRef, useState } from 'preact/hooks';
import {
  eraseWallCells,
  fetchWallBudget,
  fetchWallState,
  fetchWallToolPreference,
  paintWallCells,
  saveWallToolPreference,
  type WallBudgetResponse,
  type WallCell,
  type WallStateResponse,
  type WallToolPreference,
} from '../lib/api';

interface Cell {
  char: string;
  color: string;
  placedAt: number;
  isMine?: boolean;
}

interface Budget {
  remaining: number;
  refundsLeft: number;
  maxDaily: number;
  nextResetAt: number;
}

interface WallPatchEvent {
  cells: {
    x: number;
    y: number;
    cell: WallCell | null;
  }[];
}

const WALL_TOOL_STORAGE_KEY = 'wall-tool-preference';
const DEFAULT_WALL_TOOL: WallToolPreference = {
  char: '█',
  color: 'white',
  mode: 'paint',
};
const COLORS: Record<string, string> = {
  red: '#ff6b6b',
  green: '#51cf66',
  yellow: '#fcc419',
  cyan: '#22b8cf',
  magenta: '#cc5de8',
  white: '#e0e0e0',
  brightWhite: '#ffffff',
};

const COLS = 80;
const ROWS = 24;
const WALL_RECOVERY_MS = 15000;
const FADE_MS = 1 * 24 * 60 * 60 * 1000;
const EXPIRE_MS = 3 * 24 * 60 * 60 * 1000;

type PendingWallCell = { x: number; y: number; char?: string; color?: string };
type WallPreferenceOwner = 'unknown' | 'guest' | 'account';

const isAllowedWallColor = (color: string) => Object.prototype.hasOwnProperty.call(COLORS, color);

const normalizeWallChar = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.length !== 1) return null;
  const upper = value.toUpperCase();
  return upper.length === 1 ? upper : value;
};

const normalizeWallToolPreference = (value: unknown): WallToolPreference | null => {
  if (!value || typeof value !== 'object') return null;
  const preference = value as Partial<WallToolPreference>;
  const char = normalizeWallChar(preference.char);
  if (!char || !isAllowedWallColor(String(preference.color || ''))) return null;
  return {
    char,
    color: String(preference.color),
    mode: preference.mode === 'erase' ? 'erase' : 'paint',
  };
};

const readGuestWallToolPreference = (): WallToolPreference | null => {
  if (typeof window === 'undefined') return null;
  try {
    return normalizeWallToolPreference(JSON.parse(localStorage.getItem(WALL_TOOL_STORAGE_KEY) || 'null'));
  } catch {
    return null;
  }
};

const writeGuestWallToolPreference = (preference: WallToolPreference) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WALL_TOOL_STORAGE_KEY, JSON.stringify(preference));
};

export default function Wall() {
  const [grid, setGrid] = useState<(Cell | null)[][]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [selectedChar, setSelectedChar] = useState(() => (readGuestWallToolPreference() || DEFAULT_WALL_TOOL).char);
  const [selectedColor, setSelectedColor] = useState(() => (readGuestWallToolPreference() || DEFAULT_WALL_TOOL).color);
  const [mode, setMode] = useState<'paint' | 'erase'>(() => (readGuestWallToolPreference() || DEFAULT_WALL_TOOL).mode);
  const [preferenceOwner, setPreferenceOwner] = useState<WallPreferenceOwner>('unknown');
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [, setPendingDisplayRevision] = useState(0);
  const [showInfo, setShowInfo] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('wall-info-seen');
  });
  const gridRef = useRef<HTMLDivElement>(null);
  const preferenceLoadedRef = useRef(false);
  const preferenceSaveTimerRef = useRef<number | null>(null);
  const dragging = useRef(false);
  const pendingRef = useRef<PendingWallCell[]>([]);
  const pendingKeysRef = useRef<Map<string, number>>(new Map());
  const dragKeysRef = useRef<Set<string>>(new Set());
  const reservedPaintRef = useRef(0);
  const reservedEraseRef = useRef(0);
  const recoveryIntervalRef = useRef<number | null>(null);

  const getCellKey = (x: number, y: number) => `${x}:${y}`;
  const refreshPendingDisplay = () => setPendingDisplayRevision(revision => revision + 1);
  const hasPendingKey = (x: number, y: number) => pendingKeysRef.current.has(getCellKey(x, y));
  const retainPendingKey = (x: number, y: number) => {
    const key = getCellKey(x, y);
    pendingKeysRef.current.set(key, (pendingKeysRef.current.get(key) || 0) + 1);
  };
  const releasePendingKey = (key: string) => {
    const count = pendingKeysRef.current.get(key) || 0;
    if (count <= 1) {
      pendingKeysRef.current.delete(key);
    } else {
      pendingKeysRef.current.set(key, count - 1);
    }
  };

  const applyServerGrid = (serverGrid: (Cell | null)[][]) => {
    setGrid(prev => {
      if (pendingKeysRef.current.size === 0 || prev.length === 0) return serverGrid;
      return serverGrid.map((row, y) => row.map((cell, x) => {
        return hasPendingKey(x, y) ? prev[y]?.[x] ?? cell : cell;
      }));
    });
  };

  const applyWallPatch = (patch: WallPatchEvent) => {
    if (!Array.isArray(patch.cells) || patch.cells.length === 0) return;
    setGrid(prev => {
      if (prev.length === 0) return prev;
      const next = prev.map(row => [...row]);
      for (const { x, y, cell } of patch.cells) {
        if (typeof x !== 'number' || typeof y !== 'number') continue;
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
        if (hasPendingKey(x, y)) continue;
        if (!next[y]) continue;
        next[y][x] = cell;
      }
      return next;
    });
  };

  const fetchWall = async () => {
    try {
      const { response, data } = await fetchWallState();
      if (response.ok) {
        applyServerGrid((data as WallStateResponse).grid);
      }
    } catch {}
  };

  const loadBudget = async () => {
    try {
      const { response, data } = await fetchWallBudget();
      if (response.ok) {
        setBudget(data as WallBudgetResponse);
      }
    } catch {}
  };

  useEffect(() => {
    const startRecovery = () => {
      if (recoveryIntervalRef.current !== null) return;
      recoveryIntervalRef.current = window.setInterval(() => {
        fetchWall();
        loadBudget();
      }, WALL_RECOVERY_MS);
    };

    const stopRecovery = () => {
      if (recoveryIntervalRef.current === null) return;
      window.clearInterval(recoveryIntervalRef.current);
      recoveryIntervalRef.current = null;
    };

    let disposed = false;
    let events: EventSource | null = null;

    const openEvents = () => {
      if (disposed) return;
      events = new EventSource('/api/wall/events');

      events.addEventListener('open', () => {
        stopRecovery();
      });
      events.addEventListener('patch', (event) => {
        try {
          applyWallPatch(JSON.parse(event.data) as WallPatchEvent);
        } catch {}
      });
      events.addEventListener('refetch', () => {
        fetchWall();
        loadBudget();
      });
      events.addEventListener('error', () => {
        startRecovery();
      });
    };

    const initWall = async () => {
      await fetchWall();
      await loadBudget();
      openEvents();
    };
    initWall();

    return () => {
      disposed = true;
      events?.close();
      stopRecovery();
    };
  }, []);

  const getPendingPaintCount = () => pendingRef.current.filter(({ char }) => char !== undefined).length;
  const getPendingEraseCount = () => pendingRef.current.length - getPendingPaintCount();
  const getReservedPaintCount = () => getPendingPaintCount() + reservedPaintRef.current;
  const getReservedEraseCount = () => getPendingEraseCount() + reservedEraseRef.current;

  const commitCells = async (cells: PendingWallCell[], commitMode: 'paint' | 'erase') => {
    if (cells.length === 0) return;
    const isErase = commitMode === 'erase';
    const committedKeys = cells.map(({ x, y }) => getCellKey(x, y));
    let shouldRefetchWall = false;
    try {
      const { response, data } = isErase
        ? await eraseWallCells(cells.map(({ x, y }) => ({ x, y })))
        : await paintWallCells(cells.map(({ x, y, char, color }) => ({ x, y, char: normalizeWallChar(char) || '█', color })));

      if (response.ok) {
        const payload = data as Partial<WallBudgetResponse> & { placed?: number; erased?: number };
        const changedCount = isErase ? payload.erased ?? cells.length : payload.placed ?? cells.length;
        setBudget(prev => {
          if (!prev) return null;
          return {
            ...prev,
            maxDaily: payload.maxDaily ?? prev.maxDaily,
            nextResetAt: payload.nextResetAt ?? prev.nextResetAt,
            remaining: isErase
              ? Math.min(prev.maxDaily, prev.remaining + changedCount)
              : Math.max(0, prev.remaining - changedCount),
            refundsLeft: isErase ? Math.max(0, prev.refundsLeft - changedCount) : prev.refundsLeft,
          };
        });
      } else if (response.status === 429) {
        const errorCode = (data && typeof data === 'object' ? (data as { error?: string }).error : undefined);
        setErrorMsg(errorCode === 'refund_limit_reached' ? 'no refunds left' : 'no chars left — come back tomorrow');
        setTimeout(() => setErrorMsg(''), 3000);
        shouldRefetchWall = true;
      } else {
        shouldRefetchWall = true;
      }
    } catch {
      shouldRefetchWall = true;
    } finally {
      if (isErase) {
        reservedEraseRef.current = Math.max(0, reservedEraseRef.current - cells.length);
      } else {
        reservedPaintRef.current = Math.max(0, reservedPaintRef.current - cells.length);
      }
      for (const key of committedKeys) {
        releasePendingKey(key);
      }
      refreshPendingDisplay();
      if (shouldRefetchWall) {
        fetchWall();
        loadBudget();
      }
    }
  };

  const enqueueCommit = (cells: PendingWallCell[], commitMode: 'paint' | 'erase') => {
    if (cells.length === 0) return;
    if (commitMode === 'erase') {
      reservedEraseRef.current += cells.length;
    } else {
      reservedPaintRef.current += cells.length;
    }
    refreshPendingDisplay();
    void commitCells(cells, commitMode);
  };

  const getCellFromEvent = (e: MouseEvent | Touch): { x: number; y: number } | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / COLS));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / ROWS));
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null;
    return { x, y };
  };

  const addToPending = (x: number, y: number) => {
    const key = getCellKey(x, y);
    if (dragKeysRef.current.has(key) || hasPendingKey(x, y)) return;

    if (mode === 'paint') {
      if (!budget || budget.remaining - getReservedPaintCount() <= 0) return;
      pendingRef.current.push({ x, y, char: selectedChar, color: selectedColor });
      dragKeysRef.current.add(key);
      refreshPendingDisplay();
      retainPendingKey(x, y);
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        if (!next[y]) return prev;
        next[y] = [...next[y]];
        next[y][x] = { char: selectedChar, color: selectedColor, placedAt: Date.now(), isMine: true };
        return next;
      });
    } else {
      const cell = grid[y]?.[x];
      if (!cell || !cell.isMine) return; // only erase own cells
      if (!budget || budget.refundsLeft - getReservedEraseCount() <= 0) return;
      pendingRef.current.push({ x, y });
      dragKeysRef.current.add(key);
      refreshPendingDisplay();
      retainPendingKey(x, y);
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        next[y] = [...next[y]];
        next[y][x] = null;
        return next;
      });
    }

    flush();
  };

  const flush = () => {
    const cells = [...pendingRef.current];
    pendingRef.current = [];
    refreshPendingDisplay();
    if (cells.length > 0) {
      enqueueCommit(cells, cells.some(({ char }) => char !== undefined) ? 'paint' : 'erase');
    }
  };

  const handleDown = (e: MouseEvent | TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e;
    const pos = getCellFromEvent(touch);
    if (!pos) return;
    e.preventDefault();
    dragging.current = true;
    pendingRef.current = [];
    dragKeysRef.current = new Set();
    refreshPendingDisplay();
    addToPending(pos.x, pos.y);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e;
    const pos = getCellFromEvent(touch);
    setHoverPos(pos);
    if (!dragging.current || !pos) return;
    e.preventDefault();
    addToPending(pos.x, pos.y);
  };

  const handleUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    flush();
    dragKeysRef.current = new Set();
  };

  const handleLeave = () => {
    setHoverPos(null);
    if (dragging.current) {
      dragging.current = false;
      flush();
      dragKeysRef.current = new Set();
    }
  };

  const selectWallChar = (value: unknown) => {
    const char = normalizeWallChar(value);
    if (!char) return;
    setMode('paint');
    setSelectedChar(char);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        selectWallChar(e.key);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    let disposed = false;

    const loadToolPreference = async () => {
      try {
        const { response, data } = await fetchWallToolPreference();
        if (disposed || !response.ok || !data || typeof data !== 'object') return;
        const payload = data as { signedIn?: boolean; preference?: unknown };
        if (payload.signedIn) {
          const preference = normalizeWallToolPreference(payload.preference);
          if (preference) {
            setSelectedChar(preference.char);
            setSelectedColor(preference.color);
            setMode(preference.mode);
          } else {
            setSelectedChar(DEFAULT_WALL_TOOL.char);
            setSelectedColor(DEFAULT_WALL_TOOL.color);
            setMode(DEFAULT_WALL_TOOL.mode);
          }
          setPreferenceOwner('account');
        } else {
          const preference = readGuestWallToolPreference();
          if (preference) {
            setSelectedChar(preference.char);
            setSelectedColor(preference.color);
            setMode(preference.mode);
          }
          setPreferenceOwner('guest');
        }
      } catch {
        if (!disposed) setPreferenceOwner('guest');
      } finally {
        if (!disposed) preferenceLoadedRef.current = true;
      }
    };

    void loadToolPreference();

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    if (!preferenceLoadedRef.current) return;
    const preference = normalizeWallToolPreference({ char: selectedChar, color: selectedColor, mode }) || DEFAULT_WALL_TOOL;

    if (preferenceOwner === 'guest' || preferenceOwner === 'unknown') {
      writeGuestWallToolPreference(preference);
      return;
    }

    if (preferenceSaveTimerRef.current !== null) {
      window.clearTimeout(preferenceSaveTimerRef.current);
    }
    preferenceSaveTimerRef.current = window.setTimeout(() => {
      preferenceSaveTimerRef.current = null;
      void saveWallToolPreference(preference);
    }, 300);
  }, [mode, preferenceOwner, selectedChar, selectedColor]);

  useEffect(() => {
    return () => {
      if (preferenceSaveTimerRef.current !== null) {
        window.clearTimeout(preferenceSaveTimerRef.current);
      }
    };
  }, []);

  const getCellColor = (cell: Cell): string => {
    const age = Date.now() - cell.placedAt;
    const base = COLORS[cell.color] || COLORS.white;
    if (age > FADE_MS) {
      const fadeProgress = Math.min((age - FADE_MS) / (EXPIRE_MS - FADE_MS), 1);
      const opacity = 0.8 - fadeProgress * 0.6;
      return base + Math.round(opacity * 255).toString(16).padStart(2, '0');
    }
    return base;
  };

  if (grid.length === 0) {
    return <div class="wall-loading">loading wall…</div>;
  }

  const isMine = (cell: Cell | null) => !!cell?.isMine;
  const displayBudget = budget ? {
    remaining: Math.max(0, budget.remaining - getReservedPaintCount() + getReservedEraseCount()),
    refundsLeft: Math.max(0, budget.refundsLeft - getReservedEraseCount()),
  } : null;

  return (
    <div class="wall-container">
      <button type="button" class="wall-info-btn" onClick={() => setShowInfo(true)} title="how it works" aria-label="How the wall works">?</button>
      {showInfo && (
        <div class="wall-info-overlay" onClick={() => { setShowInfo(false); localStorage.setItem('wall-info-seen', '1'); }}>
          <div class="wall-info-popup" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="wall-info-title">
            <div class="wall-info-title" id="wall-info-title">the wall</div>
            <p>a shared wall to draw on with ASCII, leave behind kind remarks, or write over existing stuff :P</p>
            <p><strong>budget:</strong> 100 chars per day. resets every 24 hours.</p>
            <p><strong>erase:</strong> you can erase your own cells. each erase gives 1 char back, up to 200 refunds per day.</p>
            <p><strong>decay:</strong> marks fade after 1 day and disappear after 3.</p>
            <p><strong>controls:</strong> click or drag to place. type to change character. use paint/erase to switch modes.</p>
            <button type="button" class="wall-info-close" onClick={() => { setShowInfo(false); localStorage.setItem('wall-info-seen', '1'); }}>got it</button>
          </div>
        </div>
      )}
      <div class="wall-hud">
        {displayBudget && <span class="wall-budget">{displayBudget.remaining} chars</span>}
        {displayBudget && <span class="wall-erases">{displayBudget.refundsLeft} refunds</span>}
      </div>
      {errorMsg && <div class="wall-error">{errorMsg}</div>}
      <div class="wall-grid-wrapper">
        <div
          ref={gridRef}
          class="wall-grid"
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={handleUp}
          onMouseLeave={handleLeave}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onTouchEnd={handleUp}
          onTouchCancel={handleUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isHover = hoverPos?.x === x && hoverPos?.y === y;
              const mine = isMine(cell);

              // In erase mode: dim other people's cells, hide empty cells, highlight own cells
              if (mode === 'erase') {
                if (cell) {
                  if (mine) {
                    return (
                      <span
                        key={`${x}-${y}`}
                        class={`wall-cell wall-erasable${isHover ? ' wall-hover-erase' : ''}`}
                        style={{ color: getCellColor(cell) }}
                      >
                        {cell.char}
                      </span>
                    );
                  }
                  // Someone else's cell — dim it
                  return (
                    <span
                      key={`${x}-${y}`}
                      class="wall-cell wall-dimmed"
                      style={{ color: getCellColor(cell) }}
                    >
                      {cell.char}
                    </span>
                  );
                }
                return (
                  <span key={`${x}-${y}`} class="wall-cell wall-empty-erase"> </span>
                );
              }

              // Paint mode
              if (cell) {
                return (
                  <span
                    key={`${x}-${y}`}
                    class="wall-cell"
                    style={{ color: getCellColor(cell) }}
                  >
                    {cell.char}
                  </span>
                );
              }
              return (
                <span
                  key={`${x}-${y}`}
                  class={`wall-cell wall-empty${isHover ? ' wall-hover' : ''}`}
                  style={isHover ? { color: COLORS[selectedColor] + '66' } : undefined}
                >
                  {isHover ? selectedChar : '·'}
                </span>
              );
            })
          )}
        </div>
      </div>
      <div class="wall-palette">
        <div class="wall-toolbar">
          <button
            type="button"
            class={`wall-mode-btn${mode === 'paint' ? ' wall-mode-active' : ''}`}
            onClick={() => setMode('paint')}
            aria-pressed={mode === 'paint'}
          >paint</button>
          <button
            type="button"
            class={`wall-mode-btn${mode === 'erase' ? ' wall-mode-active' : ''}`}
            onClick={() => setMode('erase')}
            aria-pressed={mode === 'erase'}
          >erase</button>
          <span class="wall-mode-hint">click a mode</span>
        </div>
        <div class="wall-tools" style={`min-height: 3.5rem;`}>
          {mode === 'paint' ? (
            <>
              <label class="wall-char-control">
                <span class="wall-char-label">character</span>
                <span class="wall-char-preview" aria-hidden="true">{selectedChar}</span>
                <input
                  type="text"
                  class="wall-char-input"
                  value={selectedChar}
                  maxLength={1}
                  inputMode="text"
                  autoCapitalize="characters"
                  spellcheck={false}
                  aria-label="Wall character"
                  onInput={(event) => selectWallChar((event.currentTarget as HTMLInputElement).value)}
                  onFocus={(event) => (event.currentTarget as HTMLInputElement).select()}
                />
              </label>
              <div class="wall-mode-hint">type any key — letters save uppercase, numbers work too</div>
              <div class="wall-colors" aria-label="Wall color palette">
                {Object.entries(COLORS).map(([name, hex]) => (
                  <button
                    type="button"
                    key={name}
                    class={`wall-color-btn${name === selectedColor ? ' wall-color-active' : ''}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => setSelectedColor(name)}
                    title={name}
                    aria-label={`Select ${name} color`}
                    aria-pressed={name === selectedColor}
                  />
                ))}
              </div>
            </>
          ) : (
            <div class="wall-erase-hint">click your own cells to erase them</div>
          )}
        </div>
      </div>
    </div>
  );
}
