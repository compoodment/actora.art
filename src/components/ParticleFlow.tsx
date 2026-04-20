import { useEffect, useRef, useState } from 'preact/hooks';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  special: boolean;
  popped: boolean;
}

interface Bomb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  trackingSpeed: number;
}

const ROUND_DURATION = 90; // seconds
const BASE_PARTICLES = 100;
const SPECIAL_CHANCE = 0.07;
const COLLECT_RADIUS = 28;
const BOMB_RADIUS = 20;
const INFLUENCE_RADIUS = 120;
const FRICTION = 0.97;
const BASE_SPEED = 0.4;
const POINTS_PER_SPECIAL = 1;
const LEVEL_UP_THRESHOLD = 50; // total earned points per level

// Messages earned per round scales with level
function messagesForScore(score: number, level: number): number {
  const baseRate = 0.6; // ~0.6 messages per point at level 1
  const levelBonus = 1 + (level - 1) * 0.15; // +15% per level
  return Math.round(score * baseRate * levelBonus);
}

function getLevel(totalEarned: number): number {
  return Math.floor(totalEarned / LEVEL_UP_THRESHOLD) + 1;
}

export default function ParticleFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const bombsRef = useRef<Bomb[]>([]);
  const animRef = useRef<number>(0);
  const gameRef = useRef({
    running: false,
    timeLeft: ROUND_DURATION,
    score: 0,
    combo: 0,
    lastPop: 0,
    dead: false,
  });

  const [state, setState] = useState<'idle' | 'playing' | 'dead' | 'won'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [combo, setCombo] = useState(0);
  const [messagesEarned, setMessagesEarned] = useState(0);

  const [level, setLevel] = useState(1);
  const [totalEarned, setTotalEarned] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const scoreRef = useRef<HTMLDivElement>(null);

  // Load level and bank on mount
  useEffect(() => {
    const stored = localStorage.getItem('particles_totalEarned');
    if (stored) {
      const val = parseInt(stored, 10);
      setTotalEarned(val);
      setLevel(getLevel(val));
    }

    fetch('/api/balance')
      .then(r => r.json())
      .then(d => setBankBalance(d.balance || 0))
      .catch(() => {});
  }, []);

  function submitScore(points: number) {
    const lvl = getLevel(totalEarned + points);
    const msgs = messagesForScore(points, lvl);

    fetch('/api/earn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: msgs }),
    })
      .then(r => r.json())
      .then(d => {
        setBankBalance(d.balance || 0);
      })
      .catch(() => {});

    const newTotal = totalEarned + points;
    setTotalEarned(newTotal);
    setLevel(getLevel(newTotal));
    localStorage.setItem('particles_totalEarned', String(newTotal));
    return msgs;
  }

  useEffect(() => {
    if (state !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let w = 0;
    let h = 0;
    let lastTime = Date.now();

    const lvl = level;

    function resize() {
      w = canvas!.parentElement!.clientWidth;
      h = canvas!.parentElement!.clientHeight;
      canvas!.width = w * devicePixelRatio;
      canvas!.height = h * devicePixelRatio;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function createParticle(x?: number, y?: number): Particle {
      const px = x ?? Math.random() * w;
      const py = y ?? Math.random() * h;
      const angle = Math.random() * Math.PI * 2;
      const speed = BASE_SPEED + Math.random() * 0.3;
      const isSpecial = Math.random() < (SPECIAL_CHANCE + lvl * 0.005);
      const maxLife = 0.6 + Math.random() * 0.4;
      return {
        x: px, y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife, maxLife,
        size: isSpecial ? (2.5 + Math.random() * 1.5) : (1 + Math.random() * 1.5),
        special: isSpecial,
        popped: false,
      };
    }

    function createBomb(): Bomb {
      const side = Math.floor(Math.random() * 4);
      let x: number, y: number;
      if (side === 0) { x = -10; y = Math.random() * h; }
      else if (side === 1) { x = w + 10; y = Math.random() * h; }
      else if (side === 2) { x = Math.random() * w; y = -10; }
      else { x = Math.random() * w; y = h + 10; }

      const tracking = 0.1 + lvl * 0.06; // level 1: 0.16, level 10: 0.7

      return {
        x, y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 6 + Math.random() * 4,
        trackingSpeed: tracking,
      };
    }

    function init() {
      resize();
      particlesRef.current = [];
      bombsRef.current = [];
      for (let i = 0; i < BASE_PARTICLES; i++) {
        particlesRef.current.push(createParticle());
      }
      gameRef.current = {
        running: true,
        timeLeft: ROUND_DURATION,
        score: 0,
        combo: 0,
        lastPop: 0,
        dead: false,
      };
    }

    function update(dt: number) {
      const game = gameRef.current;
      if (!game.running) return;

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const bombs = bombsRef.current;

      // Timer
      game.timeLeft -= dt;
      setTimeLeft(Math.max(0, Math.ceil(game.timeLeft)));

      if (game.timeLeft <= 0) {
        game.running = false;
        const msgs = submitScore(game.score);
        setMessagesEarned(msgs);
        setState('won');
        return;
      }

      // Spawn bombs over time (more at higher levels)
      const bombInterval = Math.max(3, 8 - lvl * 0.5); // seconds between bombs
      if (Math.random() < dt / bombInterval) {
        bombs.push(createBomb());
      }

      // Update particles
      for (const p of particles) {
        if (p.popped) continue;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE_RADIUS && dist > 1) {
          const force = (1 - dist / INFLUENCE_RADIUS) * 0.5;
          p.vx += (-dy / dist) * force * 0.35;
          p.vy += (dx / dist) * force * 0.35;
          p.vx += (dx / dist) * force * 0.06;
          p.vy += (dy / dist) * force * 0.06;
        }

        // Collect specials
        if (p.special && dist < COLLECT_RADIUS) {
          const now = Date.now();
          if (now - game.lastPop < 1500) {
            game.combo++;
          } else {
            game.combo = 1;
          }
          game.lastPop = now;
          game.score += POINTS_PER_SPECIAL * game.combo;
          setScore(game.score);
          setCombo(game.combo);
          p.popped = true;

          // Mini burst
          for (let i = 0; i < 4; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = 1 + Math.random() * 2;
            particles.push({
              x: p.x, y: p.y,
              vx: Math.cos(a) * s, vy: Math.sin(a) * s,
              life: 0.3, maxLife: 0.4,
              size: 1, special: false, popped: false,
            });
          }
          continue;
        }

        p.vx += (Math.random() - 0.5) * 0.03;
        p.vy += (Math.random() - 0.5) * 0.03;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.0008;

        if (p.life <= 0 || p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) {
          const a = Math.random() * Math.PI * 2;
          const s = BASE_SPEED + Math.random() * 0.3;
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.vx = Math.cos(a) * s;
          p.vy = Math.sin(a) * s;
          p.life = p.maxLife;
          p.size = 1 + Math.random() * 1.5;
          p.special = Math.random() < (SPECIAL_CHANCE + lvl * 0.005);
          p.popped = false;
        }
      }

      // Remove popped
      particlesRef.current = particles.filter(p => !p.popped);
      while (particlesRef.current.length < BASE_PARTICLES) {
        particlesRef.current.push(createParticle());
      }

      // Update bombs
      for (const b of bombs) {
        // Track cursor
        const dx = mouse.x - b.x;
        const dy = mouse.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
          b.vx += (dx / dist) * b.trackingSpeed * dt;
          b.vy += (dy / dist) * b.trackingSpeed * dt;
        }

        // Dampen
        b.vx *= 0.99;
        b.vy *= 0.99;
        b.x += b.vx;
        b.y += b.vy;

        // Check collision with cursor
        if (dist < BOMB_RADIUS) {
          game.running = false;
          game.dead = true;
          setState('dead');
          return;
        }
      }

      // Remove off-screen bombs
      bombsRef.current = bombs.filter(b =>
        b.x > -100 && b.x < w + 100 && b.y > -100 && b.y < h + 100
      );
    }

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      const bombs = bombsRef.current;
      const mouse = mouseRef.current;

      // Draw particles
      for (const p of particles) {
        if (p.popped) continue;
        const alpha = Math.min(p.life / p.maxLife, 1);
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

        if (p.special) {
          const glow = alpha * 0.25 * (0.7 + Math.sin(Date.now() * 0.005) * 0.3);
          ctx.fillStyle = `rgba(255, 180, 60, ${glow})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(255, 200, 80, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const hue = 200 + speed * 30;
          ctx.fillStyle = `hsla(${hue}, 60%, 70%, ${alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw bombs
      for (const b of bombs) {
        const pulse = 0.7 + Math.sin(Date.now() * 0.008) * 0.3;
        // Glow
        ctx.fillStyle = `rgba(220, 50, 50, ${0.15 * pulse})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Core
        ctx.fillStyle = `rgba(220, 60, 60, ${0.9 * pulse})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
        // Inner
        ctx.fillStyle = `rgba(255, 120, 100, ${0.6 * pulse})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Collect radius hint
      if (mouse.x > 0 && mouse.y > 0) {
        ctx.strokeStyle = 'rgba(255, 200, 80, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, COLLECT_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    let lastFrame = performance.now();
    function loop(now: number) {
      const dt = Math.min((now - lastFrame) / 1000, 0.1); // seconds, capped
      lastFrame = now;
      update(dt);
      draw();
      animRef.current = requestAnimationFrame(loop);
    }

    init();
    lastFrame = performance.now();
    animRef.current = requestAnimationFrame(loop);

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onTouchMove(e: TouchEvent) {
      const rect = canvas!.getBoundingClientRect();
      const t = e.touches[0];
      mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    function onMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', resize);

    return () => {
      gameRef.current.running = false;
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, [state, level]);

  function startRound() {
    setScore(0);
    setCombo(0);
    setTimeLeft(ROUND_DURATION);
    setMessagesEarned(0);
    setState('playing');
  }

  return (
    <div class="particle-container">
      <canvas ref={canvasRef} class="particle-canvas" />

      {state === 'idle' && (
        <div class="particle-overlay">
          <div class="particle-overlay-inner">
            <div class="particle-back-link"><a href="/">↳ back</a></div>
            <h2 class="particle-title">particles</h2>
            <div class="particle-stats-row">
              <div class="particle-stat">
                <span class="particle-stat-value">lvl {level}</span>
                <span class="particle-stat-label">level</span>
              </div>
              <div class="particle-stat">
                <span class="particle-stat-value">{bankBalance}</span>
                <span class="particle-stat-label">chat messages</span>
              </div>
            </div>
            <button onClick={startRound} class="particle-start-btn">start round</button>
            <div class="particle-rules">
              collect the gold ones · avoid the red ones · 90 seconds
            </div>
          </div>
        </div>
      )}

      {state === 'playing' && (
        <div class="particle-hud">
          <a href="/" class="particle-back">↳ back</a>
          <div class="particle-hud-center">
            <span class="particle-timer">{timeLeft}s</span>
          </div>
          <div class="particle-score-wrap">
            <div ref={scoreRef} class="particle-score">{score}</div>
            <div class="particle-score-label">score</div>
          </div>
        </div>
      )}

      {state === 'dead' && (
        <div class="particle-overlay">
          <div class="particle-overlay-inner">
            <div class="particle-back-link"><a href="/">↳ back</a></div>
            <h2 class="particle-title dead">boom</h2>
            <p class="particle-result-text">you hit a bomb</p>
            <p class="particle-result-text dim">no messages earned this round</p>
            <button onClick={startRound} class="particle-start-btn">try again</button>
          </div>
        </div>
      )}

      {state === 'won' && (
        <div class="particle-overlay">
          <div class="particle-overlay-inner">
            <div class="particle-back-link"><a href="/">↳ back</a></div>
            <h2 class="particle-title won">round complete</h2>
            <p class="particle-result-text">score: {score}</p>
            <p class="particle-result-text earned">+{messagesEarned} chat messages</p>
            <button onClick={startRound} class="particle-start-btn">play again</button>
          </div>
        </div>
      )}

      {state === 'playing' && (
        <div class="particle-hint">collect gold · avoid red</div>
      )}
    </div>
  );
}