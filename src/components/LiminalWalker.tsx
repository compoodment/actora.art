import { useEffect, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';

type MoveKey = 'forward' | 'backward' | 'left' | 'right';

const MOVE_SPEED = 3.1;
const LOOK_SPEED = 0.0022;
const CAMERA_HEIGHT = 1.62;
const CHAMBER_LIMIT_X = 7.1;
const CHAMBER_LIMIT_Z = 8.6;

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function makeConcreteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  ctx.fillStyle = '#7a7c78';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 9000; i += 1) {
    const shade = 88 + Math.floor(Math.random() * 60);
    const alpha = 0.04 + Math.random() * 0.09;
    ctx.fillStyle = `rgba(${shade}, ${shade + 1}, ${shade - 2}, ${alpha})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  ctx.strokeStyle = 'rgba(48, 49, 47, 0.24)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 256; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(256, y + 0.5);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function LiminalWalker() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const keysRef = useRef<Record<MoveKey, boolean>>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const pointerRef = useRef({ active: false, x: 0, y: 0 });
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const [webglOk, setWebglOk] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [started, setStarted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (!supportsWebGL()) {
      setWebglOk(false);
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x555a57);
    scene.fog = new THREE.FogExp2(0x777c77, 0.044);

    const camera = new THREE.PerspectiveCamera(68, 1, 0.04, 80);
    camera.position.set(0, CAMERA_HEIGHT, 6.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglOk(false);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x5d625f, 1);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const concreteTexture = makeConcreteTexture();
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x666b66,
      map: concreteTexture ?? undefined,
      roughness: 0.98,
      metalness: 0.02,
    });
    const concreteMaterial = new THREE.MeshStandardMaterial({
      color: 0x868a83,
      map: concreteTexture ?? undefined,
      roughness: 0.96,
      metalness: 0.02,
    });
    const darkConcrete = new THREE.MeshStandardMaterial({
      color: 0x4d514d,
      roughness: 0.98,
      metalness: 0.01,
    });
    const seamMaterial = new THREE.MeshBasicMaterial({ color: 0x30312f });
    const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xf1d8b2 });
    const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x0f1010, roughness: 0.7 });

    function addBox(size: [number, number, number], position: [number, number, number], material: THREE.Material) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
      mesh.position.set(position[0], position[1], position[2]);
      scene.add(mesh);
      return mesh;
    }

    addBox([16, 0.2, 20], [0, -0.1, 0], floorMaterial);
    addBox([16, 0.35, 20], [0, 4.25, 0], darkConcrete);
    addBox([0.25, 4.4, 20], [-8, 2.1, 0], concreteMaterial);
    addBox([0.25, 4.4, 20], [8, 2.1, 0], concreteMaterial);
    addBox([16, 4.4, 0.25], [0, 2.1, -10], concreteMaterial);
    addBox([16, 4.4, 0.25], [0, 2.1, 10], concreteMaterial);

    for (const x of [-4, 0, 4]) {
      addBox([0.04, 0.035, 20], [x, 0.02, 0], seamMaterial);
      addBox([0.035, 0.04, 20], [x, 4.06, 0], seamMaterial);
    }
    for (const z of [-5, 0, 5]) {
      addBox([16, 0.04, 0.05], [0, 0.015, z], seamMaterial);
      addBox([16, 0.05, 0.05], [0, 4.05, z], seamMaterial);
    }
    addBox([0.08, 0.08, 19.5], [-7.82, 0.08, 0], seamMaterial);
    addBox([0.08, 0.08, 19.5], [7.82, 0.08, 0], seamMaterial);
    addBox([15.5, 0.08, 0.08], [0, 0.08, -9.82], seamMaterial);
    addBox([15.5, 0.06, 0.08], [0, 4.02, -9.82], seamMaterial);

    addBox([1.15, 3.2, 1.15], [-5.9, 1.6, -3.8], darkConcrete);
    addBox([1.15, 3.2, 1.15], [5.9, 1.6, 3.8], darkConcrete);
    addBox([2.2, 2.85, 0.18], [0, 1.42, -9.82], blackMaterial);
    addBox([0.12, 2.85, 0.08], [0, 1.62, -9.66], glowMaterial);
    addBox([3.8, 0.1, 0.08], [0, 3.08, -9.64], glowMaterial);
    addBox([4.2, 0.1, 0.08], [0, 0.28, -9.64], glowMaterial);
    addBox([6.8, 0.06, 0.08], [0, 0.04, -7.1], glowMaterial);

    const light = new THREE.HemisphereLight(0xd8ddd7, 0x282a28, 1.2);
    scene.add(light);
    const slitLight = new THREE.PointLight(0xf1d8b2, 18, 9, 1.5);
    slitLight.position.set(0, 2.1, -8.9);
    scene.add(slitLight);
    const weakLight = new THREE.PointLight(0xb7d1cf, 4, 11, 1.9);
    weakLight.position.set(-5.5, 2.6, 4.5);
    scene.add(weakLight);

    const clock = new THREE.Clock();

    function resize() {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    function applyLook() {
      camera.rotation.order = 'YXZ';
      camera.rotation.y = yawRef.current;
      camera.rotation.x = pitchRef.current;
    }

    function step() {
      const delta = Math.min(clock.getDelta(), 0.05);
      const direction = new THREE.Vector3();
      const side = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();
      side.crossVectors(direction, camera.up).normalize();

      const move = new THREE.Vector3();
      const keys = keysRef.current;
      if (keys.forward) move.add(direction);
      if (keys.backward) move.sub(direction);
      if (keys.left) move.sub(side);
      if (keys.right) move.add(side);
      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(MOVE_SPEED * delta);
        camera.position.add(move);
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, -CHAMBER_LIMIT_X, CHAMBER_LIMIT_X);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -CHAMBER_LIMIT_Z, CHAMBER_LIMIT_Z);
      }

      if (!mediaQuery.matches) {
        const elapsed = clock.elapsedTime;
        slitLight.intensity = 15.5 + Math.sin(elapsed * 1.7) * 2.2;
      }

      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(step);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'w' || event.key === 'ArrowUp') keysRef.current.forward = true;
      if (event.key === 's' || event.key === 'ArrowDown') keysRef.current.backward = true;
      if (event.key === 'a' || event.key === 'ArrowLeft') keysRef.current.left = true;
      if (event.key === 'd' || event.key === 'ArrowRight') keysRef.current.right = true;
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.key === 'w' || event.key === 'ArrowUp') keysRef.current.forward = false;
      if (event.key === 's' || event.key === 'ArrowDown') keysRef.current.backward = false;
      if (event.key === 'a' || event.key === 'ArrowLeft') keysRef.current.left = false;
      if (event.key === 'd' || event.key === 'ArrowRight') keysRef.current.right = false;
    }

    function onMouseMove(event: MouseEvent) {
      if (document.pointerLockElement !== renderer.domElement) return;
      yawRef.current -= event.movementX * LOOK_SPEED;
      pitchRef.current = THREE.MathUtils.clamp(pitchRef.current - event.movementY * LOOK_SPEED, -1.24, 1.24);
      applyLook();
    }

    function onPointerDown(event: PointerEvent) {
      if (document.pointerLockElement === renderer.domElement) return;
      pointerRef.current = { active: true, x: event.clientX, y: event.clientY };
      renderer.domElement.setPointerCapture(event.pointerId);
      setStarted(true);
    }

    function onPointerMove(event: PointerEvent) {
      const pointer = pointerRef.current;
      if (!pointer.active || document.pointerLockElement === renderer.domElement) return;
      yawRef.current -= (event.clientX - pointer.x) * LOOK_SPEED * 0.8;
      pitchRef.current = THREE.MathUtils.clamp(
        pitchRef.current - (event.clientY - pointer.y) * LOOK_SPEED * 0.8,
        -1.24,
        1.24,
      );
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      applyLook();
    }

    function onPointerUp(event: PointerEvent) {
      pointerRef.current.active = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    function onPointerLockChange() {
      const locked = document.pointerLockElement === renderer.domElement;
      setIsLocked(locked);
      if (locked) setStarted(true);
    }

    function onResize() {
      resize();
      renderer.render(scene, camera);
    }

    function onReducedMotionChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches);
    }

    resize();
    applyLook();
    renderer.render(scene, camera);

    step();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);
    mediaQuery.addEventListener('change', onReducedMotionChange);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      mediaQuery.removeEventListener('change', onReducedMotionChange);
      concreteTexture?.dispose();
      floorMaterial.dispose();
      concreteMaterial.dispose();
      darkConcrete.dispose();
      seamMaterial.dispose();
      glowMaterial.dispose();
      blackMaterial.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  function requestLock() {
    const canvas = rendererRef.current?.domElement;
    setStarted(true);
    if (canvas?.requestPointerLock) {
      canvas.requestPointerLock();
    }
  }

  function setMoveKey(key: MoveKey, value: boolean) {
    keysRef.current[key] = value;
    setStarted(true);
  }

  if (!webglOk) {
    return (
      <main class="liminal-shell liminal-fallback">
        <section class="liminal-fallback-panel" aria-labelledby="liminal-fallback-title">
          <p class="liminal-kicker">lab / liminal</p>
          <h1 id="liminal-fallback-title">webgl unavailable</h1>
          <p>
            This experiment needs WebGL to render the foggy test chamber. Try a browser or device with hardware
            acceleration enabled.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main class="liminal-shell" aria-label="Liminal concrete chamber walker">
      <div ref={mountRef} class="liminal-viewport" aria-hidden="true" />
      <section class="liminal-access" aria-label="Experiment controls">
        <h1>liminal</h1>
        <p>
          Foggy concrete chamber. Explore only. Use W A S D or arrow keys to move, drag to look, or click start for
          mouse look. Escape releases the pointer.
        </p>
      </section>
      <div class={`liminal-overlay ${started ? 'liminal-overlay-quiet' : ''}`}>
        <div class="liminal-status">
          <span>liminal</span>
          <span>{prefersReducedMotion ? 'motion reduced' : isLocked ? 'mouse look locked' : 'drag to look'}</span>
        </div>
        <button type="button" class="liminal-start" onClick={requestLock}>
          {isLocked ? 'locked' : 'start'}
        </button>
        <div class="liminal-help">
          <span>WASD / arrows move</span>
          <span>mouse drag looks</span>
          <span>Escape exits lock</span>
        </div>
      </div>
      <div class="liminal-touch-controls" aria-label="Touch movement controls">
        <button
          type="button"
          aria-label="Move forward"
          onPointerDown={() => setMoveKey('forward', true)}
          onPointerUp={() => setMoveKey('forward', false)}
          onPointerCancel={() => setMoveKey('forward', false)}
          onPointerLeave={() => setMoveKey('forward', false)}
        >
          ↑
        </button>
        <div>
          <button
            type="button"
            aria-label="Move left"
            onPointerDown={() => setMoveKey('left', true)}
            onPointerUp={() => setMoveKey('left', false)}
            onPointerCancel={() => setMoveKey('left', false)}
            onPointerLeave={() => setMoveKey('left', false)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Move backward"
            onPointerDown={() => setMoveKey('backward', true)}
            onPointerUp={() => setMoveKey('backward', false)}
            onPointerCancel={() => setMoveKey('backward', false)}
            onPointerLeave={() => setMoveKey('backward', false)}
          >
            ↓
          </button>
          <button
            type="button"
            aria-label="Move right"
            onPointerDown={() => setMoveKey('right', true)}
            onPointerUp={() => setMoveKey('right', false)}
            onPointerCancel={() => setMoveKey('right', false)}
            onPointerLeave={() => setMoveKey('right', false)}
          >
            →
          </button>
        </div>
      </div>
      <noscript>
        <p class="liminal-noscript">This experiment needs JavaScript and WebGL to render the chamber.</p>
      </noscript>
    </main>
  );
}
