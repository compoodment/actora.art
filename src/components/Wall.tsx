import { useEffect, useRef, useState } from 'preact/hooks';

interface Cell {
  char: string;
  color: string;
  placedAt: number;
}

interface Budget {
  remaining: number;
  streak: number;
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
const FADE_MS = 7 * 24 * 60 * 60 * 1000;

export default function Wall() {
  const [grid, setGrid] = useState<(Cell | null)[][]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [selectedChar, setSelectedChar] = useState('█');
  const [selectedColor, setSelectedColor] = useState('white');
  const [painting, setPainting] = useState(false);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const gridRef = useRef<HTMLPreElement>(null);
  const paintingRef = useRef(false);

  // Fetch wall state
  const fetchWall = async () => {
    try {
      const res = await fetch('/api/wall');
      const data = await res.json();
      if (data.grid) setGrid(data.grid);
    } catch {}
  };

  // Fetch budget
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
    const interval = setInterval(fetchWall, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  // Paint cells
  const paintCells = async (cells: { x: number; y: number; char: string; color: string }[]) => {
    if (cells.length === 0) return;
    try {
      const res = await fetch('/api/wall/paint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cells }),
      });
      const data = await res.json();
      if (res.ok) {
        setBudget(prev => prev ? { ...prev, remaining: data.remaining, streak: data.streak } : null);
      } else if (res.status === 429) {
        setErrorMsg('no chars left — come back tomorrow');
        setTimeout(() => setErrorMsg(''), 3000);
      }
      fetchWall();
    } catch {}
  };

  // Cell interaction
  const pendingPaint = useRef<{ x: number; y: number; char: string; color: string }[]>([]);
  const paintTimer = useRef<number>(0);

  const getCellFromEvent = (e: MouseEvent | Touch): { x: number; y: number } | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const charW = rect.width / COLS;
    const charH = rect.height / ROWS;
    const x = Math.floor((e.clientX - rect.left) / charW);
    const y = Math.floor((e.clientY - rect.top) / charH);
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null;
    return { x, y };
  };

  const handlePointerDown = (e: MouseEvent | TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e;
    const pos = getCellFromEvent(touch);
    if (!pos) return;
    e.preventDefault();
    paintingRef.current = true;
    setPainting(true);
    pendingPaint.current = [];
    addToPaint(pos.x, pos.y);
  };

  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e;
    const pos = getCellFromEvent(touch);
    setHoverPos(pos);
    if (!paintingRef.current || !pos) return;
    e.preventDefault();
    addToPaint(pos.x, pos.y);
  };

  const handlePointerUp = () => {
    if (!paintingRef.current) return;
    paintingRef.current = false;
    setPainting(false);
    flushPaint();
  };

  const addToPaint = (x: number, y: number) => {
    // Dedupe
    if (pendingPaint.current.some(c => c.x === x && c.y === y)) return;
    if (!budget || budget.remaining - pendingPaint.current.length <= 0) return;
    pendingPaint.current.push({ x, y, char: selectedChar, color: selectedColor });
    // Optimistic local update
    setGrid(prev => {
      const next = prev.map(r => [...r]);
      if (!next[y]) return prev;
      next[y] = [...next[y]];
      next[y][x] = { char: selectedChar, color: selectedColor, placedAt: Date.now() };
      return next;
    });
  };

  const flushPaint = () => {
    const cells = [...pendingPaint.current];
    pendingPaint.current = [];
    if (cells.length > 0) paintCells(cells);
  };

  const handleMouseLeave = () => {
    setHoverPos(null);
    if (paintingRef.current) {
      paintingRef.current = false;
      setPainting(false);
      flushPaint();
    }
  };

  // Keyboard char selection
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        const idx = PALETTE_CHARS.indexOf(e.key.toUpperCase());
        if (idx >= 0) setSelectedChar(e.key.toUpperCase());
        else setSelectedChar(e.key);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Render helpers
  const getCellColor = (cell: Cell): string => {
    const age = Date.now() - cell.placedAt;
    const base = COLORS[cell.color] || COLORS.white;
    if (age > FADE_MS) {
      const fadeProgress = Math.min((age - FADE_MS) / (7 * 24 * 60 * 60 * 1000), 1);
      const opacity = 0.5 - fadeProgress * 0.4; // 0.5 → 0.1
      return base + Math.round(opacity * 255).toString(16).padStart(2, '0');
    }
    return base;
  };

  if (grid.length === 0) {
    return <div class="wall-loading">loading wall…</div>;
  }

  return (
    <div class="wall-container">
      <a href="/lab" class="wall-back">↳ back</a>
      <div class="wall-hud">
        {budget && (
          <span class="wall-budget">
            {budget.remaining} chars
            {budget.streak > 1 && <span class="wall-streak"> 🔥{budget.streak}</span>}
          </span>
        )}
      </div>
      {errorMsg && <div class="wall-error">{errorMsg}</div>}
      <div class="wall-grid-wrapper">
        <pre
          ref={gridRef}
          class="wall-grid"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isHover = hoverPos?.x === x && hoverPos?.y === y;
              const isPaintingHere = paintingRef.current && isHover;
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
      </div>
    </div>
  );
}