interface Cell {
  char: string;
  color: string;
  placedAt: number;
  ip?: string; // Added IP to cell for erase functionality
}

interface Budget {
  remaining: number;
  erasesLeft: number;
  maxDaily: number;
  nextResetAt: number;
}

const PALETTE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?.,:;-+=/\\|_@#*█▓░▒─│╔╗╚╝═║';
const ERASE_CHAR = ' '; // Character for erasing
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
const FADE_MS = 1 * 24 * 60 * 60 * 1000;   // 1 day → fade
const EXPIRE_MS = 3 * 24 * 60 * 60 * 1000;  // 3 days → gone

export default function Wall() {
  const [grid, setGrid] = useState<(Cell | null)[][]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [selectedChar, setSelectedChar] = useState('█');
  const [selectedColor, setSelectedColor] = useState('white');
  const [mode, setMode] = useState<'paint' | 'erase' | 'select'>('paint'); // Added modes
  const [erasing, setErasing] = useState(false);
  const [painting, setPainting] = useState(false);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const gridRef = useRef<HTMLPreElement>(null);
  const isActionActiveRef = useRef(false); // Ref for paint/erase activity
  const myIpRef = useRef<string | null>(null); // To store current user's IP

  // Fetch wall state
  const fetchWall = async () => {
    try {
      const res = await fetch('/api/wall');
      const data = await res.json();
      if (data.grid) setGrid(data.grid);
      // Also try to get user IP if not already set
      if (!myIpRef.current) {
        const ipRes = await fetch('/api/my-ip'); // Assuming an endpoint to get client IP
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          myIpRef.current = ipData.ip;
        }
      }
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
    const interval = setInterval(() => { fetchWall(); fetchBudget(); }, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  // Paint cells
  const commitAction = async (cells: { x: number; y: number; char?: string; color?: string }[]) => {
    if (cells.length === 0) return;
    const endpoint = mode === 'paint' ? '/api/wall/paint' : '/api/wall/erase';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cells }),
      });
      const data = await res.json();
      if (res.ok) {
        setBudget(prev => prev ? { ...prev, remaining: data.remaining, erasesLeft: data.erasesLeft } : null);
      } else if (res.status === 429) {
        if (data.error === 'budget_exhausted') {
          setErrorMsg('no chars left — come back tomorrow');
        } else if (data.error === 'erase_limit_reached') {
          setErrorMsg('no erases left — limit 300');
        }
        setTimeout(() => setErrorMsg(''), 3000);
      }
      fetchWall(); // Re-fetch to get accurate state after action
    } catch {}
  };

  // Cell interaction
  const pendingActions = useRef<{ x: number; y: number; char?: string; color?: string }[]>([]);

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

    if (mode === 'erase' || (e instanceof MouseEvent && e.button === 2)) {
      setErasing(true);
    } else {
      setPainting(true);
    }
    isActionActiveRef.current = true;
    pendingActions.current = [];
    addToPendingAction(pos.x, pos.y);
  };

  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e;
    const pos = getCellFromEvent(touch);
    setHoverPos(pos);
    if (!isActionActiveRef.current || !pos) return;
    e.preventDefault();
    addToPendingAction(pos.x, pos.y);
  };

  const handlePointerUp = (e: MouseEvent) => {
    if (!isActionActiveRef.current) return;
    e.preventDefault(); // Prevent right-click context menu
    isActionActiveRef.current = false;
    setPainting(false);
    setErasing(false);
    flushActions();
  };

  const addToPendingAction = (x: number, y: number) => {
    // Dedupe
    if (pendingActions.current.some(c => c.x === x && c.y === y)) return;

    if (mode === 'paint') {
      if (!budget || budget.remaining - pendingActions.current.length <= 0) return;
      pendingActions.current.push({ x, y, char: selectedChar, color: selectedColor });
      // Optimistic local update
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        if (!next[y]) return prev;
        next[y] = [...next[y]];
        next[y][x] = { char: selectedChar, color: selectedColor, placedAt: Date.now(), ip: myIpRef.current || undefined };
        return next;
      });
    } else if (mode === 'erase') {
      if (!budget || budget.erasesLeft - pendingActions.current.length <= 0) return;
      const targetCell = grid[y]?.[x];
      if (targetCell && targetCell.ip === myIpRef.current) { // Only erase your own cells
        pendingActions.current.push({ x, y });
        // Optimistic local update
        setGrid(prev => {
          const next = prev.map(r => [...r]);
          if (!next[y]) return prev;
          next[y] = [...next[y]];
          next[y][x] = null;
          return next;
        });
      }
    }
  };

  const flushActions = () => {
    const cellsToCommit = [...pendingActions.current];
    pendingActions.current = [];
    if (cellsToCommit.length > 0) commitAction(cellsToCommit);
  };

  const handleMouseLeave = () => {
    setHoverPos(null);
    if (isActionActiveRef.current) {
      isActionActiveRef.current = false;
      setPainting(false);
      setErasing(false);
      flushActions();
    }
  };

  // Keyboard char/mode selection
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey) {
        setMode(prev => (prev === 'erase' ? 'paint' : 'erase'));
        setSelectedChar(ERASE_CHAR); // Auto-select erase char
        e.preventDefault();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setMode('paint');
        const idx = PALETTE_CHARS.indexOf(e.key.toUpperCase());
        if (idx >= 0) setSelectedChar(e.key.toUpperCase());
        else setSelectedChar(e.key);
      }
    };
    window.addEventListener('keydown', onKey);
    // Disable context menu on right-click for erase functionality
    const onContextMenu = (e: MouseEvent) => {
      if (e.button === 2) e.preventDefault();
    };
    window.addEventListener('contextmenu', onContextMenu);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('contextmenu', onContextMenu);
    };
  }, []);

  // Render helpers
  const getCellColor = (cell: Cell): string => {
    const age = Date.now() - cell.placedAt;
    const base = COLORS[cell.color] || COLORS.white;
    if (age > FADE_MS) {
      // Fade from 0.8 opacity down to 0.2 over the remaining EXPIRE_MS - FADE_MS duration
      const fadeDuration = EXPIRE_MS - FADE_MS;
      const fadeProgress = Math.min((age - FADE_MS) / fadeDuration, 1);
      const opacity = 0.8 - fadeProgress * 0.6; // From 0.8 to 0.2
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
          </span>
        )}
        {budget && budget.erasesLeft !== undefined && (
          <span class="wall-erases">{budget.erasesLeft} erases</span>
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
          onContextMenu={(e) => e.preventDefault()} // Prevent default context menu
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isHover = hoverPos?.x === x && hoverPos?.y === y;
              const isMyCell = cell && cell.ip === myIpRef.current;
              const isActiveAction = isActionActiveRef.current && isHover;

              if (cell) {
                return (
                  <span
                    key={`${x}-${y}`}
                    class={`wall-cell ${isMyCell ? 'wall-my-cell' : ''}`}
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
                  style={isHover && mode === 'paint' ? { color: COLORS[selectedColor] + '66' } : undefined}
                >
                  {isHover && mode === 'paint' ? selectedChar : '·'}
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
              class={`wall-char-btn${ch === selectedChar && mode === 'paint' ? ' wall-char-active' : ''}`}
              onClick={() => { setSelectedChar(ch); setMode('paint'); }}
              disabled={mode === 'erase'}
            >
              {ch}
            </button>
          ))}
        </div>
        <div class="wall-colors">
          {Object.entries(COLORS).map(([name, hex]) => (
            <button
              key={name}
              class={`wall-color-btn${name === selectedColor && mode === 'paint' ? ' wall-color-active' : ''}`}
              style={{ backgroundColor: hex }}
              onClick={() => { setSelectedColor(name); setMode('paint'); }}
              title={name}
              disabled={mode === 'erase'}
            />
          ))}
        </div>
        <button
          class={`wall-mode-toggle${mode === 'erase' ? ' wall-mode-active' : ''}`}
          onClick={() => setMode(prev => (prev === 'erase' ? 'paint' : 'erase'))}
        >
          {mode === 'erase' ? 'Paint' : 'Erase'}
        </button>
      </div>
    </div>
  );
}