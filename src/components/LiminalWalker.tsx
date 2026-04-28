import { useEffect, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';

const MOVEMENT_CODES = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ShiftLeft', 'ShiftRight', 'Space']);

const WALK_SPEED = 3.2;
const SPRINT_MULTIPLIER = 1.65;
const JUMP_SPEED = 4.8;
const GRAVITY = 13.5;
const BASE_LOOK_SPEED = 0.0022;
const CAMERA_HEIGHT = 1.62;
const ROOM_LIMIT_X = 6.6;
const ROOM_LIMIT_Z = 7.6;
const SETTINGS_STORAGE_KEY = 'actora.liminal.settings.v1';

type LiminalSettings = {
  sensitivity: number;
  renderScale: number;
};

type MenuPanel = 'main' | 'settings' | 'help';
type SettingsTab = 'controls' | 'graphics' | 'audio' | 'accessibility' | 'gameplay';

const DEFAULT_SETTINGS: LiminalSettings = {
  sensitivity: 1,
  renderScale: 1,
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
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<number>(0);
  const heldKeysRef = useRef<Set<string>>(new Set());
  const verticalVelocityRef = useRef(0);
  const groundedRef = useRef(true);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const sensitivityRef = useRef(1);
  const renderScaleRef = useRef(1);
  const menuOpenRef = useRef(true);
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

  function clearMovement() {
    heldKeysRef.current.clear();
  }

  useEffect(() => {
    sensitivityRef.current = settings.sensitivity;
    renderScaleRef.current = settings.renderScale;
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

    const camera = new THREE.PerspectiveCamera(68, 1, 0.04, 80);
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, renderScaleRef.current));
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, renderScaleRef.current));
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
      if (menuOpenRef.current) {
        renderer.render(scene, camera);
        frameRef.current = window.requestAnimationFrame(step);
        return;
      }

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
      if (move.lengthSq() > 0 && document.pointerLockElement === renderer.domElement) {
        const sprinting = heldKeys.has('ShiftLeft') || heldKeys.has('ShiftRight');
        const speed = WALK_SPEED * (sprinting ? SPRINT_MULTIPLIER : 1);
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
        event.preventDefault();
        clearMovement();
        if (menuOpenRef.current) {
          if (menuPanel !== 'main') {
            setMenuPanel('main');
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
        setMenuPanel('main');
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
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      rendererRef.current = null;
      cameraRef.current = null;
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
    const renderer = rendererRef.current;
    const mount = mountRef.current;
    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, next.renderScale));
      if (mount) renderer.setSize(mount.clientWidth, mount.clientHeight, false);
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
              <button type="button" class="liminal-button" onClick={() => setMenuPanel('settings')}>
                settings
              </button>
              <button type="button" class="liminal-button" onClick={() => setMenuPanel('help')}>
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
              )}
              {settingsTab === 'audio' && <p class="liminal-disabled-row">audio channels unavailable in this test build</p>}
              {settingsTab === 'accessibility' && <p class="liminal-disabled-row">accessibility overrides unavailable in this test build</p>}
              {settingsTab === 'gameplay' && <p class="liminal-disabled-row">gameplay parameters unavailable in this test build</p>}
              <button type="button" class="liminal-button liminal-button-secondary" onClick={() => setMenuPanel('main')}>
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
              <button type="button" class="liminal-button liminal-button-secondary" onClick={() => setMenuPanel('main')}>
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
