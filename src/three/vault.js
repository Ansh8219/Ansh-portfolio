/**
 * Ansh assistant bot: a solid, product-style 3D character whose head is a screen, built
 * procedurally with three.js.
 * Loaded lazily by VaultStage, client-side only. No model files, no image textures: the only
 * texture is a small canvas drawn at runtime for the front display.
 *
 * Scroll-driven state (`api`), written by GSAP ScrollTriggers in VaultStage:
 *   t           0 = hero (product angle) -> 1 = services (facing front) -> 2 = contact (waving)
 *   x, y        screen position (x as a fraction of the half-width, y in world units)
 *   scale       object scale
 *   zoom        0..1 push toward the camera (services -> work transition)
 *   visibility  0..1 opacity of the whole layer
 *   intro       0..1 entrance
 *   lift        0..1 scroll through the hero: moves the object up one viewport height (page speed)
 */
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  CylinderGeometry,
  TorusGeometry,
  SphereGeometry,
  PlaneGeometry,
  CapsuleGeometry,
  CanvasTexture,
  DirectionalLight,
  HemisphereLight,
  PMREMGenerator,
  Color,
  MathUtils,
  SRGBColorSpace,
  ACESFilmicToneMapping,
} from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const FOV = 30
const CAMERA_Z = 9
const ACCENT = '#FF6A13'

const smooth = (x) => x * x * (3 - 2 * x)
const clamp01 = (x) => Math.min(1, Math.max(0, x))

/** WebGL availability probe that never throws. */
export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * True when WebGL runs on a CPU fallback (SwiftShader, llvmpipe, Microsoft Basic Render…).
 * The scene would cost a full CPU core there, so VaultStage keeps the static visual instead.
 */
export function isSoftwareRenderer() {
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    if (!gl) return true
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const name = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(String(name))
  } catch {
    return false
  }
}

/**
 * The bot's face: drawn on a small canvas, redrawn only when something changes (text, blink,
 * quantised gaze, cursor). Eyes on top, the active word + a status line below.
 */
function createDisplay() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 320
  const ctx = canvas.getContext('2d')
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4

  let state = { word: 'AN', sub: 'Ansh · ready', color: ACCENT }
  let cursorOn = true
  let eyesOpen = true
  let gazeX = 0
  let gazeY = 0

  function draw() {
    const { width: w, height: h } = canvas
    ctx.fillStyle = '#0d0e13'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(255,255,255,0.025)'
    for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 2)

    // eyes
    ctx.fillStyle = state.color
    const eyeW = 84
    const eyeH = eyesOpen ? 92 : 10
    ;[150, 362].forEach((cx) => {
      const x = cx - eyeW / 2 + gazeX * 16
      const y = 96 - eyeH / 2 + gazeY * 10
      ctx.beginPath()
      ctx.roundRect(x, y, eyeW, eyeH, Math.min(26, eyeH / 2))
      ctx.fill()
    })

    // word (shrinks to fit) + blinking cursor
    let size = 76
    const family = '"Bricolage Grotesque", "DM Sans", system-ui, sans-serif'
    ctx.font = `600 ${size}px ${family}`
    while (ctx.measureText(state.word).width > 400 && size > 30) {
      size -= 4
      ctx.font = `600 ${size}px ${family}`
    }
    ctx.textBaseline = 'alphabetic'
    const wordWidth = ctx.measureText(state.word).width
    const x0 = (w - wordWidth - 28) / 2
    ctx.fillText(state.word, x0, 218)
    if (cursorOn) ctx.fillRect(x0 + wordWidth + 8, 218 - size * 0.78, 14, size * 0.78)

    ctx.fillStyle = 'rgba(238,235,227,0.6)'
    ctx.font = '500 24px "JetBrains Mono", ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(state.sub, w / 2, 280)
    ctx.textAlign = 'start'
    texture.needsUpdate = true
  }
  draw()

  return {
    texture,
    set(next) {
      state = { ...state, ...next }
      draw()
    },
    blink(on) {
      if (on === cursorOn) return
      cursorOn = on
      draw()
    },
    eyes(open) {
      if (open === eyesOpen) return
      eyesOpen = open
      draw()
    },
    gaze(x, y) {
      // quantised so the texture only redraws a handful of times while the pointer moves
      const qx = Math.round(x * 3) / 3
      const qy = Math.round(y * 3) / 3
      if (qx === gazeX && qy === gazeY) return
      gazeX = qx
      gazeY = qy
      draw()
    },
    dispose() {
      texture.dispose()
    },
  }
}

/** Soft contact shadow under the object (radial gradient on a plane). */
function createShadowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64)
  g.addColorStop(0, 'rgba(0,0,0,0.55)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new CanvasTexture(canvas)
}

/**
 * @param {HTMLElement} container element the canvas is appended to (its opacity follows `visibility`)
 */
export function createVault(container) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  const canvas = renderer.domElement
  canvas.style.cssText = 'display:block;width:100%;height:100%'
  container.appendChild(canvas)

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTexture
  pmrem.dispose()

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 80)
  camera.position.z = CAMERA_Z

  scene.add(new HemisphereLight(0xffffff, 0x30323a, 0.6))
  const key = new DirectionalLight(0xffffff, 1.6)
  key.position.set(3, 5, 6)
  scene.add(key)

  // ── materials ──
  const shell = new MeshStandardMaterial({ color: '#ECE8DF', roughness: 0.42, metalness: 0 })
  const shellDim = new MeshStandardMaterial({ color: '#DAD5C8', roughness: 0.45, metalness: 0 })
  const dark = new MeshStandardMaterial({ color: '#17181f', roughness: 0.35, metalness: 0.2 })
  const steel = new MeshStandardMaterial({ color: '#2a2c35', roughness: 0.25, metalness: 0.7 })
  const accentMat = new MeshStandardMaterial({ color: ACCENT, roughness: 0.4, emissive: ACCENT, emissiveIntensity: 0.35 })
  const ledMat = new MeshBasicMaterial({ color: ACCENT, toneMapped: false })
  const thrusterMat = new MeshBasicMaterial({ color: ACCENT, toneMapped: false, transparent: true, opacity: 0.55, depthWrite: false })
  const display = createDisplay()
  const screenMat = new MeshBasicMaterial({ map: display.texture, toneMapped: false })
  const shadowTex = createShadowTexture()
  const shadowMat = new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })

  const geos = []
  const geo = (g) => {
    geos.push(g)
    return g
  }

  // ── object ──
  const root = new Group() // position / scale / intro
  const body = new Group() // rotation
  const figure = new Group() // fits the taller bot into the same footprint the old unit had
  figure.scale.setScalar(0.8)
  root.add(body)
  body.add(figure)
  scene.add(root)

  const add = (parent, mesh, x = 0, y = 0, z = 0) => {
    mesh.position.set(x, y, z)
    parent.add(mesh)
    return mesh
  }
  const rbox = (w, h, d, r, mat) => new Mesh(geo(new RoundedBoxGeometry(w, h, d, 4, r)), mat)

  // head: a big rounded box whose front is the screen
  const head = new Group()
  head.position.set(0, 0.55, 0)
  figure.add(head)
  add(head, rbox(2.1, 1.5, 1.1, 0.26, shell))
  add(head, rbox(1.84, 1.2, 0.08, 0.14, dark), 0, 0, 0.55)
  add(head, new Mesh(geo(new PlaneGeometry(1.7, 1.06)), screenMat), 0, 0, 0.6)
  // ear pods
  ;[-1, 1].forEach((side) => {
    const pod = new Mesh(geo(new CylinderGeometry(0.2, 0.2, 0.18, 28)), steel)
    pod.rotation.z = Math.PI / 2
    add(head, pod, side * 1.12, 0, 0)
    const cap = new Mesh(geo(new CylinderGeometry(0.11, 0.11, 0.2, 24)), accentMat)
    cap.rotation.z = Math.PI / 2
    add(head, cap, side * 1.14, 0, 0)
  })
  // antenna with a pulsing LED
  add(head, new Mesh(geo(new CylinderGeometry(0.035, 0.035, 0.32, 12)), steel), 0, 0.9, 0)
  const antennaLed = add(head, new Mesh(geo(new SphereGeometry(0.1, 20, 20)), ledMat), 0, 1.1, 0)

  // neck + torso
  add(figure, new Mesh(geo(new CylinderGeometry(0.2, 0.26, 0.2, 20)), steel), 0, -0.28, 0)
  const torso = new Group()
  torso.position.set(0, -0.78, 0)
  figure.add(torso)
  add(torso, rbox(1.35, 0.86, 0.85, 0.28, shellDim))
  add(torso, rbox(0.62, 0.14, 0.05, 0.05, accentMat), 0, 0.08, 0.43)
  add(torso, rbox(0.34, 0.06, 0.04, 0.03, dark), 0, -0.14, 0.43)

  // arms, pivoting at the shoulder
  const makeArm = (side) => {
    const pivot = new Group()
    pivot.position.set(side * 0.86, -0.62, 0)
    figure.add(pivot)
    add(pivot, new Mesh(geo(new SphereGeometry(0.15, 20, 20)), steel))
    add(pivot, new Mesh(geo(new CapsuleGeometry(0.12, 0.5, 6, 16)), shell), 0, -0.36, 0)
    add(pivot, new Mesh(geo(new SphereGeometry(0.15, 20, 20)), dark), 0, -0.72, 0)
    return pivot
  }
  const armL = makeArm(-1)
  const armR = makeArm(1)

  // hover thruster under the torso
  const thruster = new Mesh(geo(new TorusGeometry(0.36, 0.035, 10, 48)), steel)
  thruster.rotation.x = Math.PI / 2
  add(figure, thruster, 0, -1.3, 0)
  const glow = new Mesh(geo(new CylinderGeometry(0.3, 0.12, 0.34, 28, 1, true)), thrusterMat)
  add(figure, glow, 0, -1.5, 0)

  // contact shadow (further below: the bot floats)
  const shadow = new Mesh(geo(new PlaneGeometry(3.6, 1.9)), shadowMat)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -1.95
  body.add(shadow)

  // ── state ──
  const api = { t: 0, x: 0.46, y: 0.7, scale: 0.46, zoom: 0, visibility: 1, intro: 0, lift: 0 }
  const hue = new Color(ACCENT)
  const hueTarget = new Color(ACCENT)

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  const onPointer = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  function resize() {
    const rect = container.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect.width))
    const height = Math.max(1, Math.round(rect.height))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  let raf = 0
  let running = false
  let last = performance.now()
  let time = 0
  let blinkClock = 0
  let drewFirstFrame = false
  let onFirstFrame = null

  function frame(now) {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    time += dt

    const master = clamp01(api.visibility) * clamp01(api.intro)
    container.style.opacity = master.toFixed(3)
    if (master < 0.004) return

    const t = MathUtils.clamp(api.t, 0, 2)
    const toFront = smooth(clamp01(t))
    const open = smooth(clamp01(t - 1))
    const zoom = smooth(clamp01(api.zoom))

    pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 3)
    pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 3)

    // pose: product angle (hero) -> facing front (services) -> turned to show the open door (contact)
    const heroY = -0.62 + Math.sin(time * 0.5) * 0.06
    const heroX = 0.38
    const frontY = Math.sin(time * 0.4) * 0.12
    const frontX = 0.08
    let rotY = MathUtils.lerp(heroY, frontY, toFront)
    let rotX = MathUtils.lerp(heroX, frontX, toFront)
    rotY = MathUtils.lerp(rotY, 0.5, open)
    rotX = MathUtils.lerp(rotX, 0.12, open)
    // the zoom squares the object up to the camera
    rotY = MathUtils.lerp(rotY, 0, zoom)
    rotX = MathUtils.lerp(rotX, 0, zoom)
    body.rotation.set(rotX + pointer.sy * 0.12 * (1 - zoom), rotY + pointer.sx * 0.25 * (1 - zoom), 0)

    // head follows the pointer a little more than the body; eyes track it on the screen itself
    head.rotation.set(pointer.sy * 0.14 * (1 - zoom), pointer.sx * 0.3 * (1 - zoom), pointer.sx * -0.03)
    display.gaze(pointer.sx * (1 - zoom), pointer.sy * (1 - zoom))
    // idle blink: eyes shut for ~0.12 s every few seconds
    display.eyes(!((time % 3.6) > 3.48))

    // arms: relaxed swing, then the right arm waves when the contact state (t = 2) is reached
    armL.rotation.z = 0.12 + Math.sin(time * 0.9) * 0.05
    armR.rotation.z = MathUtils.lerp(-0.12 - Math.sin(time * 0.9 + 1) * 0.05, -2.5 + Math.sin(time * 6) * 0.28, open)
    thruster.rotation.z = time * 1.5
    glow.scale.y = 0.85 + Math.sin(time * 9) * 0.12

    hue.lerp(hueTarget, Math.min(1, dt * 4))
    ledMat.color.copy(hue)
    accentMat.color.copy(hue)
    accentMat.emissive.copy(hue)
    thrusterMat.color.copy(hue)
    ledMat.color.multiplyScalar(0.7 + 0.3 * Math.sin(time * 3))
    antennaLed.scale.setScalar(0.9 + 0.2 * Math.sin(time * 3))

    blinkClock += dt
    if (blinkClock > 0.55) {
      blinkClock = 0
      display.blink(!(Math.floor(time / 0.55) % 2))
    }

    const halfWidth = Math.tan(MathUtils.degToRad(FOV / 2)) * CAMERA_Z * camera.aspect
    const worldHeight = 2 * Math.tan(MathUtils.degToRad(FOV / 2)) * CAMERA_Z // visible height at the object's depth
    root.position.x = api.x * halfWidth * (1 - zoom)
    // zoom aims the face screen (head centre, 0.44 above the figure origin) at the screen centre
    root.position.y = MathUtils.lerp(api.y + Math.sin(time * 0.9) * 0.05, -0.44 * api.scale * (1 + zoom * 6), zoom) + api.lift * worldHeight
    const narrow = Math.min(1, camera.aspect / 1.4)
    root.scale.setScalar(api.scale * (0.85 + 0.15 * api.intro) * (0.75 + 0.25 * narrow) * (1 + zoom * 6))

    renderer.render(scene, camera)

    if (!drewFirstFrame) {
      drewFirstFrame = true
      onFirstFrame?.()
    }
  }

  function start() {
    if (running) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }
  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)

  let lost = null
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault()
    stop()
    lost?.()
  })

  return {
    api,
    start,
    stop,
    setLight() {
      /* the object is a physical product: same materials in both themes */
    },
    /**
     * @param {{ word: string, sub: string, color?: string } | null} next display content + accent, or null for the idle state
     */
    setDisplay(next) {
      if (!next) {
        display.set({ word: 'AN', sub: 'Ansh · ready', color: ACCENT })
        hueTarget.set(ACCENT)
        return
      }
      const color = next.color || ACCENT
      display.set({ word: next.word, sub: next.sub, color })
      hueTarget.set(color)
    },
    onFirstFrame(cb) {
      onFirstFrame = cb
    },
    onContextLost(cb) {
      lost = cb
    },
    dispose() {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      resizeObserver.disconnect()
      geos.forEach((g) => g.dispose())
      ;[shell, shellDim, dark, steel, accentMat, ledMat, thrusterMat, screenMat, shadowMat].forEach((m) => m.dispose())
      display.dispose()
      shadowTex.dispose()
      envTexture.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
      container.style.opacity = ''
    },
  }
}
