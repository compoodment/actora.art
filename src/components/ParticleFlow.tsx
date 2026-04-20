import { useEffect, useRef } from 'preact/hooks';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const PARTICLE_COUNT = 200;
const INFLUENCE_RADIUS = 150;
const FRICTION = 0.96;
const BASE_SPEED = 0.5;

export default function ParticleFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

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

    function createParticle(): Particle {
      const angle = Math.random() * Math.PI * 2;
      const speed = BASE_SPEED + Math.random() * 0.5;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Math.random(),
        maxLife: 0.5 + Math.random() * 0.5,
        size: 1 + Math.random() * 2,
      };
    }

    function init() {
      resize();
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, createParticle);
    }

    function update() {
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (const p of particles) {
        // Mouse influence — orbit around cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE_RADIUS && dist > 1) {
          const force = (1 - dist / INFLUENCE_RADIUS) * 0.8;
          // Perpendicular orbit force
          p.vx += (-dy / dist) * force * 0.5;
          p.vy += (dx / dist) * force * 0.5;
          // Slight attraction
          p.vx += (dx / dist) * force * 0.1;
          p.vy += (dy / dist) * force * 0.1;
        }

        // Gentle drift
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;

        p.vx *= FRICTION;
        p.vy *= FRICTION;

        p.x += p.vx;
        p.y += p.vy;

        p.life -= 0.002;

        // Respawn if dead or off-screen
        if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          const angle = Math.random() * Math.PI * 2;
          const speed = BASE_SPEED + Math.random() * 0.5;
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.life = p.maxLife;
          p.size = 1 + Math.random() * 2;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;

      for (const p of particles) {
        const alpha = Math.min(p.life / p.maxLife, 1) * 0.7;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        // Color shifts with speed: slow = cool blue, fast = warm
        const hue = 200 + speed * 30;
        ctx.fillStyle = `hsla(${hue}, 60%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      update();
      draw();
      animRef.current = requestAnimationFrame(loop);
    }

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

    init();
    loop();

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', () => {
      resize();
    });

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div class="particle-container">
      <canvas ref={canvasRef} class="particle-canvas" />
      <div class="particle-hint">move your cursor</div>
    </div>
  );
}