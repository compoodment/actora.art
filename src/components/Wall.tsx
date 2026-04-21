import { useEffect, useRef, useState } from 'preact/hooks';

interface Cell {
  char: string;
  color: string;
  placedAt: number;
  ip?: string;
}

interface Budget {
  remaining: number;
  refundsLeft: number;
  maxDaily: number;
  nextResetAt: number;
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
const POLL_MS = 5000;
const FADE_MS = 1 * 24 * 60 * 60 * 1000;
const EXPIRE_MS = 3 * 24 * 60 * 60 * 1000;

export default function Wall() {
  const [grid, setGrid] = useState<(Cell | null)[][]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [myIp, setMyIp] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState('█');
  const [selectedColor, setSelectedColor] = useState('white');
  const [mode, setMode] = useState<'paint' | 'erase'>('paint');
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const gridRef = useRef<HTMLPreElement>(null);
  const dragging = useRef(false);
  const pendingRef = useRef<{ x: number; y: number; char?: string; color?: string }[]>([]);

  const fetchWall = async () => {
    try {
      const res = await fetch('/api/wall');
      const data = await res.json();
      if (data.grid) setGrid(data.grid);
      if (data.yourIp) setMyIp(data.yourIp);
    } catch {}
  };

  const fetchBudget = async () => {
    try {
      const res = await fetch('/api/wall/budget');
      const data = await res.json();
      setBudget(data);
    } catch {}
  };

  useEffect(() => {
    fetchWall();
    fetchBudget();
    const interval = setInterval(() => { fetchWall(); fetchBudget(); }, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  const commitCells = async (cells: { x: number; y: number; char?: string; color?: string }[]) => {
    if (cells.length === 0) return;
    const isErase = mode === 'erase';
    try {
      const res = await fetch(isErase ? '/api/wall/erase' : '/api/wall/paint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cells }),
      });
      const data = await res.json();
      if (res.ok) {
        setBudget(prev => prev ? {
          ...prev,
          remaining: data.remaining ?? prev.remaining,
          refundsLeft: data.refundsLeft ?? prev.refundsLeft,
        } : null);
      } else if (res.status === 429) {
        setErrorMsg(data.error === 'refund_limit_reached' ? 'no refunds left' : 'no chars left — come back tomorrow');
        setTimeout(() => setErrorMsg(''), 3000);
      }
      fetchWall();
    } catch {}
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
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        if (!next[y]) return prev;
        next[y] = [...next[y]];
        next[y][x] = { char: selectedChar, color: selectedColor, placedAt: Date.now() };
        return next;
      });
    } else {
      const cell = grid[y]?.[x];
      if (!cell || cell.ip !== myIp) return; // only erase own cells
      if (!budget || budget.refundsLeft - pendingRef.current.length <= 0) return;
      pendingRef.current.push({ x, y });
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
    if (cells.length > 0) commitCells(cells);
  };

  const handleDown = (e: MouseEvent | TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e;
    const pos = getCellFromEvent(touch);
    if (!pos) return;
    e.preventDefault();
    dragging.current = true;
    pendingRef.current = [];
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

  const isMine = (cell: Cell | null) => cell && myIp && cell.ip === myIp;

  return (
    <div class="wall-container">
      <a href="/lab" class="wall-back">↳ back</a>
      <button class="wall-info-btn" onClick={() => setShowInfo(true)} title="how it works">?</button>
      {showInfo && (
        <div class="wall-info-overlay" onClick={() => setShowInfo(false)}>
          <div class="wall-info-popup" onClick={(e) => e.stopPropagation()}>
            <div class="wall-info-title">the wall</div>
            <p>a collaborative graffiti wall. place characters to draw, write, leave marks.</p>
            <p><strong>budget:</strong> you get 100 characters per day. resets at midnight UTC.</p>
            <p><strong>erasing:</strong> switch to erase mode to remove cells you placed. each erase refunds 1 character to your budget. you can get up to 200 refunds per day (2x your budget) — so you can rearrange, but not infinitely.</p>
            <p><strong>decay:</strong> cells fade after 1 day and disappear after 3 days.</p>
            <p><strong>controls:</strong> click/drag to place. type any key to pick a character. click paint or erase to switch modes.</p>
            <button class="wall-info-close" onClick={() => setShowInfo(false)}>got it</button>
          </div>
        </div>
      )}
      <div class="wall-hud">
        {budget && <span class="wall-budget">{budget.remaining} chars</span>}
        {budget && <span class="wall-erases">{budget.refundsLeft} refunds</span>}}
      </div>
      {errorMsg && <div class="wall-error">{errorMsg}</div>}
      <div class="wall-grid-wrapper">
        <pre
          ref={gridRef}
          class="wall-grid"
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={handleUp}
          onMouseLeave={handleLeave}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onTouchEnd={handleUp}
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
            }).concat([<span key={`nl-${y}`} class="wall-nl">{'\n'}</span>])
          )}
        </pre>
      </div>
      <div class="wall-palette">
        <div class="wall-toolbar">
          <button
            class={`wall-mode-btn${mode === 'paint' ? ' wall-mode-active' : ''}`}
            onClick={() => setMode('paint')}
          >paint</button>
          <button
            class={`wall-mode-btn${mode === 'erase' ? ' wall-mode-active' : ''}`}
            onClick={() => setMode('erase')}
          >erase</button>
          <span class="wall-mode-hint">click a mode</span>
        </div>
        <div class="wall-tools" style={`min-height: 3.5rem;`}>
          {mode === 'paint' ? (
            <>
              <div class="wall-chars">
                {PALETTE_CHARS.split('').map(ch => (
                  <button
                    key={ch}
                    class={`wall-char-btn${ch === selectedChar ? ' wall-char-active' : ''}`}
                    onClick={() => setSelectedChar(ch)}
                  >
                    {ch}
                  </button>
                ))}
              </div>
              <div class="wall-colors">
                {Object.entries(COLORS).map(([name, hex]) => (
                  <button
                    key={name}
                    class={`wall-color-btn${name === selectedColor ? ' wall-color-active' : ''}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => setSelectedColor(name)}
                    title={name}
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