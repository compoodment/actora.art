import { useEffect, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';

const MOVEMENT_CODES = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ShiftLeft', 'ShiftRight', 'Space']);

const WALK_SPEED = 3.2;
const SPRINT_MULTIPLIER = 1.65;
const JUMP_SPEED = 4.8;
const GRAVITY = 13.5;
const BASE_LOOK_SPEED = 0.0022;
const CAMERA_HEIGHT = 1.62;
const MAX_FRAME_DELTA = 0.12;
const HEAD_BOB_WALK_STRIDE = 0.78;
const HEAD_BOB_SPRINT_STRIDE = 1.05;
const HEAD_BOB_PITCH_AMPLITUDE = 0.014;
const HEAD_BOB_ROLL_AMPLITUDE = 0.007;
const HEAD_BOB_SETTLE_RATE = 14;
const ROOM_LIMIT_X = 6.6;
const ROOM_LIMIT_Z = 7.6;
const SETTINGS_STORAGE_KEY = 'actora.liminal.settings.v1';

type LiminalSettings = {
  sensitivity: number;
  renderScale: number;
  lensFov: number;
  fisheye: boolean;
  fisheyeStrength: number;
  headBob: boolean;
};

type MenuPanel = 'main' | 'settings' | 'help';
type SettingsTab = 'controls' | 'graphics' | 'audio' | 'accessibility' | 'gameplay';

const DEFAULT_SETTINGS: LiminalSettings = {
  sensitivity: 1,
  renderScale: 1,
  lensFov: 68,
  fisheye: true,
  fisheyeStrength: 0.4,
  headBob: true,
};

const SETTINGS_TABS: SettingsTab[] = ['controls', 'graphics', 'audio', 'accessibility', 'gameplay'];

function clampSetting(value: unknown, fallback: number, min: number, max: number) {
  return typeof value === 'number' && Number.isFinite(value) ? THREE.MathUtils.clamp(value, min, max) : fallback;
}

function loadSettings(): LiminalSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<LiminalSettings>;
    return {
      sensitivity: clampSetting(parsed.sensitivity, DEFAULT_SETTINGS.sensitivity, 0.5, 1.8),
      renderScale: clampSetting(parsed.renderScale, DEFAULT_SETTINGS.renderScale, 0.7, 1.6),
      lensFov: clampSetting(parsed.lensFov, DEFAULT_SETTINGS.lensFov, 60, 115),
      fisheye: typeof parsed.fisheye === 'boolean' ? parsed.fisheye : DEFAULT_SETTINGS.fisheye,
      fisheyeStrength: clampSetting(parsed.fisheyeStrength, DEFAULT_SETTINGS.fisheyeStrength, 0, 1),
      headBob: typeof parsed.headBob === 'boolean' ? parsed.headBob : DEFAULT_SETTINGS.headBob,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: LiminalSettings) {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Local-only preference persistence is best effort.
  }
}

function getRenderPixelRatio(renderScale: number) {
  return Math.min(window.devicePixelRatio * renderScale, 2.5);
}

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
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const resizeRendererRef = useRef<(() => void) | null>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<number>(0);
  const heldKeysRef = useRef<Set<string>>(new Set());
  const playerPositionRef = useRef(new THREE.Vector3(0, CAMERA_HEIGHT, 5.8));
  const verticalVelocityRef = useRef(0);
  const groundedRef = useRef(true);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const headBobEnabledRef = useRef(true);
  const headBobPhaseRef = useRef(0);
  const headBobViewOffsetRef = useRef(new THREE.Vector3());
  const sensitivityRef = useRef(1);
  const renderScaleRef = useRef(1);
  const fisheyeEnabledRef = useRef(true);
  const fisheyeStrengthRef = useRef(0.4);
  const menuOpenRef = useRef(true);
  const menuPanelRef = useRef<MenuPanel>('main');
  const hasEnteredRef = useRef(false);
  const [webglOk, setWebglOk] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [pointerLockError, setPointerLockError] = useState('');
  const [settings, setSettings] = useState<LiminalSettings>(() => loadSettings());
  const [menuPanel, setMenuPanel] = useState<MenuPanel>('main');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('controls');

  function setPaused(open: boolean) {
    menuOpenRef.current = open;
    setMenuOpen(open);
  }

  function setPanel(panel: MenuPanel) {
    menuPanelRef.current = panel;
    setMenuPanel(panel);
  }

  function clearMovement() {
    heldKeysRef.current.clear();
  }

  useEffect(() => {
    sensitivityRef.current = settings.sensitivity;
    renderScaleRef.current = settings.renderScale;
    fisheyeEnabledRef.current = settings.fisheye;
    fisheyeStrengthRef.current = settings.fisheyeStrength;
    headBobEnabledRef.current = settings.headBob;
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    window.setTimeout(() => primaryButtonRef.current?.focus(), 0);
  }, [menuOpen]);

  useEffect(() => {
    if (!supportsWebGL()) {
      setWebglOk(false);
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x555954);

    const camera = new THREE.PerspectiveCamera(settings.lensFov, 1, 0.04, 80);
    camera.position.set(0, CAMERA_HEIGHT, 5.8);
    cameraRef.current = camera;

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

    renderer.setPixelRatio(getRenderPixelRatio(renderScaleRef.current));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x555954, 1);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const fisheyeTarget = new THREE.WebGLRenderTarget(1, 1, {
      depthBuffer: true,
      stencilBuffer: false,
      type: THREE.UnsignedByteType,
    });
    fisheyeTarget.texture.colorSpace = THREE.SRGBColorSpace;
    const fisheyeScene = new THREE.Scene();
    const fisheyeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const fisheyeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: fisheyeTarget.texture },
        strength: { value: settings.fisheyeStrength },
        aspect: { value: 1 },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float strength;
        uniform float aspect;
        varying vec2 vUv;

        void main() {
          vec2 centered = vUv * 2.0 - 1.0;
          vec2 aspectCorrected = vec2(centered.x * aspect, centered.y);
          float radiusSquared = dot(aspectCorrected, aspectCorrected);
          float barrel = 1.0 + strength * 0.42 * radiusSquared + strength * 0.08 * radiusSquared * radiusSquared;
          vec2 sampleUv = (centered / barrel + 1.0) * 0.5;

          gl_FragColor = texture2D(tDiffuse, clamp(sampleUv, vec2(0.0), vec2(1.0)));
        }
      `,
    });
    const fisheyeQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fisheyeMaterial);
    fisheyeScene.add(fisheyeQuad);

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
    const seamMaterial = new THREE.MeshBasicMaterial({ color: 0x4b4f49 });
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

    addBox([0.045, 0.045, 16.55], [-7.34, 0.06, 0], seamMaterial);
    addBox([0.045, 0.045, 16.55], [7.34, 0.06, 0], seamMaterial);
    addBox([14.55, 0.045, 0.045], [0, 0.06, -8.34], seamMaterial);
    addBox([14.55, 0.045, 0.045], [0, 0.06, 8.34], seamMaterial);
    addBox([0.045, 0.045, 16.55], [-7.34, 4.03, 0], seamMaterial);
    addBox([0.045, 0.045, 16.55], [7.34, 4.03, 0], seamMaterial);
    addBox([14.55, 0.045, 0.045], [0, 4.03, -8.34], seamMaterial);
    addBox([14.55, 0.045, 0.045], [0, 4.03, 8.34], seamMaterial);
    addBox([0.045, 4, 0.045], [-7.34, 2.04, -8.34], seamMaterial);
    addBox([0.045, 4, 0.045], [7.34, 2.04, -8.34], seamMaterial);
    addBox([0.045, 4, 0.045], [-7.34, 2.04, 8.34], seamMaterial);
    addBox([0.045, 4, 0.045], [7.34, 2.04, 8.34], seamMaterial);

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
      renderer.setPixelRatio(getRenderPixelRatio(renderScaleRef.current));
      const pixelRatio = renderer.getPixelRatio();
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      fisheyeTarget.setSize(Math.max(1, Math.floor(width * pixelRatio)), Math.max(1, Math.floor(height * pixelRatio)));
      fisheyeMaterial.uniforms.aspect.value = width / Math.max(height, 1);
    }
    resizeRendererRef.current = resize;

    function applyLook() {
      camera.rotation.order = 'YXZ';
      camera.rotation.y = yawRef.current;
      camera.rotation.x = pitchRef.current;
      camera.rotation.z = 0;
    }

    function renderFrame() {
      const viewOffset = headBobViewOffsetRef.current;
      const shouldApplyFisheye = fisheyeEnabledRef.current && fisheyeStrengthRef.current > 0.001;
      camera.position.copy(playerPositionRef.current);
      camera.rotation.order = 'YXZ';
      camera.rotation.y = yawRef.current;
      camera.rotation.x = THREE.MathUtils.clamp(pitchRef.current + viewOffset.y, -1.22, 1.22);
      camera.rotation.z = viewOffset.x;
      fisheyeMaterial.uniforms.strength.value = fisheyeStrengthRef.current;

      if (shouldApplyFisheye) {
        renderer.setRenderTarget(fisheyeTarget);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        renderer.render(fisheyeScene, fisheyeCamera);
      } else {
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
      }

      camera.position.copy(playerPositionRef.current);
      camera.rotation.y = yawRef.current;
      camera.rotation.x = pitchRef.current;
      camera.rotation.z = 0;
    }

    function settleHeadBob(delta: number) {
      const offset = headBobViewOffsetRef.current;
      if (offset.lengthSq() > 0.000001) {
        offset.x = THREE.MathUtils.damp(offset.x, 0, HEAD_BOB_SETTLE_RATE, delta);
        offset.y = THREE.MathUtils.damp(offset.y, 0, HEAD_BOB_SETTLE_RATE, delta);
        offset.z = THREE.MathUtils.damp(offset.z, 0, HEAD_BOB_SETTLE_RATE, delta);
      } else {
        offset.set(0, 0, 0);
        headBobPhaseRef.current = 0;
      }
    }

    function step() {
      const delta = Math.min(clock.getDelta(), MAX_FRAME_DELTA);

      if (menuOpenRef.current) {
        settleHeadBob(delta);
        renderFrame();
        frameRef.current = window.requestAnimationFrame(step);
        return;
      }

      const playerPosition = playerPositionRef.current;
      const direction = new THREE.Vector3();
      const side = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();
      side.crossVectors(direction, camera.up).normalize();

      const move = new THREE.Vector3();
      const heldKeys = heldKeysRef.current;
      if (heldKeys.has('KeyW') || heldKeys.has('ArrowUp')) move.add(direction);
      if (heldKeys.has('KeyS') || heldKeys.has('ArrowDown')) move.sub(direction);
      if (heldKeys.has('KeyA') || heldKeys.has('ArrowLeft')) move.sub(side);
      if (heldKeys.has('KeyD') || heldKeys.has('ArrowRight')) move.add(side);
      const isTryingToMove = move.lengthSq() > 0;
      const isPointerLocked = document.pointerLockElement === renderer.domElement;
      const sprinting = heldKeys.has('ShiftLeft') || heldKeys.has('ShiftRight');
      const previousX = playerPosition.x;
      const previousZ = playerPosition.z;
      if (isTryingToMove && isPointerLocked) {
        const speed = WALK_SPEED * (sprinting ? SPRINT_MULTIPLIER : 1);
        move.normalize().multiplyScalar(speed * delta);
        playerPosition.add(move);
        playerPosition.x = THREE.MathUtils.clamp(playerPosition.x, -ROOM_LIMIT_X, ROOM_LIMIT_X);
        playerPosition.z = THREE.MathUtils.clamp(playerPosition.z, -ROOM_LIMIT_Z, ROOM_LIMIT_Z);
      }

      if (isPointerLocked || playerPosition.y > CAMERA_HEIGHT) {
        verticalVelocityRef.current -= GRAVITY * delta;
        playerPosition.y += verticalVelocityRef.current * delta;
        if (playerPosition.y <= CAMERA_HEIGHT) {
          playerPosition.y = CAMERA_HEIGHT;
          verticalVelocityRef.current = 0;
          groundedRef.current = true;
        }
      }

      const horizontalDistance = Math.hypot(playerPosition.x - previousX, playerPosition.z - previousZ);
      const shouldBob = headBobEnabledRef.current && isPointerLocked && horizontalDistance > 0.001 && groundedRef.current;
      if (shouldBob) {
        const strideLength = sprinting ? HEAD_BOB_SPRINT_STRIDE : HEAD_BOB_WALK_STRIDE;
        headBobPhaseRef.current += (horizontalDistance / strideLength) * Math.PI * 2;
        const roll = Math.sin(headBobPhaseRef.current * 0.5) * HEAD_BOB_ROLL_AMPLITUDE;
        const pitch = Math.sin(headBobPhaseRef.current) * HEAD_BOB_PITCH_AMPLITUDE;
        headBobViewOffsetRef.current.set(roll, pitch, 0);
      } else {
        settleHeadBob(delta);
      }

      renderFrame();
      frameRef.current = window.requestAnimationFrame(step);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        clearMovement();
        if (menuOpenRef.current) {
          if (menuPanelRef.current !== 'main') {
            setPanel('main');
            return;
          }
          if (hasEnteredRef.current) enterRoom();
          return;
        }
        if (hasEnteredRef.current) setPaused(true);
        return;
      }

      if (menuOpenRef.current || document.pointerLockElement !== renderer.domElement) return;

      if (!MOVEMENT_CODES.has(event.code)) return;
      event.preventDefault();

      if (event.code === 'Space') {
        if (!event.repeat && groundedRef.current) {
          groundedRef.current = false;
          verticalVelocityRef.current = JUMP_SPEED;
        }
        return;
      }

      heldKeysRef.current.add(event.code);
    }

    function onKeyUp(event: KeyboardEvent) {
      heldKeysRef.current.delete(event.code);
    }

    function onMouseMove(event: MouseEvent) {
      if (menuOpenRef.current || document.pointerLockElement !== renderer.domElement) return;
      const lookSpeed = BASE_LOOK_SPEED * sensitivityRef.current;
      yawRef.current -= event.movementX * lookSpeed;
      pitchRef.current = THREE.MathUtils.clamp(pitchRef.current - event.movementY * lookSpeed, -1.22, 1.22);
      applyLook();
    }

    function onPointerLockChange() {
      const locked = document.pointerLockElement === renderer.domElement;
      setIsLocked(locked);
      if (locked) {
        hasEnteredRef.current = true;
        setHasEntered(true);
        setPointerLockError('');
        setPaused(false);
        return;
      }
      if (hasEnteredRef.current) {
        clearMovement();
        setPanel('main');
        setPaused(true);
      }
    }

    function onPointerLockError() {
      clearMovement();
      setPointerLockError('Mouse look did not start. Click resume again.');
      setPaused(true);
    }

    function onWindowBlur() {
      clearMovement();
    }

    function onVisibilityChange() {
      if (document.hidden) clearMovement();
    }

    function onResize() {
      resize();
      renderFrame();
    }

    resize();
    applyLook();
    renderFrame();
    step();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    window.addEventListener('blur', onWindowBlur);
    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockError);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('blur', onWindowBlur);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('pointerlockerror', onPointerLockError);
      concreteTexture?.dispose();
      floorTexture?.dispose();
      wallTexture?.dispose();
      floorMaterial.dispose();
      wallMaterial.dispose();
      ceilingMaterial.dispose();
      seamMaterial.dispose();
      metalMaterial.dispose();
      bulbMaterial.dispose();
      fisheyeTarget.dispose();
      fisheyeMaterial.dispose();
      fisheyeQuad.geometry.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      rendererRef.current = null;
      cameraRef.current = null;
      resizeRendererRef.current = null;
    };
  }, []);

  function enterRoom() {
    const canvas = rendererRef.current?.domElement;
    clearMovement();
    setPointerLockError('');

    if (!canvas?.requestPointerLock) {
      setPointerLockError('Mouse look is unavailable in this browser.');
      setPaused(true);
      return;
    }

    try {
      const request = canvas.requestPointerLock();
      if (request && 'catch' in request) {
        request.catch(() => {
          clearMovement();
          setPointerLockError('Mouse look did not start. Click resume again.');
          setPaused(true);
        });
      }
    } catch {
      setPointerLockError('Mouse look did not start. Click resume again.');
      setPaused(true);
    }
  }

  function restartRoom() {
    const camera = cameraRef.current;
    clearMovement();
    verticalVelocityRef.current = 0;
    groundedRef.current = true;
    yawRef.current = 0;
    pitchRef.current = 0;
    playerPositionRef.current.set(0, CAMERA_HEIGHT, 5.8);
    headBobPhaseRef.current = 0;
    headBobViewOffsetRef.current.set(0, 0, 0);
    if (camera) {
      camera.position.set(0, CAMERA_HEIGHT, 5.8);
      camera.rotation.order = 'YXZ';
      camera.rotation.y = 0;
      camera.rotation.x = 0;
    }
  }

  function exitRoom() {
    window.location.href = '/lab';
  }

  function updateSettings(next: LiminalSettings) {
    sensitivityRef.current = next.sensitivity;
    renderScaleRef.current = next.renderScale;
    fisheyeEnabledRef.current = next.fisheye;
    fisheyeStrengthRef.current = next.fisheyeStrength;
    headBobEnabledRef.current = next.headBob;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const mount = mountRef.current;
    if (camera) {
      camera.fov = next.lensFov;
      camera.updateProjectionMatrix();
    }
    if (renderer) {
      renderer.setPixelRatio(getRenderPixelRatio(next.renderScale));
      if (mount) renderer.setSize(mount.clientWidth, mount.clientHeight, false);
      resizeRendererRef.current?.();
    }
    setSettings(next);
    saveSettings(next);
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
        <p>Empty room. Click enter, use W A S D to move, Shift to sprint, Space to jump, mouse to look, and Escape for menu/back.</p>
      </section>
      {!menuOpen && isLocked && <div class="liminal-corner-note">esc</div>}
      {menuOpen && (
        <section class="liminal-menu" aria-labelledby="liminal-menu-title" role="dialog" aria-modal={hasEntered ? 'true' : 'false'}>
          <div class="liminal-menu-scanline" aria-hidden="true" />
          <p class="liminal-kicker">liminal</p>
          <h1 id="liminal-menu-title">options</h1>
          {pointerLockError && <p class="liminal-menu-error">{pointerLockError}</p>}
          {menuPanel === 'main' && (
            <div class="liminal-menu-actions">
              <button ref={primaryButtonRef} type="button" class="liminal-button" onClick={enterRoom}>
                {hasEntered ? 'resume' : 'enter'}
              </button>
              <button type="button" class="liminal-button" onClick={restartRoom}>
                restart
              </button>
              <button type="button" class="liminal-button" onClick={() => setPanel('settings')}>
                settings
              </button>
              <button type="button" class="liminal-button" onClick={() => setPanel('help')}>
                help
              </button>
              <button type="button" class="liminal-button liminal-button-secondary" onClick={exitRoom}>
                exit to lab
              </button>
            </div>
          )}
          {menuPanel === 'settings' && (
            <div class="liminal-menu-panel">
              <div class="liminal-tab-row" role="tablist" aria-label="Settings sections">
                {SETTINGS_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    class={`liminal-tab${settingsTab === tab ? ' is-active' : ''}`}
                    role="tab"
                    aria-selected={settingsTab === tab ? 'true' : 'false'}
                    onClick={() => setSettingsTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {settingsTab === 'controls' && (
                <label class="liminal-setting">
                  <span>mouse sensitivity</span>
                  <output>{settings.sensitivity.toFixed(1)}</output>
                  <input
                    type="range"
                    min="0.5"
                    max="1.8"
                    step="0.1"
                    value={settings.sensitivity}
                    onInput={(event) => updateSettings({ ...settings, sensitivity: Number((event.currentTarget as HTMLInputElement).value) })}
                  />
                </label>
              )}
              {settingsTab === 'graphics' && (
                <div class="liminal-setting-group">
                  <label class="liminal-setting">
                    <span>lens</span>
                    <output>{settings.lensFov.toFixed(0)}°</output>
                    <input
                      type="range"
                      min="60"
                      max="115"
                      step="1"
                      value={settings.lensFov}
                      onInput={(event) => updateSettings({ ...settings, lensFov: Number((event.currentTarget as HTMLInputElement).value) })}
                    />
                  </label>
                  <label class="liminal-setting">
                    <span>render scale</span>
                    <output>{settings.renderScale.toFixed(2)}</output>
                    <input
                      type="range"
                      min="0.7"
                      max="1.6"
                      step="0.05"
                      value={settings.renderScale}
                      onInput={(event) => updateSettings({ ...settings, renderScale: Number((event.currentTarget as HTMLInputElement).value) })}
                    />
                  </label>
                  <label class="liminal-setting liminal-toggle-setting">
                    <span>fisheye</span>
                    <input
                      type="checkbox"
                      checked={settings.fisheye}
                      onInput={(event) => updateSettings({ ...settings, fisheye: (event.currentTarget as HTMLInputElement).checked })}
                    />
                  </label>
                  <label class="liminal-setting">
                    <span>fisheye strength</span>
                    <output>{settings.fisheyeStrength.toFixed(2)}</output>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.fisheyeStrength}
                      onInput={(event) => updateSettings({ ...settings, fisheyeStrength: Number((event.currentTarget as HTMLInputElement).value) })}
                    />
                  </label>
                </div>
              )}
              {settingsTab === 'audio' && <p class="liminal-disabled-row">audio channels unavailable in this test build</p>}
              {settingsTab === 'accessibility' && <p class="liminal-disabled-row">accessibility overrides unavailable in this test build</p>}
              {settingsTab === 'gameplay' && (
                <label class="liminal-setting liminal-toggle-setting">
                  <span>head bob</span>
                  <input
                    type="checkbox"
                    checked={settings.headBob}
                    onInput={(event) => updateSettings({ ...settings, headBob: (event.currentTarget as HTMLInputElement).checked })}
                  />
                </label>
              )}
              <button type="button" class="liminal-button liminal-button-secondary" onClick={() => setPanel('main')}>
                back
              </button>
            </div>
          )}
          {menuPanel === 'help' && (
            <div class="liminal-menu-panel">
              <dl class="liminal-help-list">
                <div>
                  <dt>move</dt>
                  <dd>W A S D</dd>
                </div>
                <div>
                  <dt>sprint</dt>
                  <dd>Shift</dd>
                </div>
                <div>
                  <dt>jump</dt>
                  <dd>Space</dd>
                </div>
                <div>
                  <dt>look</dt>
                  <dd>Mouse</dd>
                </div>
                <div>
                  <dt>menu / back</dt>
                  <dd>Escape</dd>
                </div>
              </dl>
              <button type="button" class="liminal-button liminal-button-secondary" onClick={() => setPanel('main')}>
                back
              </button>
            </div>
          )}
        </section>
      )}
      <noscript>
        <p class="liminal-noscript">This experiment needs JavaScript and WebGL to render the room.</p>
      </noscript>
    </main>
  );
}
