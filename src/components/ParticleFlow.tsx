import { useEffect, useRef } from 'preact/hooks';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  special: boolean; // collectible
  popped: boolean;
}

const PARTICLE_COUNT = 120;
const SPAWN_BURST = 15;
const INFLUENCE_RADIUS = 120;
const COLLECT_RADIUS = 30;
const FRICTION = 0.97;
const BASE_SPEED = 0.4;
const SPECIAL_CHANCE = 0.08;
const COMBO_WINDOW = 1500; // ms

export default function ParticleFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const lastPopRef = useRef(0);
  const scoreDisplayRef = useRef<HTMLDivElement>(null);
  const comboDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let w = 0;
    let h = 0;

    function resize() {
      w = canvas!.parentElement!.clientWidth;
      h = canvas!.parentElement!.clientHeight;
      canvas!.width = w * devicePixelRatio;
      canvas!.height = h * devicePixelRatio;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    function createParticle(x?: number, y?: number, burst?: boolean): Particle {
      const px = x ?? Math.random() * w;
      const py = y ?? Math.random() * h;
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? (2 + Math.random() * 3) : (BASE_SPEED + Math.random() * 0.3);
      const isSpecial = !burst && Math.random() < SPECIAL_CHANCE;
      const maxLife = burst ? (0.4 + Math.random() * 0.4) : (0.6 + Math.random() * 0.4);
      return {
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        size: isSpecial ? (2.5 + Math.random() * 1.5) : (1 + Math.random() * 1.5),
        special: isSpecial,
        popped: false,
      };
    }

    function init() {
      resize();
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesRef.current.push(createParticle());
      }
    }

    function spawnBurst(x: number, y: number) {
      for (let i = 0; i < SPAWN_BURST; i++) {
        particlesRef.current.push(createParticle(x, y, true));
      }
    }

    function popSpecial(p: Particle) {
      const now = Date.now();
      if (now - lastPopRef.current < COMBO_WINDOW) {
        comboRef.current++;
      } else {
        comboRef.current = 1;
      }
      lastPopRef.current = now;

      const points = comboRef.current;
      scoreRef.current += points;

      // Spawn mini burst at pop location
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        const np: Particle = {
          x: p.x,
          y: p.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.3 + Math.random() * 0.2,
          maxLife: 0.5,
          size: 1 + Math.random(),
          special: false,
          popped: false,
        };
        particlesRef.current.push(np);
      }

      p.popped = true;

      if (scoreDisplayRef.current) {
        scoreDisplayRef.current.textContent = String(scoreRef.current);
      }
      if (comboDisplayRef.current && comboRef.current > 1) {
        comboDisplayRef.current.textContent = `x${comboRef.current}`;
        comboDisplayRef.current.style.opacity = '1';
        setTimeout(() => {
          if (comboDisplayRef.current) comboDisplayRef.current.style.opacity = '0';
        }, 800);
      }
    }

    function update() {
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (const p of particles) {
        if (p.popped) continue;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE_RADIUS && dist > 1) {
          const force = (1 - dist / INFLUENCE_RADIUS) * 0.6;
          // Orbit
          p.vx += (-dy / dist) * force * 0.4;
          p.vy += (dx / dist) * force * 0.4;
          // Attract
          p.vx += (dx / dist) * force * 0.08;
          p.vy += (dy / dist) * force * 0.08;
        }

        // Collect specials
        if (p.special && dist < COLLECT_RADIUS) {
          popSpecial(p);
          continue;
        }

        // Drift
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;

        p.vx *= FRICTION;
        p.vy *= FRICTION;

        p.x += p.vx;
        p.y += p.vy;

        p.life -= 0.001;

        // Respawn
        if (p.life <= 0 || p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) {
          const angle = Math.random() * Math.PI * 2;
          const speed = BASE_SPEED + Math.random() * 0.3;
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.life = p.maxLife;
          p.size = 1 + Math.random() * 1.5;
          p.special = Math.random() < SPECIAL_CHANCE;
          p.popped = false;
        }
      }

      // Remove popped and dead particles (keep count stable)
      particlesRef.current = particlesRef.current.filter(p => !p.popped);

      // Maintain minimum count
      while (particlesRef.current.length < PARTICLE_COUNT) {
        particlesRef.current.push(createParticle());
      }
    }

    function draw() {
      // Trail effect — semi-transparent clear
      ctx.fillStyle = 'rgba(10, 10, 10, 0.12)';
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;

      for (const p of particles) {
        if (p.popped) continue;
        const alpha = Math.min(p.life / p.maxLife, 1);
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

        if (p.special) {
          // Glow effect for specials
          const glowAlpha = alpha * 0.3 * (0.7 + Math.sin(Date.now() * 0.005) * 0.3);
          ctx.fillStyle = `rgba(255, 180, 60, ${glowAlpha})`;
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

      // Draw collect radius hint around cursor
      const mouse = mouseRef.current;
      if (mouse.x > 0 && mouse.y > 0) {
        ctx.strokeStyle = 'rgba(255, 200, 80, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, COLLECT_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function loop() {
      update();
      draw();
      animRef.current = requestAnimationFrame(loop);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    }

    function onTouchMove(e: TouchEvent) {
      const rect = canvas!.getBoundingClientRect();
      const t = e.touches[0];
      mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top, active: true };
    }

    function onMouseLeave() {
      mouseRef.current = { ...mouseRef.current, x: -1000, y: -1000, active: false };
    }

    function onClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      spawnBurst(e.clientX - rect.left, e.clientY - rect.top);
    }

    function onTouchStart(e: TouchEvent) {
      const rect = canvas!.getBoundingClientRect();
      const t = e.touches[0];
      spawnBurst(t.clientX - rect.left, t.clientY - rect.top);
    }

    init();
    loop();

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onTouchStart);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div class="particle-container">
      <canvas ref={canvasRef} class="particle-canvas" />
      <div class="particle-hud">
        <a href="/" class="particle-back">↳ back</a>
        <div class="particle-score-wrap">
          <div ref={scoreDisplayRef} class="particle-score">0</div>
          <div class="particle-score-label">collected</div>
        </div>
        <div ref={comboDisplayRef} class="particle-combo" />
      </div>
      <div class="particle-hint">click to spawn · collect the glowing ones</div>
    </div>
  );
}