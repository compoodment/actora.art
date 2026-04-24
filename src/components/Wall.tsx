import { useEffect, useRef, useState } from 'preact/hooks';
import {
  eraseWallCells,
  fetchWallBudget,
  fetchWallState,
  paintWallCells,
  type WallBudgetResponse,
  type WallCell,
  type WallStateResponse,
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

const PALETTE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?.,:;-+=/\\|_@#*█▓░▒─│╔╗╚╝═║';
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

export default function Wall() {
  const [grid, setGrid] = useState<(Cell | null)[][]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [selectedChar, setSelectedChar] = useState('█');
  const [selectedColor, setSelectedColor] = useState('white');
  const [mode, setMode] = useState<'paint' | 'erase'>('paint');
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [, setPendingDisplayRevision] = useState(0);
  const [showInfo, setShowInfo] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('wall-info-seen');
  });
  const gridRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pendingRef = useRef<{ x: number; y: number; char?: string; color?: string }[]>([]);
  const pendingKeysRef = useRef<Map<string, number>>(new Map());
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

  const commitCells = async (cells: { x: number; y: number; char?: string; color?: string }[]) => {
    if (cells.length === 0) return;
    const isErase = mode === 'erase';
    const committedKeys = cells.map(({ x, y }) => getCellKey(x, y));
    let shouldLoadBudget = false;
    try {
      const { response, data } = isErase
        ? await eraseWallCells(cells.map(({ x, y }) => ({ x, y })))
        : await paintWallCells(cells.map(({ x, y, char, color }) => ({ x, y, char: char || '█', color })));

      if (response.ok) {
        const payload = data as Partial<WallBudgetResponse>;
        setBudget(prev => prev ? {
          ...prev,
          remaining: payload.remaining ?? prev.remaining,
          refundsLeft: payload.refundsLeft ?? prev.refundsLeft,
        } : null);
      } else if (response.status === 429) {
        const errorCode = (data && typeof data === 'object' ? (data as { error?: string }).error : undefined);
        setErrorMsg(errorCode === 'refund_limit_reached' ? 'no refunds left' : 'no chars left — come back tomorrow');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch {
      shouldLoadBudget = true;
    } finally {
      for (const key of committedKeys) {
        releasePendingKey(key);
      }
      fetchWall();
      if (shouldLoadBudget) loadBudget();
    }
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
    if (pendingRef.current.some(c => c.x === x && c.y === y)) return;

    if (mode === 'paint') {
      if (!budget || budget.remaining - pendingRef.current.length <= 0) return;
      pendingRef.current.push({ x, y, char: selectedChar, color: selectedColor });
      refreshPendingDisplay();
      retainPendingKey(x, y);
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        if (!next[y]) return prev;
        next[y] = [...next[y]];
        next[y][x] = { char: selectedChar, color: selectedColor, placedAt: Date.now() };
        return next;
      });
    } else {
      const cell = grid[y]?.[x];
      if (!cell || !cell.isMine) return; // only erase own cells
      if (!budget || budget.refundsLeft - pendingRef.current.length <= 0) return;
      pendingRef.current.push({ x, y });
      refreshPendingDisplay();
      retainPendingKey(x, y);
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        next[y] = [...next[y]];
        next[y][x] = null;
        return next;
      });
    }
  };

  const flush = () => {
    const cells = [...pendingRef.current];
    pendingRef.current = [];
    refreshPendingDisplay();
    if (cells.length > 0) commitCells(cells);
  };

  const handleDown = (e: MouseEvent | TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e;
    const pos = getCellFromEvent(touch);
    if (!pos) return;
    e.preventDefault();
    dragging.current = true;
    pendingRef.current = [];
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
  };

  const handleLeave = () => {
    setHoverPos(null);
    if (dragging.current) {
      dragging.current = false;
      flush();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setMode('paint');
        const idx = PALETTE_CHARS.indexOf(e.key.toUpperCase());
        setSelectedChar(idx >= 0 ? PALETTE_CHARS[idx] : e.key);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
  const pendingCount = pendingRef.current.length;
  const displayBudget = budget ? {
    remaining: Math.max(0, mode === 'erase' ? budget.remaining + pendingCount : budget.remaining - pendingCount),
    refundsLeft: Math.max(0, mode === 'erase' ? budget.refundsLeft - pendingCount : budget.refundsLeft),
  } : null;

  return (
    <div class="wall-container">
      <button type="button" class="wall-info-btn" onClick={() => setShowInfo(true)} title="how it works" aria-label="How the wall works">?</button>
      {showInfo && (
        <div class="wall-info-overlay" onClick={() => { setShowInfo(false); localStorage.setItem('wall-info-seen', '1'); }}>
          <div class="wall-info-popup" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="wall-info-title">
            <div class="wall-info-title" id="wall-info-title">the wall</div>
            <p>a shared wall to draw on with ASCII, leave behind kind remarks, or write over existing stuff :P</p>
            <p><strong>budget:</strong> 100 chars per day. resets at midnight UTC.</p>
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
              <div class="wall-chars">
                {PALETTE_CHARS.split('').map(ch => (
                  <button
                    type="button"
                    key={ch}
                    class={`wall-char-btn${ch === selectedChar ? ' wall-char-active' : ''}`}
                    onClick={() => setSelectedChar(ch)}
                    aria-pressed={ch === selectedChar}
                    aria-label={`Select character ${ch}`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
              <div class="wall-colors">
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
