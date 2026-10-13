// web/lib/scale3d.ts
// ═══════════════════════════════════════════════════════════════════
//  Balance 3D (three.js) — chargée à la demande par PriceSimulator.
//
//  Une balance de cuisine procédurale (aucun modèle à télécharger) :
//   • socle ivoire avec cadran gravé sur le devant (graduations 1 → 3 kg),
//   • aiguille + arc de progression qui suivent le poids,
//   • plateau laiton qui s'enfonce sous la charge,
//   • un lapin tiré au hasard dans les images du site, posé sur le plateau.
//     Il est tracé en « volume » (plusieurs couches décalées) et grossit avec
//     le poids : la taille suit la racine cubique du poids (volume ∝ poids).
//
//  Interactions : la caméra suit doucement le curseur / le doigt, le lapin se
//  balance au repos, ressorts avec léger rebond (désactivés si
//  prefers-reduced-motion). Rendu en pause hors écran / onglet masqué.
// ═══════════════════════════════════════════════════════════════════

import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export type ScaleSceneOptions = {
  canvas: HTMLCanvasElement
  /** Pool d'images de lapins (URLs, fond transparent) */
  rabbitUrls: string[]
  minKg: number
  maxKg: number
  initialKg: number
  reducedMotion: boolean
  /** Valeur CSS font-family pour les chiffres du cadran */
  fontFamily?: string
  onContextLost?: () => void
}

export type ScaleScene = {
  setWeight(kg: number): void
  setDragging(on: boolean): void
  setVisible(on: boolean): void
  /** Remplace le lapin par un autre tiré au hasard */
  swapRabbit(): void
  dispose(): void
}

// ─── Constantes de la scène (unités arbitraires : le plateau mesure ~2,1) ───
const COLOR_INK = 0x3a2f22
const COLOR_PAPER = 0xf3e9da
const SWEEP_DEG = 100 // le cadran couvre ±100° autour de l'avant
const DECAL_R = 1.61 // rayon du décalque du cadran
const TRACK_R = 1.375 // rayon de l'arc de progression
const BASE_TOP = 0.34 // hauteur de la face supérieure du socle
const TRAY_REST_Y = 0.3 // hauteur du plateau au repos (pied du plateau)
const TRAY_DISH_Y = 0.085 // fond de la cuvette, relatif au plateau
const MAX_DEPTH = 0.055 // enfoncement max du plateau à poids max
const RABBIT_HEIGHT = 1.25 // hauteur d'un lapin de 1 kg (le plateau mesure ~2,1 de large)
const RABBIT_LAYERS = 8
const RABBIT_LAYER_GAP = 0.026

const deg = Math.PI / 180
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

// ─── Ressort amorti ───────────────────────────────────────────────────────────
type Spring = { x: number; v: number }
function stepSpring(s: Spring, target: number, k: number, c: number, dt: number) {
  s.v += (k * (target - s.x) - c * s.v) * dt
  s.x += s.v * dt
}

// ─── Textures générées en canvas ─────────────────────────────────────────────
function radialTexture(stops: Array<[number, string]>, size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([o, col]) => grad.addColorStop(o, col))
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Décalque du cadran, vu du dessus : graduations + chiffres, sur fond transparent. */
function drawDialTexture(minKg: number, maxKg: number, fontFamily: string): HTMLCanvasElement {
  const size = 1024
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const cx = size / 2
  const cy = size / 2
  const px = size / 2 / DECAL_R // pixels par unité du monde
  // θ = 0 vers l'avant (bas du canvas), θ > 0 vers la droite
  const at = (r: number, th: number): [number, number] => [cx + r * px * Math.sin(th), cy + r * px * Math.cos(th)]
  const thetaOf = (ratio: number) => (-SWEEP_DEG + ratio * SWEEP_DEG * 2) * deg

  // piste de l'arc
  g.lineCap = 'round'
  g.strokeStyle = 'rgba(58,47,34,0.13)'
  g.lineWidth = 0.05 * px
  g.beginPath()
  for (let i = 0; i <= 120; i++) {
    const [x, y] = at(TRACK_R, thetaOf(i / 120))
    if (i === 0) g.moveTo(x, y)
    else g.lineTo(x, y)
  }
  g.stroke()

  // graduations : 1 par 0,1 kg, plus longues tous les 0,5 kg
  const steps = Math.round((maxKg - minKg) / 0.1)
  g.strokeStyle = 'rgba(58,47,34,0.55)'
  for (let i = 0; i <= steps; i++) {
    const kg = Math.round((minKg + i * 0.1) * 10) / 10
    const major = Math.abs(kg * 2 - Math.round(kg * 2)) < 1e-9
    const th = thetaOf(i / steps)
    const [x1, y1] = at(major ? 1.43 : 1.5, th)
    const [x2, y2] = at(1.57, th)
    g.lineWidth = (major ? 0.028 : 0.016) * px
    g.beginPath()
    g.moveTo(x1, y1)
    g.lineTo(x2, y2)
    g.stroke()
  }

  // chiffres (droits pour le spectateur)
  g.fillStyle = '#3a2f22'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `700 ${0.175 * px}px ${fontFamily}`
  for (let kg = Math.ceil(minKg * 2) / 2; kg <= maxKg + 1e-9; kg += 0.5) {
    const ratio = (kg - minKg) / (maxKg - minKg)
    const [x, y] = at(1.285, thetaOf(ratio))
    g.fillText(String(kg).replace('.', ','), x, y)
  }

  // liseré autour de la cuvette
  g.strokeStyle = 'rgba(58,47,34,0.16)'
  g.lineWidth = 0.012 * px
  g.beginPath()
  g.arc(cx, cy, 1.165 * px, 0, Math.PI * 2)
  g.stroke()
  return c
}

// ─── Lapin : chargement + cadrage ────────────────────────────────────────────
type RabbitSprite = {
  texture: THREE.Texture
  aspect: number
  /** Zone opaque de l'image, en fraction (origine en haut à gauche) */
  bounds: { x0: number; y0: number; x1: number; y1: number }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    const timer = window.setTimeout(() => reject(new Error('timeout')), 8000)
    img.onload = () => {
      window.clearTimeout(timer)
      resolve(img)
    }
    img.onerror = () => {
      window.clearTimeout(timer)
      reject(new Error('load'))
    }
    img.src = url
  })
}

function opaqueBounds(img: HTMLImageElement) {
  const W = 160
  const H = Math.max(1, Math.round((W * img.naturalHeight) / img.naturalWidth))
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d', { willReadFrequently: true })!
  g.drawImage(img, 0, 0, W, H)
  try {
    const data = g.getImageData(0, 0, W, H).data
    let x0 = W, y0 = H, x1 = -1, y1 = -1
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (data[(y * W + x) * 4 + 3] > 24) {
          if (x < x0) x0 = x
          if (x > x1) x1 = x
          if (y < y0) y0 = y
          if (y > y1) y1 = y
        }
      }
    }
    if (x1 < 0) throw new Error('empty')
    return { x0: x0 / W, y0: y0 / H, x1: (x1 + 1) / W, y1: (y1 + 1) / H }
  } catch {
    return { x0: 0.06, y0: 0.04, x1: 0.94, y1: 0.96 }
  }
}

async function loadRabbitSprite(url: string, maxAnisotropy: number): Promise<RabbitSprite> {
  const img = await loadImage(url)
  const texture = new THREE.Texture(img)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = maxAnisotropy
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.needsUpdate = true
  return { texture, aspect: img.naturalWidth / img.naturalHeight, bounds: opaqueBounds(img) }
}

// ─── Shader de l'arc de progression ─────────────────────────────────────────
const ARC_VERTEX = /* glsl */ `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const ARC_FRAGMENT = /* glsl */ `
  uniform float uStart;
  uniform float uLen;
  uniform float uTotal;
  uniform vec3 uColA;
  uniform vec3 uColB;
  varying vec2 vPos;
  void main() {
    // angle depuis l'avant, positif vers la droite (le plan XY est couché sur XZ)
    float th = atan(vPos.x, -vPos.y);
    float d = th - uStart;
    if (d < 0.0 || d > uLen) discard;
    gl_FragColor = vec4(mix(uColA, uColB, d / uTotal), 1.0);
    #include <colorspace_fragment>
  }
`

// ─── Création de la scène ────────────────────────────────────────────────────
export async function createScaleScene(opts: ScaleSceneOptions): Promise<ScaleScene> {
  const { canvas, rabbitUrls, minKg, maxKg, reducedMotion } = opts
  const host = canvas.parentElement as HTMLElement

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)
  const maxDpr = window.matchMedia('(max-width: 640px)').matches ? 1.75 : 2
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr))

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envMap
  scene.environmentIntensity = 0.85

  const key = new THREE.DirectionalLight(0xffe3bd, 2.1)
  key.position.set(-3.5, 6, 5)
  scene.add(key)

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
  const CAM_TARGET = new THREE.Vector3(0, 0.42, 0)
  const CAM_DIST = 7.5
  const CAM_ELEVATION = 27 * deg

  const disposables: Array<{ dispose(): void }> = [renderer, pmrem, envMap]
  const track = <T extends { dispose(): void }>(d: T): T => {
    disposables.push(d)
    return d
  }

  // ── Ombre au sol ──
  const floorShadow = new THREE.Mesh(
    track(new THREE.CircleGeometry(2.5, 64)),
    track(
      new THREE.MeshBasicMaterial({
        map: track(radialTexture([[0, 'rgba(10,6,2,0.62)'], [0.55, 'rgba(10,6,2,0.28)'], [1, 'rgba(10,6,2,0)']])),
        transparent: true,
        depthWrite: false,
      })
    )
  )
  floorShadow.rotation.x = -Math.PI / 2
  floorShadow.position.y = -0.045
  scene.add(floorShadow)

  // ── Socle ──
  const baseProfile = [
    [0, 0], [1.46, 0], [1.6, 0.05], [1.66, 0.14], [1.66, 0.27], [1.62, BASE_TOP],
    [1.14, BASE_TOP], [1.11, 0.32], [1.1, 0.28], [0, 0.28],
  ].map(([r, y]) => new THREE.Vector2(r, y))
  const baseMat = track(new THREE.MeshStandardMaterial({ color: COLOR_PAPER, roughness: 0.5, metalness: 0 }))
  const base = new THREE.Mesh(track(new THREE.LatheGeometry(baseProfile, 96)), baseMat)
  scene.add(base)

  const footProfile = [[0, 0], [1.4, 0], [1.45, 0.02], [1.45, 0.05], [0, 0.05]].map(([r, y]) => new THREE.Vector2(r, y))
  const foot = new THREE.Mesh(
    track(new THREE.LatheGeometry(footProfile, 64)),
    track(new THREE.MeshStandardMaterial({ color: 0x241b12, roughness: 0.7 }))
  )
  foot.position.y = -0.045
  scene.add(foot)

  // ── Cadran (décalque) ──
  const fontFamily = opts.fontFamily || 'ui-monospace, Menlo, monospace'
  try {
    await Promise.race([document.fonts.ready, new Promise((r) => window.setTimeout(r, 900))])
  } catch {
    /* polices indisponibles : repli monospace */
  }
  const dialTexture = track(new THREE.CanvasTexture(drawDialTexture(minKg, maxKg, fontFamily)))
  dialTexture.colorSpace = THREE.SRGBColorSpace
  dialTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  const dial = new THREE.Mesh(
    track(new THREE.CircleGeometry(DECAL_R, 128)),
    track(new THREE.MeshBasicMaterial({ map: dialTexture, transparent: true, depthWrite: false }))
  )
  dial.rotation.x = -Math.PI / 2
  dial.position.y = BASE_TOP + 0.002
  scene.add(dial)

  // ── Arc de progression ──
  const sweepTotal = SWEEP_DEG * 2 * deg
  const arcUniforms = {
    uStart: { value: -SWEEP_DEG * deg },
    uLen: { value: 0 },
    uTotal: { value: sweepTotal },
    uColA: { value: new THREE.Color(0xe0ae6c) },
    uColB: { value: new THREE.Color(0xc2723d) },
  }
  const arc = new THREE.Mesh(
    track(new THREE.RingGeometry(TRACK_R - 0.026, TRACK_R + 0.026, 192, 1)),
    track(new THREE.ShaderMaterial({ vertexShader: ARC_VERTEX, fragmentShader: ARC_FRAGMENT, uniforms: arcUniforms }))
  )
  arc.rotation.x = -Math.PI / 2
  arc.position.y = BASE_TOP + 0.005
  scene.add(arc)

  // ── Bouton-aiguille sur l'arc ──
  const knob = new THREE.Group()
  const knobBody = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.115, 0.115, 0.075, 40)),
    track(new THREE.MeshStandardMaterial({ color: COLOR_INK, roughness: 0.4, metalness: 0.1 }))
  )
  const knobRing = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.108, 0.014, 12, 40)),
    track(new THREE.MeshStandardMaterial({ color: 0xfbf6ec, roughness: 0.5 }))
  )
  knobRing.rotation.x = Math.PI / 2
  knobRing.position.y = 0.037
  const knobDot = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.042, 0.042, 0.082, 24)),
    track(new THREE.MeshStandardMaterial({ color: 0xc2723d, roughness: 0.35 }))
  )
  knob.add(knobBody, knobRing, knobDot)
  scene.add(knob)

  // ── Plateau ──
  const tray = new THREE.Group()
  const trayProfile = [[0, 0], [1.0, 0], [1.05, 0.02], [1.07, 0.06], [1.05, 0.1], [0.98, 0.11], [0.9, 0.088], [0, 0.085]].map(
    ([r, y]) => new THREE.Vector2(r, y)
  )
  const trayMesh = new THREE.Mesh(
    track(new THREE.LatheGeometry(trayProfile, 96)),
    track(new THREE.MeshStandardMaterial({ color: 0xd9b27a, roughness: 0.32, metalness: 0.55 }))
  )
  tray.add(trayMesh)
  const contactShadow = new THREE.Mesh(
    track(new THREE.CircleGeometry(1, 48)), // rayon réel = échelle du lapin × contactRadius
    track(
      new THREE.MeshBasicMaterial({
        map: track(radialTexture([[0, 'rgba(30,18,6,0.5)'], [0.6, 'rgba(30,18,6,0.22)'], [1, 'rgba(30,18,6,0)']])),
        transparent: true,
        depthWrite: false,
      })
    )
  )
  contactShadow.rotation.x = -Math.PI / 2
  contactShadow.position.y = TRAY_DISH_Y + 0.002
  tray.add(contactShadow)
  tray.position.y = TRAY_REST_Y
  scene.add(tray)

  // ── Lapin en volume (couches décalées) ──
  const rabbitRoot = new THREE.Group()
  const layerGeo = track(new THREE.PlaneGeometry(1, 1))
  const layers: THREE.Mesh[] = []
  const layerMats: THREE.MeshBasicMaterial[] = []
  for (let i = 0; i < RABBIT_LAYERS; i++) {
    // Couche avant : fondu doux sur les bords. Couches arrière (épaisseur) : découpe nette, plus sombres.
    const mat = track(
      new THREE.MeshBasicMaterial({
        color: new THREE.Color().setScalar(i === 0 ? 1 : 0.8 - i * 0.075),
        alphaTest: i === 0 ? 0.04 : 0.5,
        transparent: i === 0,
        side: THREE.DoubleSide,
      })
    )
    const mesh = new THREE.Mesh(layerGeo, mat)
    mesh.position.z = -i * RABBIT_LAYER_GAP
    rabbitRoot.add(mesh)
    layers.push(mesh)
    layerMats.push(mat)
  }
  rabbitRoot.visible = false
  scene.add(rabbitRoot)

  let currentSprite: RabbitSprite | null = null
  let lastRabbitIndex = -1
  const maxAniso = renderer.capabilities.getMaxAnisotropy()

  function pickIndex(): number {
    if (rabbitUrls.length < 2) return 0
    let i = Math.floor(Math.random() * rabbitUrls.length)
    if (i === lastRabbitIndex) i = (i + 1 + Math.floor(Math.random() * (rabbitUrls.length - 1))) % rabbitUrls.length
    return i
  }

  /** Charge un lapin au hasard (3 essais) ; renvoie null si aucune image ne se charge. */
  async function loadRandomRabbit(): Promise<{ sprite: RabbitSprite; index: number } | null> {
    for (let attempt = 0; attempt < 3; attempt++) {
      const index = pickIndex()
      try {
        const sprite = await loadRabbitSprite(rabbitUrls[index], maxAniso)
        return { sprite, index }
      } catch {
        lastRabbitIndex = index
      }
    }
    return null
  }

  let contactRadius = 0.7
  function applyRabbit(sprite: RabbitSprite, index: number) {
    const b = sprite.bounds
    const planeH = RABBIT_HEIGHT / (b.y1 - b.y0) // hauteur du lapin = RABBIT_HEIGHT
    const planeW = planeH * sprite.aspect
    const offsetX = -((b.x0 + b.x1) / 2 - 0.5) * planeW
    const offsetY = planeH * (b.y1 - 0.5) // le bas du lapin touche le plateau
    layers.forEach((mesh, i) => {
      mesh.scale.set(planeW, planeH, 1)
      mesh.position.x = offsetX
      mesh.position.y = offsetY
      mesh.position.z = -i * RABBIT_LAYER_GAP
      layerMats[i].map = sprite.texture
      layerMats[i].needsUpdate = true
    })
    contactRadius = clamp(0.5 * (b.x1 - b.x0) * planeW * 1.15, 0.5, 0.95)
    if (currentSprite) currentSprite.texture.dispose()
    currentSprite = sprite
    lastRabbitIndex = index
    rabbitRoot.visible = true
  }

  const first = await loadRandomRabbit()
  if (!first) {
    disposables.forEach((d) => d.dispose())
    throw new Error('Aucune image de lapin disponible')
  }
  applyRabbit(first.sprite, first.index)

  // ── État animé ──
  const ratioOf = (kg: number) => clamp((kg - minKg) / (maxKg - minKg), 0, 1)
  const sizeOf = (kg: number) => Math.cbrt(kg / minKg) // volume ∝ poids → taille ∝ racine cubique
  let weight = clamp(opts.initialKg, minKg, maxKg)
  let dragging = false
  let visible = true
  // Changement de lapin : 'out' (il rétrécit) → 'loading' (nouvelle image) → 'idle' (il réapparaît)
  let swapPhase: 'idle' | 'out' | 'loading' = 'idle'

  const sScale: Spring = { x: 0, v: 0 } // pop-in au départ
  const sDepth: Spring = { x: ratioOf(weight) * MAX_DEPTH, v: 0 }
  const sNeedle: Spring = { x: ratioOf(weight), v: 0 }
  const sYaw: Spring = { x: 0, v: 0 }
  const sPitch: Spring = { x: 0, v: 0 }
  let pointerYaw = 0
  let pointerPitch = 0
  let pointerInside = false

  function onPointerMove(e: PointerEvent) {
    const r = host.getBoundingClientRect()
    const nx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1)
    const ny = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1)
    pointerYaw = nx * 0.5
    pointerPitch = -ny * 0.09
    pointerInside = true
  }
  function onPointerLeave() {
    pointerInside = false
    pointerYaw = 0
    pointerPitch = 0
  }
  function onClick() {
    api.swapRabbit()
  }
  host.addEventListener('pointermove', onPointerMove)
  host.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('click', onClick)

  function onContextLost(e: Event) {
    e.preventDefault()
    opts.onContextLost?.()
  }
  canvas.addEventListener('webglcontextlost', onContextLost)

  // ── Redimensionnement ──
  function resize() {
    const w = Math.max(1, host.clientWidth)
    const h = Math.max(1, host.clientHeight)
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  resize()

  // ── Boucle de rendu ──
  let raf = 0
  let last = performance.now()
  const clock0 = last

  function frame(now: number) {
    raf = requestAnimationFrame(frame)
    const frameDt = Math.min(0.25, (now - last) / 1000) // temps réel, même si l'appareil rend peu d'images/s
    last = now
    const t = (now - clock0) / 1000

    // réglages des ressorts : rebond léger au repos, suivi sans rebond pendant le glissement
    const k = dragging ? 260 : 130
    const c = dragging ? 34 : 11.5

    const swapping = swapPhase !== 'idle'
    const targetScale = swapping ? 0 : sizeOf(weight)
    if (reducedMotion) {
      sScale.x = targetScale
      sDepth.x = ratioOf(weight) * MAX_DEPTH
      sNeedle.x = ratioOf(weight)
      sYaw.x = 0
      sPitch.x = 0
    } else {
      // sous-pas fixes (≤ 1/90 s) : ressorts stables et à la bonne vitesse quel que soit le framerate
      const subSteps = Math.max(1, Math.ceil(frameDt * 90))
      const h = frameDt / subSteps
      const idleYaw = pointerInside ? pointerYaw : Math.sin(t * 0.55) * 0.2
      for (let i = 0; i < subSteps; i++) {
        stepSpring(sScale, targetScale, swapping ? 420 : k, swapping ? 40 : c, h)
        stepSpring(sDepth, ratioOf(weight) * MAX_DEPTH, k, c, h)
        stepSpring(sNeedle, ratioOf(weight), dragging ? 260 : 110, dragging ? 34 : 10, h)
        stepSpring(sYaw, idleYaw, 38, 9, h)
        stepSpring(sPitch, pointerPitch, 38, 9, h)
      }
    }

    // échange de lapin : une fois réduit à presque rien, on change l'image
    if (swapPhase === 'out' && sScale.x < 0.05) {
      swapPhase = 'loading'
      loadRandomRabbit().then((res) => {
        if (res) applyRabbit(res.sprite, res.index)
        swapPhase = 'idle' // le ressort fait réapparaître le lapin (nouveau, ou l'ancien si le chargement a échoué)
      })
    }

    // plateau qui s'enfonce
    tray.position.y = TRAY_REST_Y - sDepth.x

    // lapin : taille = racine cubique du poids ; respiration + léger écrasement
    const s = Math.max(0, sScale.x)
    const squash = reducedMotion ? 0 : clamp(sScale.v * 0.035, -0.12, 0.12)
    const breathe = reducedMotion ? 0 : Math.sin(t * 2.2) * 0.011
    rabbitRoot.scale.set(s * (1 - squash * 0.5), s * (1 + squash + breathe), s * (1 - squash * 0.5))
    rabbitRoot.position.y = tray.position.y + TRAY_DISH_Y
    rabbitRoot.rotation.y = sYaw.x * 0.9
    contactShadow.scale.setScalar(Math.max(0.0001, s * contactRadius))

    // aiguille + arc
    const ratio = clamp(sNeedle.x, -0.04, 1.04)
    const theta = (-SWEEP_DEG + ratio * SWEEP_DEG * 2) * deg
    knob.position.set(TRACK_R * Math.sin(theta), BASE_TOP + 0.043, TRACK_R * Math.cos(theta))
    arcUniforms.uLen.value = clamp(ratio, 0, 1) * sweepTotal

    // caméra en orbite douce autour du socle
    const az = sYaw.x * 0.55
    const el = CAM_ELEVATION + sPitch.x
    camera.position.set(
      CAM_TARGET.x + CAM_DIST * Math.cos(el) * Math.sin(az),
      CAM_TARGET.y + CAM_DIST * Math.sin(el),
      CAM_TARGET.z + CAM_DIST * Math.cos(el) * Math.cos(az)
    )
    camera.lookAt(CAM_TARGET)

    renderer.render(scene, camera)
  }

  function start() {
    if (raf || document.hidden) return
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }
  function onVisibilityChange() {
    if (document.hidden) stop()
    else if (visible) start()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)
  start()

  const api: ScaleScene = {
    setWeight(kg) {
      weight = clamp(kg, minKg, maxKg)
    },
    setDragging(on) {
      dragging = on
    },
    setVisible(on) {
      visible = on
      if (on) start()
      else stop()
    },
    swapRabbit() {
      if (swapPhase !== 'idle') return
      swapPhase = 'out'
    },
    dispose() {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      resizeObserver.disconnect()
      if (currentSprite) currentSprite.texture.dispose()
      disposables.forEach((d) => d.dispose())
      renderer.forceContextLoss()
    },
  }
  return api
}
