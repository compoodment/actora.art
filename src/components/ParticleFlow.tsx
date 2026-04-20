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
}

interface Bomb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  trackingSpeed: number;
  maxSpeed: number;
}

const ROUND_DURATION = 90;
const BASE_PARTICLES = 68;
const SPECIAL_CHANCE = 0.03;
const COLLECT_RADIUS = 24;
const BOMB_RADIUS = 18;
const INFLUENCE_RADIUS = 115;
const FRICTION = 0.972;
const BASE_SPEED = 0.32;
const COMBO_WINDOW_MS = 850;
const MAX_COMBO = 6;
const LEVEL_UP_THRESHOLD = 120;

function messagesForScore(score: number, level: number): number {
  const levelBonus = 1 + (level - 1) * 0.08;
  return Math.max(0, Math.round(score * 0.32 * levelBonus));
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
  });

  const [state, setState] = useState<'idle' | 'playing' | 'dead' | 'won'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [combo, setCombo] = useState(0);
  const [messagesEarned, setMessagesEarned] = useState(0);
  const [level, setLevel] = useState(1);
  const [totalEarned, setTotalEarned] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const [settling, setSettling] = useState(false);
  const totalEarnedRef = useRef(0);
  const bankBalanceRef = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem('particles_totalEarned');
    if (stored) {
      const value = parseInt(stored, 10);
      if (!Number.isNaN(value)) {
        setTotalEarned(value);
        setLevel(getLevel(value));
      }
    }

    refreshBalance();
  }, []);

  useEffect(() => {
    totalEarnedRef.current = totalEarned;
  }, [totalEarned]);

  useEffect(() => {
    bankBalanceRef.current = bankBalance;
  }, [bankBalance]);

  function refreshBalance() {
    fetch('/api/balance')
      .then(r => r.json())
      .then(d => setBankBalance(d.balance || 0))
      .catch(() => {});
  }

  async function submitScore(points: number) {
    const requestedMessages = messagesForScore(points, level);

    try {
      const res = await fetch('/api/earn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: requestedMessages }),
      });

      const data = await res.json();
      const credited = res.ok ? (data.earned || 0) : 0;
      const newBalance = res.ok ? (data.balance || 0) : bankBalanceRef.current;

      setBankBalance(newBalance);
      return credited;
    } catch {
      return 0;
    }
  }

  useEffect(() => {
    if (state !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const levelAtRoundStart = level;

    function resize() {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function createParticle(x?: number, y?: number): Particle {
      const angle = Math.random() * Math.PI * 2;
      const speed = BASE_SPEED + Math.random() * 0.25;
      const specialChance = Math.min(SPECIAL_CHANCE + levelAtRoundStart * 0.0025, 0.05);
      const special = Math.random() < specialChance;
      const maxLife = 0.7 + Math.random() * 0.5;

      return {
        x: x ?? Math.random() * width,
        y: y ?? Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        size: special ? 2.6 + Math.random() * 1.2 : 1 + Math.random() * 1.4,
        special,
      };
    }

    function createBomb(): Bomb {
      const side = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;

      if (side === 0) {
        x = -20;
        y = Math.random() * height;
      } else if (side === 1) {
        x = width + 20;
        y = Math.random() * height;
      } else if (side === 2) {
        x = Math.random() * width;
        y = -20;
      } else {
        x = Math.random() * width;
        y = height + 20;
      }

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 7 + Math.random() * 3,
        trackingSpeed: 0.05 + levelAtRoundStart * 0.015,
        maxSpeed: 1.15 + levelAtRoundStart * 0.14,
      };
    }

    function resetRound() {
      resize();
      particlesRef.current = Array.from({ length: BASE_PARTICLES }, () => createParticle());
      bombsRef.current = [];
      gameRef.current = {
        running: true,
        timeLeft: ROUND_DURATION,
        score: 0,
        combo: 0,
        lastPop: 0,
      };
    }

    async function finishRound() {
      const roundScore = gameRef.current.score;
      const nextTotal = totalEarnedRef.current + roundScore;

      gameRef.current.running = false;
      setSettling(true);

      const credited = await submitScore(roundScore);

      setMessagesEarned(credited);
      setTotalEarned(nextTotal);
      setLevel(getLevel(nextTotal));
      localStorage.setItem('particles_totalEarned', String(nextTotal));
      setSettling(false);
      setState('won');
    }

    function update(dt: number) {
      const game = gameRef.current;
      if (!game.running) return;

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const bombs = bombsRef.current;

      game.timeLeft -= dt;
      setTimeLeft(Math.max(0, Math.ceil(game.timeLeft)));

      if (game.timeLeft <= 0) {
        finishRound();
        return;
      }

      const maxBombs = Math.min(2 + Math.floor((levelAtRoundStart - 1) / 2), 5);
      const bombInterval = Math.max(7 - levelAtRoundStart * 0.25, 4);
      if (bombs.length < maxBombs && Math.random() < dt / bombInterval) {
        bombs.push(createBomb());
      }

      for (const particle of particles) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const dist = Math.hypot(dx, dy);

        if (dist < INFLUENCE_RADIUS && dist > 1) {
          const force = (1 - dist / INFLUENCE_RADIUS) * 0.42;
          particle.vx += (-dy / dist) * force * 0.22;
          particle.vy += (dx / dist) * force * 0.22;
          particle.vx += (dx / dist) * force * 0.03;
          particle.vy += (dy / dist) * force * 0.03;
        }

        if (particle.special && dist < COLLECT_RADIUS) {
          const now = Date.now();
          if (now - game.lastPop < COMBO_WINDOW_MS) {
            game.combo = Math.min(game.combo + 1, MAX_COMBO);
          } else {
            game.combo = 1;
          }
          game.lastPop = now;
          game.score += game.combo;
          setScore(game.score);
          setCombo(game.combo);

          Object.assign(particle, createParticle());
          continue;
        }

        particle.vx += (Math.random() - 0.5) * 0.02;
        particle.vy += (Math.random() - 0.5) * 0.02;
        particle.vx *= FRICTION;
        particle.vy *= FRICTION;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.0012;

        if (
          particle.life <= 0 ||
          particle.x < -30 ||
          particle.x > width + 30 ||
          particle.y < -30 ||
          particle.y > height + 30
        ) {
          Object.assign(particle, createParticle());
        }
      }

      for (const bomb of bombs) {
        const dx = mouse.x - bomb.x;
        const dy = mouse.y - bomb.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 1) {
          bomb.vx += (dx / dist) * bomb.trackingSpeed * dt * 60;
          bomb.vy += (dy / dist) * bomb.trackingSpeed * dt * 60;
        }

        const speed = Math.hypot(bomb.vx, bomb.vy);
        if (speed > bomb.maxSpeed) {
          bomb.vx = (bomb.vx / speed) * bomb.maxSpeed;
          bomb.vy = (bomb.vy / speed) * bomb.maxSpeed;
        }

        bomb.vx *= 0.985;
        bomb.vy *= 0.985;
        bomb.x += bomb.vx;
        bomb.y += bomb.vy;

        if (dist < BOMB_RADIUS) {
          game.running = false;
          setState('dead');
          return;
        }
      }

      bombsRef.current = bombs.filter(bomb =>
        bomb.x > -120 && bomb.x < width + 120 && bomb.y > -120 && bomb.y < height + 120
      );
    }

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.16)';
      ctx.fillRect(0, 0, width, height);

      for (const particle of particlesRef.current) {
        const alpha = Math.min(particle.life / particle.maxLife, 1);

        if (particle.special) {
          const pulse = 0.72 + Math.sin(Date.now() * 0.004) * 0.28;
          ctx.fillStyle = `rgba(255, 180, 60, ${0.18 * pulse})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 200, 80, ${alpha})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(135, 176, 216, ${alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const bomb of bombsRef.current) {
        const pulse = 0.7 + Math.sin(Date.now() * 0.01) * 0.3;

        ctx.fillStyle = `rgba(220, 50, 50, ${0.14 * pulse})`;
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, bomb.size * 2.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(220, 60, 60, ${0.92 * pulse})`;
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, bomb.size, 0, Math.PI * 2);
        ctx.fill();
      }

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
      const dt = Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;
      update(dt);
      draw();
      animRef.current = requestAnimationFrame(loop);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onTouchMove(e: TouchEvent) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    resetRound();
    animRef.current = requestAnimationFrame(loop);

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
    setSettling(false);
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
              collect gold · avoid red · 90 seconds · combos cap at x{MAX_COMBO}
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
            <div class="particle-score">{score}</div>
            <div class="particle-score-label">score{combo > 1 ? ` · combo x${combo}` : ''}</div>
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
        <div class="particle-hint">collect gold · avoid red · level {level}</div>
      )}

      {settling && (
        <div class="particle-overlay particle-overlay-subtle">
          <div class="particle-overlay-inner">
            <p class="particle-result-text dim">crediting score...</p>
          </div>
        </div>
      )}
    </div>
  );
}
