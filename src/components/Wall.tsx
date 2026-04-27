import { useEffect, useRef, useState } from 'preact/hooks';
import {
  eraseWallCells,
  fetchWallBudget,
  fetchWallState,
  fetchWallToolPreference,
  paintWallCells,
  redoWallAction,
  saveWallToolPreference,
  undoWallAction,
  type WallBudgetResponse,
  type WallCell,
  type WallHistoryResponse,
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
  canUndo: boolean;
  canRedo: boolean;
}

interface WallPatchEvent {
  cells: {
    x: number;
    y: number;
    cell: WallCell | null;
  }[];
}

const PALETTE_CHARS = [
  '!', '?', '.', ',', ':', ';', '-', '+', '=', '/', '\\', '|', '_', '@', '#', '*', '$', '€', '%', '&', '~', '^',
  '"', '\'', '`', '(', ')', '[', ']', '{', '}', '<', '>',
  '█', '▓', '▒', '░', '■', '□', '▲', '△', '▼', '▽', '◆', '◇', '●', '○', '★', '☆',
  '─', '│', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼', '═', '║', '╔', '╗', '╚', '╝', '╠', '╣', '╦', '╩', '╬',
];
const WALL_TOOL_STORAGE_KEY = 'wall-tool-preference';
const SAVED_COLOR_SLOT_COUNT = 4;
const DEFAULT_WALL_TOOL: WallToolPreference = {
  char: '█',
  color: '#ffffff',
  mode: 'paint',
};
const LEGACY_COLORS: Record<string, string> = {
  red: '#ff6b6b',
  green: '#51cf66',
  yellow: '#fcc419',
  cyan: '#22b8cf',
  magenta: '#cc5de8',
  white: '#e0e0e0',
  brightWhite: '#ffffff',
};
const BASIC_WALL_COLORS = ['#ffffff', '#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#00c7be', '#007aff', '#5856d6'];
const PICKER_MAX_COLOR_VALUE = 0.93;

const COLS = 80;
const ROWS = 24;
const WALL_RECOVERY_MS = 15000;
const WALL_FADE_TICK_MS = 60 * 1000;
const WALL_REFUND_MS = 24 * 60 * 60 * 1000;
const EXPIRE_MS = 3 * 24 * 60 * 60 * 1000;
const MIN_WALL_OPACITY = 0.08;

type PendingWallCell = { x: number; y: number; char?: string; color?: string; previousCell?: Cell | null; actionId?: string; refundable?: boolean };
type WallPreferenceOwner = 'unknown' | 'guest' | 'account';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const isHexWallColor = (color: string) => /^#[0-9a-f]{6}$/i.test(color);
const hexToRgb = (hex: string) => {
  if (!isHexWallColor(hex)) return null;
  const value = hex.slice(1);
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
};
const rgbToHex = (r: number, g: number, b: number) => `#${[r, g, b].map(value => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')).join('')}`;
const hsvToHex = (hue: number, saturation: number, value: number) => {
  const h = ((hue % 360) + 360) % 360;
  const s = clamp(saturation, 0, 1);
  const v = clamp(value, 0, PICKER_MAX_COLOR_VALUE);
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  const [r1, g1, b1] = h < 60 ? [c, x, 0]
    : h < 120 ? [x, c, 0]
      : h < 180 ? [0, c, x]
        : h < 240 ? [0, x, c]
          : h < 300 ? [x, 0, c]
            : [c, 0, x];
  return rgbToHex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
};
const hexToHsv = (hex: string) => {
  const rgb = hexToRgb(hex) || hexToRgb(LEGACY_COLORS[hex] || DEFAULT_WALL_TOOL.color)!;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  return {
    hue: (hue + 360) % 360,
    saturation: max === 0 ? 0 : delta / max,
    value: max,
  };
};
const isAllowedWallColor = (color: string) => {
  if (Object.prototype.hasOwnProperty.call(LEGACY_COLORS, color)) return true;
  return isHexWallColor(color);
};
const normalizeSavedColors = (value: unknown, includeFallback = false): (string | null)[] => {
  const fallback = Array(SAVED_COLOR_SLOT_COUNT).fill(null) as (string | null)[];
  if (!Array.isArray(value)) return includeFallback ? fallback : [];
  const normalized = value.slice(0, SAVED_COLOR_SLOT_COUNT).map(color => {
    if (typeof color !== 'string') return null;
    return isAllowedWallColor(color) ? color : null;
  });
  while (normalized.length < SAVED_COLOR_SLOT_COUNT) normalized.push(null);
  return normalized;
};

const normalizeWallChar = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.length !== 1) return null;
  const upper = value.toUpperCase();
  return upper.length === 1 ? upper : value;
};

const createWallActionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

const normalizeWallToolPreference = (value: unknown): WallToolPreference | null => {
  if (!value || typeof value !== 'object') return null;
  const preference = value as Partial<WallToolPreference>;
  const char = normalizeWallChar(preference.char);
  if (!char || !isAllowedWallColor(String(preference.color || ''))) return null;
  const normalized: WallToolPreference = {
    char,
    color: String(preference.color),
    mode: preference.mode === 'erase' ? 'erase' : 'paint',
  };
  if (Array.isArray(preference.savedColors)) {
    normalized.savedColors = normalizeSavedColors(preference.savedColors, true);
  }
  return normalized;
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
  const [picker, setPicker] = useState(() => hexToHsv((readGuestWallToolPreference() || DEFAULT_WALL_TOOL).color));
  const [mode, setMode] = useState<'paint' | 'erase'>(() => (readGuestWallToolPreference() || DEFAULT_WALL_TOOL).mode);
  const [savedColors, setSavedColors] = useState<(string | null)[]>(() => normalizeSavedColors(null, true));
  const [preferenceOwner, setPreferenceOwner] = useState<WallPreferenceOwner>('unknown');
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [, setPendingDisplayRevision] = useState(0);
  const [wallTime, setWallTime] = useState(() => Date.now());
  const [historyBusy, setHistoryBusy] = useState(false);
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
  const deferredPatchCellsRef = useRef<Map<string, Cell | null>>(new Map());
  const dragKeysRef = useRef<Set<string>>(new Set());
  const reservedPaintRef = useRef(0);
  const reservedEraseRef = useRef(0);
  const recoveryIntervalRef = useRef<number | null>(null);
  const dragActionIdRef = useRef<string | null>(null);

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
      return true;
    }
    pendingKeysRef.current.set(key, count - 1);
    return false;
  };

  const applyBudgetState = (payload: Partial<WallBudgetResponse>) => {
    setBudget(prev => {
      if (!prev) return null;
      return {
        ...prev,
        maxDaily: payload.maxDaily ?? prev.maxDaily,
        nextResetAt: payload.nextResetAt ?? prev.nextResetAt,
        remaining: payload.remaining ?? prev.remaining,
        refundsLeft: payload.refundsLeft ?? prev.refundsLeft,
        canUndo: payload.canUndo ?? prev.canUndo,
        canRedo: payload.canRedo ?? prev.canRedo,
      };
    });
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
        if (hasPendingKey(x, y)) {
          deferredPatchCellsRef.current.set(getCellKey(x, y), cell);
          continue;
        }
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
        const payload = data as WallBudgetResponse;
        setBudget({
          maxDaily: payload.maxDaily,
          nextResetAt: payload.nextResetAt,
          remaining: payload.remaining,
          refundsLeft: payload.refundsLeft,
          canUndo: !!payload.canUndo,
          canRedo: !!payload.canRedo,
        });
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
  const getPendingRefundableEraseCount = () => pendingRef.current.filter(({ char, refundable }) => char === undefined && refundable).length;
  const getRefundableEraseCount = (cells: PendingWallCell[]) => cells.filter(({ char, refundable }) => char === undefined && refundable).length;
  const getReservedPaintCount = () => getPendingPaintCount() + reservedPaintRef.current;
  const getReservedEraseCount = () => getPendingRefundableEraseCount() + reservedEraseRef.current;

  const commitCells = async (cells: PendingWallCell[], commitMode: 'paint' | 'erase') => {
    if (cells.length === 0) return;
    const isErase = commitMode === 'erase';
    const committedKeys = cells.map(({ x, y }) => getCellKey(x, y));
    let shouldRefetchWall = false;
    let shouldRestoreOptimisticCells = false;
    try {
      const { response, data } = isErase
        ? await eraseWallCells(cells.map(({ x, y }) => ({ x, y })), cells[0]?.actionId)
        : await paintWallCells(cells.map(({ x, y, char, color }) => ({ x, y, char: normalizeWallChar(char) || '█', color })), cells[0]?.actionId);

      if (response.ok) {
        const payload = data as Partial<WallBudgetResponse> & { placed?: number; erased?: number };
        applyBudgetState(payload);
        if (isErase) {
          shouldRefetchWall = true;
        }
      } else if (response.status === 429) {
        const errorCode = (data && typeof data === 'object' ? (data as { error?: string }).error : undefined);
        setErrorMsg(errorCode === 'refund_limit_reached' ? 'no refunds left' : 'no chars left — come back tomorrow');
        setTimeout(() => setErrorMsg(''), 3000);
        const payload = data as Partial<WallBudgetResponse> | null;
        if (payload && typeof payload === 'object') {
          applyBudgetState(payload);
        }
        shouldRestoreOptimisticCells = true;
        shouldRefetchWall = true;
      } else {
        shouldRestoreOptimisticCells = true;
        shouldRefetchWall = true;
      }
    } catch {
      shouldRestoreOptimisticCells = true;
      shouldRefetchWall = true;
    } finally {
      if (isErase) {
        reservedEraseRef.current = Math.max(0, reservedEraseRef.current - getRefundableEraseCount(cells));
      } else {
        reservedPaintRef.current = Math.max(0, reservedPaintRef.current - cells.length);
      }
      const deferredCells: { x: number; y: number; cell: Cell | null }[] = [];
      for (const key of committedKeys) {
        const released = releasePendingKey(key);
        if (released && deferredPatchCellsRef.current.has(key)) {
          const [x, y] = key.split(':').map(Number);
          const cell = deferredPatchCellsRef.current.get(key) ?? null;
          deferredPatchCellsRef.current.delete(key);
          if (!shouldRestoreOptimisticCells && Number.isFinite(x) && Number.isFinite(y)) {
            deferredCells.push({ x, y, cell });
          }
        }
      }
      if (deferredCells.length > 0) {
        setGrid(prev => {
          if (prev.length === 0) return prev;
          const next = prev.map(row => [...row]);
          let changed = false;
          for (const { x, y, cell } of deferredCells) {
            if (hasPendingKey(x, y)) continue;
            if (!next[y]) continue;
            next[y][x] = cell;
            changed = true;
          }
          return changed ? next : prev;
        });
      }
      if (shouldRestoreOptimisticCells) {
        setGrid(prev => {
          if (prev.length === 0) return prev;
          const next = prev.map(row => [...row]);
          let changed = false;
          for (const cell of cells) {
            if (hasPendingKey(cell.x, cell.y)) continue;
            if (!next[cell.y]) continue;
            next[cell.y][cell.x] = cell.previousCell ?? null;
            changed = true;
          }
          return changed ? next : prev;
        });
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
      reservedEraseRef.current += getRefundableEraseCount(cells);
    } else {
      reservedPaintRef.current += cells.length;
    }
    refreshPendingDisplay();
    void commitCells(cells, commitMode);
  };

  const handleHistoryAction = async (direction: 'undo' | 'redo') => {
    if (historyBusy || pendingKeysRef.current.size > 0) return;
    const available = direction === 'undo' ? budget?.canUndo : budget?.canRedo;
    if (!available) return;
    setHistoryBusy(true);
    try {
      const { response, data } = direction === 'undo' ? await undoWallAction() : await redoWallAction();
      if (response.ok && data && typeof data === 'object') {
        const payload = data as WallHistoryResponse;
        applyBudgetState(payload);
        if (payload.changed > 0) {
          fetchWall();
        }
      } else {
        fetchWall();
        loadBudget();
      }
    } catch {
      fetchWall();
      loadBudget();
    } finally {
      setHistoryBusy(false);
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
    const key = getCellKey(x, y);
    if (dragKeysRef.current.has(key) || hasPendingKey(x, y)) return;

    if (mode === 'paint') {
      if (!budget || budget.remaining - getReservedPaintCount() <= 0) return;
      pendingRef.current.push({ x, y, char: selectedChar, color: selectedColor, previousCell: grid[y]?.[x] ?? null, actionId: dragActionIdRef.current || undefined });
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
      if (!cell || !cell.isMine) return; // only erase your visible cells
      if (!budget) return;
      const refundable = isCellRefundable(cell);
      if (refundable && budget.refundsLeft - getReservedEraseCount() <= 0) return;
      pendingRef.current.push({ x, y, previousCell: cell, actionId: dragActionIdRef.current || undefined, refundable });
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
    dragActionIdRef.current = createWallActionId();
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
    dragActionIdRef.current = null;
  };

  const handleLeave = () => {
    setHoverPos(null);
    if (dragging.current) {
      dragging.current = false;
      flush();
      dragKeysRef.current = new Set();
      dragActionIdRef.current = null;
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setMode('paint');
        const char = normalizeWallChar(e.key);
        if (!char) return;
        setSelectedChar(char);
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
            chooseColor(preference.color);
            setMode(preference.mode);
            setSavedColors(normalizeSavedColors(preference.savedColors, true));
          } else {
            setSelectedChar(DEFAULT_WALL_TOOL.char);
            chooseColor(DEFAULT_WALL_TOOL.color);
            setMode(DEFAULT_WALL_TOOL.mode);
            setSavedColors(normalizeSavedColors(null, true));
          }
          setPreferenceOwner('account');
        } else {
          const preference = readGuestWallToolPreference();
          if (preference) {
            setSelectedChar(preference.char);
            chooseColor(preference.color);
            setMode(preference.mode);
          }
          setSavedColors(normalizeSavedColors(null, true));
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
    const preference = normalizeWallToolPreference({
      char: selectedChar,
      color: selectedColor,
      mode,
      savedColors: preferenceOwner === 'account' ? savedColors : undefined,
    }) || DEFAULT_WALL_TOOL;

    if (preferenceOwner === 'guest' || preferenceOwner === 'unknown') {
      writeGuestWallToolPreference({ char: preference.char, color: preference.color, mode: preference.mode });
      return;
    }

    if (preferenceSaveTimerRef.current !== null) {
      window.clearTimeout(preferenceSaveTimerRef.current);
    }
    preferenceSaveTimerRef.current = window.setTimeout(() => {
      preferenceSaveTimerRef.current = null;
      void saveWallToolPreference(preference);
    }, 300);
  }, [mode, preferenceOwner, savedColors, selectedChar, selectedColor]);

  useEffect(() => {
    const timer = window.setInterval(() => setWallTime(Date.now()), WALL_FADE_TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (preferenceSaveTimerRef.current !== null) {
        window.clearTimeout(preferenceSaveTimerRef.current);
      }
    };
  }, []);

  const getCellAge = (cell: Cell) => Math.max(0, wallTime - cell.placedAt);
  const isCellRefundable = (cell: Cell) => getCellAge(cell) < WALL_REFUND_MS;
  const getCellColor = (cell: Cell): string => {
    const age = getCellAge(cell);
    const base = LEGACY_COLORS[cell.color] || (isAllowedWallColor(cell.color) ? cell.color : LEGACY_COLORS.white);
    const fadeProgress = Math.min(age / EXPIRE_MS, 1);
    const opacity = 1 - fadeProgress * (1 - MIN_WALL_OPACITY);
    return base + Math.round(opacity * 255).toString(16).padStart(2, '0');
  };
  const getToolColor = (color: string) => LEGACY_COLORS[color] || (isAllowedWallColor(color) ? color : LEGACY_COLORS.white);
  const chooseColor = (color: string) => {
    const hex = getToolColor(color).toLowerCase();
    setSelectedColor(hex);
    setPicker(hexToHsv(hex));
  };
  const choosePickerColor = (nextPicker: { hue: number; saturation: number; value: number }) => {
    const normalizedPicker = {
      hue: clamp(nextPicker.hue, 0, 360),
      saturation: clamp(nextPicker.saturation, 0, 1),
      value: clamp(nextPicker.value, 0, PICKER_MAX_COLOR_VALUE),
    };
    setPicker(normalizedPicker);
    setSelectedColor(hsvToHex(normalizedPicker.hue, normalizedPicker.saturation, normalizedPicker.value));
  };
  const pickColorFromPanel = (event: MouseEvent) => {
    const rect = (event.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const saturation = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const rawValue = 1 - clamp((event.clientY - rect.top) / rect.height, 0, 1);
    choosePickerColor({ ...picker, saturation, value: rawValue });
  };
  const selectSavedColorSlot = (index: number) => {
    if (preferenceOwner !== 'account') return;
    const existing = savedColors[index];
    if (existing) {
      chooseColor(existing);
      return;
    }
    setSavedColors(prev => prev.map((color, idx) => idx === index ? selectedColor : color));
  };
  const saveSelectedColorToSlot = (index: number) => {
    if (preferenceOwner !== 'account') return;
    setSavedColors(prev => prev.map((color, idx) => idx === index ? selectedColor : color));
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
            <p><strong>erase:</strong> you can erase your own visible cells. fresh cells give 1 char back for the first day, up to 200 refunds per reset.</p>
            <p><strong>decay:</strong> chars gradually fade for 3 days, then disappear.</p>
            <p><strong>controls:</strong> click or drag to place. type to select letters/numbers and characters. use paint/erase to place chars and remove chars. undo/redo can reverse recent confirmed actions.</p>
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

              // In erase mode: dim other people's visible cells, hide empty cells, highlight own visible cells
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
                  style={isHover ? { color: getToolColor(selectedColor) + '66' } : undefined}
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
          <div class="wall-mode-row">
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
            <button
              type="button"
              class="wall-history-btn"
              onClick={() => handleHistoryAction('undo')}
              disabled={historyBusy || pendingKeysRef.current.size > 0 || !budget?.canUndo}
              title="undo"
              aria-label="Undo last wall action"
            >undo</button>
            <button
              type="button"
              class="wall-history-btn"
              onClick={() => handleHistoryAction('redo')}
              disabled={historyBusy || pendingKeysRef.current.size > 0 || !budget?.canRedo}
              title="redo"
              aria-label="Redo last undone wall action"
            >redo</button>
            <span class="wall-mode-hint">click a mode</span>
          </div>
          <span class="wall-selected-wrap">
            <span class="wall-selected-char" aria-label={`Selected character ${selectedChar}`}>{selectedChar}</span>
            <span class="wall-type-hint">type letters/numbers</span>
          </span>
        </div>
        <div class="wall-tools" style={`min-height: 3.5rem;`}>
          {mode === 'paint' ? (
            <>
              <div class="wall-chars">
                {PALETTE_CHARS.map(ch => (
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
              <div class="wall-color-section">
                <div class="wall-color-label">basic colors</div>
                <div class="wall-colors">
                  {BASIC_WALL_COLORS.map(hex => (
                  <button
                    type="button"
                    key={hex}
                    class={`wall-color-btn${hex === selectedColor ? ' wall-color-active' : ''}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => chooseColor(hex)}
                    title={hex}
                    aria-label={`Select color ${hex}`}
                    aria-pressed={hex === selectedColor}
                  />
                  ))}
                </div>
              </div>
              <div class="wall-color-section">
                <div class="wall-color-label">custom color</div>
                <div class="wall-color-picker">
                  <button
                    type="button"
                    class="wall-color-field"
                    style={{ backgroundColor: hsvToHex(picker.hue, 1, 1) }}
                    onClick={pickColorFromPanel}
                    aria-label="Pick saturation and brightness"
                  >
                    <span
                      class="wall-color-target"
                      style={{ left: `${picker.saturation * 100}%`, top: `${(1 - picker.value) * 100}%` }}
                    />
                  </button>
                  <input
                    class="wall-hue-slider"
                    type="range"
                    min="0"
                    max="360"
                    value={String(Math.round(picker.hue))}
                    aria-label="Color hue"
                    onInput={(event) => choosePickerColor({ ...picker, hue: Number((event.currentTarget as HTMLInputElement).value) })}
                  />
                  <div class="wall-color-current">
                    <span class="wall-color-preview" style={{ backgroundColor: getToolColor(selectedColor) }} />
                    <span class="wall-color-value">{getToolColor(selectedColor)}</span>
                  </div>
                </div>
              </div>
              {preferenceOwner === 'account' ? (
                <div class="wall-saved-colors" aria-label="Saved account colors">
                  <div class="wall-saved-label">saved colors</div>
                  <div class="wall-saved-slots">
                    {savedColors.map((hex, index) => (
                      <div class="wall-saved-slot-wrap" key={index}>
                        <button
                          type="button"
                          class={`wall-saved-color-btn${hex && hex === selectedColor ? ' wall-color-active' : ''}${hex ? '' : ' wall-saved-empty'}`}
                          style={hex ? { backgroundColor: getToolColor(hex) } : undefined}
                          onClick={() => selectSavedColorSlot(index)}
                          aria-label={hex ? `Select saved color ${index + 1}` : `Save current color to slot ${index + 1}`}
                          title={hex ? `select slot ${index + 1}` : `save current color to slot ${index + 1}`}
                        />
                        <button
                          type="button"
                          class="wall-save-color-btn"
                          onClick={() => saveSelectedColorToSlot(index)}
                          aria-label={`Save current color to slot ${index + 1}`}
                          title={`save current color to slot ${index + 1}`}
                        >+</button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div class="wall-erase-hint">click your own visible cells to erase them</div>
          )}
        </div>
      </div>
    </div>
  );
}
