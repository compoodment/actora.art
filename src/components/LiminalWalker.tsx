import { useEffect, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';

type MoveKey = 'forward' | 'backward' | 'left' | 'right';

const WALK_SPEED = 3.2;
const SPRINT_MULTIPLIER = 1.65;
const JUMP_SPEED = 4.8;
const GRAVITY = 13.5;
const BASE_LOOK_SPEED = 0.0022;
const CAMERA_HEIGHT = 1.62;
const ROOM_LIMIT_X = 6.6;
const ROOM_LIMIT_Z = 7.6;

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

  ctx.fillStyle = '#777a74';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 6500; i += 1) {
    const shade = 82 + Math.floor(Math.random() * 58);
    const alpha = 0.025 + Math.random() * 0.06;
    ctx.fillStyle = `rgba(${shade}, ${shade + 1}, ${shade - 2}, ${alpha})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2, 1 + Math.random() * 2);
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
  const sprintRef = useRef(false);
  const verticalVelocityRef = useRef(0);
  const groundedRef = useRef(true);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const sensitivityRef = useRef(1);
  const hasEnteredRef = useRef(false);
  const [webglOk, setWebglOk] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [sensitivity, setSensitivity] = useState(1);

  useEffect(() => {
    if (!supportsWebGL()) {
      setWebglOk(false);
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x555954);
    scene.fog = new THREE.Fog(0x555954, 8, 26);

    const camera = new THREE.PerspectiveCamera(68, 1, 0.04, 80);
    camera.position.set(0, CAMERA_HEIGHT, 5.8);

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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x555954, 1);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const concreteTexture = makeConcreteTexture();
    const floorTexture = concreteTexture?.clone() ?? null;
    const wallTexture = concreteTexture?.clone() ?? null;
    floorTexture?.repeat.set(5, 6);
    wallTexture?.repeat.set(4, 2);

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x6f746c,
      map: floorTexture ?? undefined,
      roughness: 0.98,
      metalness: 0.01,
    });
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x858980,
      map: wallTexture ?? undefined,
      roughness: 0.96,
      metalness: 0.01,
    });
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0x5d625d,
      roughness: 0.98,
      metalness: 0.01,
    });
    const seamMaterial = new THREE.MeshBasicMaterial({ color: 0x3a3d39 });
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x171814, roughness: 0.58, metalness: 0.45 });
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0d9a4,
      emissive: 0xf0c873,
      emissiveIntensity: 1.45,
      roughness: 0.18,
      metalness: 0.02,
    });

    function addBox(size: [number, number, number], position: [number, number, number], material: THREE.Material) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
      mesh.position.set(position[0], position[1], position[2]);
      scene.add(mesh);
      return mesh;
    }

    addBox([15, 0.2, 17], [0, -0.1, 0], floorMaterial);
    addBox([15, 0.24, 17], [0, 4.18, 0], ceilingMaterial);
    addBox([0.24, 4.4, 17], [-7.5, 2.1, 0], wallMaterial);
    addBox([0.24, 4.4, 17], [7.5, 2.1, 0], wallMaterial);
    addBox([15, 4.4, 0.24], [0, 2.1, -8.5], wallMaterial);
    addBox([15, 4.4, 0.24], [0, 2.1, 8.5], wallMaterial);

    addBox([0.05, 0.06, 16.6], [-7.34, 0.05, 0], seamMaterial);
    addBox([0.05, 0.06, 16.6], [7.34, 0.05, 0], seamMaterial);
    addBox([14.6, 0.06, 0.05], [0, 0.05, -8.34], seamMaterial);
    addBox([14.6, 0.06, 0.05], [0, 0.05, 8.34], seamMaterial);
    addBox([14.6, 0.05, 0.05], [0, 4.05, -8.34], seamMaterial);
    addBox([14.6, 0.05, 0.05], [0, 4.05, 8.34], seamMaterial);

    const chandelier = new THREE.Group();
    chandelier.position.set(0, 3.15, 0);
    scene.add(chandelier);

    const ceilingPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.08, 32), metalMaterial);
    ceilingPlate.position.y = 0.93;
    chandelier.add(ceilingPlate);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.86, 16), metalMaterial);
    stem.position.y = 0.48;
    chandelier.add(stem);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.025, 12, 48), metalMaterial);
    ring.rotation.x = Math.PI / 2;
    chandelier.add(ring);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 16), bulbMaterial);
    bulb.position.y = -0.16;
    chandelier.add(bulb);

    const ambient = new THREE.HemisphereLight(0xbec2b8, 0x262a26, 0.55);
    scene.add(ambient);
    const roomLight = new THREE.PointLight(0xf0d28d, 15, 19, 1.45);
    roomLight.position.set(0, 2.95, 0);
    scene.add(roomLight);

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
      if (move.lengthSq() > 0 && document.pointerLockElement === renderer.domElement) {
        const speed = WALK_SPEED * (sprintRef.current ? SPRINT_MULTIPLIER : 1);
        move.normalize().multiplyScalar(speed * delta);
        camera.position.add(move);
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, -ROOM_LIMIT_X, ROOM_LIMIT_X);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -ROOM_LIMIT_Z, ROOM_LIMIT_Z);
      }

      if (document.pointerLockElement === renderer.domElement || camera.position.y > CAMERA_HEIGHT) {
        verticalVelocityRef.current -= GRAVITY * delta;
        camera.position.y += verticalVelocityRef.current * delta;
        if (camera.position.y <= CAMERA_HEIGHT) {
          camera.position.y = CAMERA_HEIGHT;
          verticalVelocityRef.current = 0;
          groundedRef.current = true;
        }
      }

      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(step);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (hasEnteredRef.current) setMenuOpen(true);
        return;
      }
      if (event.key === 'Shift') sprintRef.current = true;
      if (event.code === 'Space') {
        if (document.pointerLockElement === renderer.domElement) {
          event.preventDefault();
          if (!event.repeat && groundedRef.current) {
            groundedRef.current = false;
            verticalVelocityRef.current = JUMP_SPEED;
          }
        }
        return;
      }
      if (event.repeat) return;
      if (event.key === 'w' || event.key === 'ArrowUp') keysRef.current.forward = true;
      if (event.key === 's' || event.key === 'ArrowDown') keysRef.current.backward = true;
      if (event.key === 'a' || event.key === 'ArrowLeft') keysRef.current.left = true;
      if (event.key === 'd' || event.key === 'ArrowRight') keysRef.current.right = true;
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.key === 'Shift') sprintRef.current = false;
      if (event.key === 'w' || event.key === 'ArrowUp') keysRef.current.forward = false;
      if (event.key === 's' || event.key === 'ArrowDown') keysRef.current.backward = false;
      if (event.key === 'a' || event.key === 'ArrowLeft') keysRef.current.left = false;
      if (event.key === 'd' || event.key === 'ArrowRight') keysRef.current.right = false;
    }

    function onMouseMove(event: MouseEvent) {
      if (document.pointerLockElement !== renderer.domElement) return;
      const lookSpeed = BASE_LOOK_SPEED * sensitivityRef.current;
      yawRef.current -= event.movementX * lookSpeed;
      pitchRef.current = THREE.MathUtils.clamp(pitchRef.current - event.movementY * lookSpeed, -1.22, 1.22);
      applyLook();
    }

    function onPointerLockChange() {
      const locked = document.pointerLockElement === renderer.domElement;
      setIsLocked(locked);
      if (!locked && hasEnteredRef.current) {
        keysRef.current = { forward: false, backward: false, left: false, right: false };
        sprintRef.current = false;
        setMenuOpen(true);
      }
    }

    function onResize() {
      resize();
      renderer.render(scene, camera);
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

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      concreteTexture?.dispose();
      floorTexture?.dispose();
      wallTexture?.dispose();
      floorMaterial.dispose();
      wallMaterial.dispose();
      ceilingMaterial.dispose();
      seamMaterial.dispose();
      metalMaterial.dispose();
      bulbMaterial.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  function enterRoom() {
    const canvas = rendererRef.current?.domElement;
    hasEnteredRef.current = true;
    setHasEntered(true);
    setMenuOpen(false);
    if (canvas?.requestPointerLock) {
      canvas.requestPointerLock();
    }
  }

  function exitRoom() {
    window.location.href = '/lab';
  }

  function updateSensitivity(value: number) {
    sensitivityRef.current = value;
    setSensitivity(value);
  }

  if (!webglOk) {
    return (
      <main class="liminal-shell liminal-fallback">
        <section class="liminal-fallback-panel" aria-labelledby="liminal-fallback-title">
          <p class="liminal-kicker">lab / liminal</p>
          <h1 id="liminal-fallback-title">webgl unavailable</h1>
          <p>This experiment needs WebGL to render the room. Try a browser with hardware acceleration enabled.</p>
        </section>
      </main>
    );
  }

  return (
    <main class="liminal-shell" aria-label="Liminal empty room walker">
      <div ref={mountRef} class="liminal-viewport" aria-hidden="true" />
      <section class="liminal-access" aria-label="Experiment controls">
        <h1>liminal</h1>
        <p>Empty room. Click enter, use W A S D to move, Shift to sprint, Space to jump, mouse to look, and Escape for options.</p>
      </section>
      {!menuOpen && isLocked && <div class="liminal-corner-note">esc</div>}
      {menuOpen && (
        <section class="liminal-menu" aria-labelledby="liminal-menu-title" role="dialog" aria-modal={hasEntered ? 'true' : 'false'}>
          <p class="liminal-kicker">lab / liminal</p>
          <h1 id="liminal-menu-title">empty room</h1>
          <p class="liminal-menu-copy">W A S D moves. Shift sprints. Space jumps. Mouse looks. Escape opens this menu.</p>
          <div class="liminal-menu-actions">
            <button type="button" class="liminal-button" onClick={enterRoom}>
              {hasEntered ? 'resume' : 'enter'}
            </button>
            <button type="button" class="liminal-button liminal-button-secondary" onClick={exitRoom}>
              exit to lab
            </button>
          </div>
          <label class="liminal-setting">
            <span>mouse sensitivity</span>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.1"
              value={sensitivity}
              onInput={(event) => updateSensitivity(Number((event.currentTarget as HTMLInputElement).value))}
            />
          </label>
        </section>
      )}
      <noscript>
        <p class="liminal-noscript">This experiment needs JavaScript and WebGL to render the room.</p>
      </noscript>
    </main>
  );
}
