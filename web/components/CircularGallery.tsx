'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl'
import './CircularGallery.css'

/* ═════════════════════════════════════════════════════════════════
   TYPES
   ═════════════════════════════════════════════════════════════════ */
export interface GalleryItem {
  image: string
  text?: string
  name?: string
  slug?: string
}

export interface CircularGalleryRef {
  next: () => void
  prev: () => void
}

interface CircularGalleryProps {
  items?: GalleryItem[]
  bend?: number
  borderRadius?: number
  scrollSpeed?: number
  scrollEase?: number
  autoplay?: boolean
  autoplaySpeed?: number
  autoplayResumeDelay?: number
  onActiveIndexChange?: (index: number) => void
  onItemActivate?: (index: number) => void
  onHoverIndexChange?: (index: number | null) => void
}

/* ═════════════════════════════════════════════════════════════════
   UTILITAIRES
   ═════════════════════════════════════════════════════════════════ */
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/* ═════════════════════════════════════════════════════════════════
   CLASSE WEBGL — une carte de la galerie (même mécanisme que l'original)
   ═════════════════════════════════════════════════════════════════ */
class Media {
  extra = 0
  geometry: any
  gl: any
  image: string
  index: number
  length: number
  renderer: any
  scene: any
  screen: any
  viewport: any
  bend: number
  borderRadius: number
  program: any
  plane: any
  speed = 0
  isBefore = false
  isAfter = false
  width = 0
  widthTotal = 0
  x = 0
  scale = 1
  padding = 3

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    viewport,
    bend,
    borderRadius = 0,
  }: {
    geometry: any
    gl: any
    image: string
    index: number
    length: number
    renderer: any
    scene: any
    screen: any
    viewport: any
    bend: number
    borderRadius?: number
  }) {
    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.renderer = renderer
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.bend = bend
    this.borderRadius = borderRadius
    this.createShader()
    this.createMesh()
    this.onResize()
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true })
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          /* Rayon corrigé en espace physique (pas UV [0,1]) pour des
             coins circulaires même sur un plan rectangulaire. */
          vec2 halfSize = uPlaneSizes * 0.5;
          vec2 p = (vUv - 0.5) * uPlaneSizes;
          float d = roundedBoxSDF(p, halfSize - vec2(uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.02;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    })
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = this.image
    img.onload = () => {
      texture.image = img
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
    }
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
    this.plane.setParent(this.scene)
  }

  /* ── MÉCANISME DE BOUCLE INFINIE (identique à l'original) ── */
  update(scroll: { current: number; last: number }, direction: 'left' | 'right') {
    this.plane.position.x = this.x - scroll.current - this.extra
    const x = this.plane.position.x
    const H = this.viewport.width / 2

    if (this.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const B_abs = Math.abs(this.bend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)
      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset

    /* Repositionnement par "extra" : même logique que l'HTML original.
       On ne touche JAMAIS à scroll.current / target / last. */
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }

  onResize({ screen, viewport }: { screen?: any; viewport?: any } = {}) {
    if (screen) this.screen = screen
    if (viewport) {
      this.viewport = viewport
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
      }
    }
    this.scale = this.screen.height / 1500
    this.plane.scale.y = (this.viewport.height * (660 * this.scale)) / this.screen.height
    this.plane.scale.x = (this.viewport.width * (1100 * this.scale)) / this.screen.width
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.padding = 3
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

/* ═════════════════════════════════════════════════════════════════
   CLASSE WEBGL — l'application (scène, scroll, autoplay, hover)
   Même structure que App dans le HTML original.
   ═════════════════════════════════════════════════════════════════ */
class GalleryApp {
  container: HTMLElement
  scrollSpeed: number
  scroll: { ease: number; current: number; target: number; last: number; lastTarget: number }
  onCheckDebounce: () => void
  renderer: any
  gl: any
  camera: any
  scene: any
  planeGeometry: any
  mediasImages: GalleryItem[] = []
  medias: Media[] = []
  screen: any
  viewport: any
  isDown = false
  isHovering = false
  start = 0
  boundOnResize: any
  boundOnWheel: any
  boundOnTouchDown: any
  boundOnTouchMove: any
  boundOnTouchUp: any
  boundOnKeyDown: any
  boundOnClick: any
  boundOnPointerEnter: any
  boundOnPointerLeave: any
  boundOnPointerMove: any
  raf: number | null = null
  lastActiveIndex = -1
  lastHoverIndex: number | null = null
  onActiveIndexChange?: (index: number) => void
  onItemActivate?: (index: number) => void
  onHoverIndexChange?: (index: number | null) => void
  originalLength = 0
  autoplay: boolean
  autoplaySpeed: number
  autoplayResumeDelay: number
  lastInteraction = -Infinity
  lastFrameTime: number | null = null
  lastDirection: 'left' | 'right' = 'right'

  constructor(
    container: HTMLElement,
    {
      items,
      bend,
      borderRadius = 0,
      scrollSpeed = 2,
      scrollEase = 0.05,
      autoplay = true,
      autoplaySpeed = 0.15,
      autoplayResumeDelay = 2500,
      onActiveIndexChange,
      onItemActivate,
      onHoverIndexChange,
    }: {
      items: GalleryItem[]
      bend: number
      borderRadius?: number
      scrollSpeed?: number
      scrollEase?: number
      autoplay?: boolean
      autoplaySpeed?: number
      autoplayResumeDelay?: number
      onActiveIndexChange?: (index: number) => void
      onItemActivate?: (index: number) => void
      onHoverIndexChange?: (index: number | null) => void
    }
  ) {
    this.container = container
    this.scrollSpeed = scrollSpeed
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0, lastTarget: 0 }
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200)
    this.onActiveIndexChange = onActiveIndexChange
    this.onItemActivate = onItemActivate
    this.onHoverIndexChange = onHoverIndexChange
    this.autoplay = autoplay && !prefersReducedMotion()
    this.autoplaySpeed = autoplaySpeed
    this.autoplayResumeDelay = autoplayResumeDelay
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias(items, bend, borderRadius)
    this.update()
    this.addEventListeners()
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }

  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }

  createScene() {
    this.scene = new Transform()
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 })
  }

  /* ── Création des médias : duplication simple (esprit de l'original) ── */
  createMedias(items: GalleryItem[], bend = 1, borderRadius?: number) {
    const defaultItems: GalleryItem[] = [
      { image: 'https://picsum.photos/seed/1/800/600?grayscale', text: 'Bridge' },
      { image: 'https://picsum.photos/seed/2/800/600?grayscale', text: 'Desk Setup' },
      { image: 'https://picsum.photos/seed/3/800/600?grayscale', text: 'Waterfall' },
      { image: 'https://picsum.photos/seed/4/800/600?grayscale', text: 'Strawberries' },
      { image: 'https://picsum.photos/seed/5/800/600?grayscale', text: 'Deep Diving' },
      { image: 'https://picsum.photos/seed/16/800/600?grayscale', text: 'Train Track' },
      { image: 'https://picsum.photos/seed/17/800/600?grayscale', text: 'Santorini' },
      { image: 'https://picsum.photos/seed/8/800/600?grayscale', text: 'Blurry Lights' },
      { image: 'https://picsum.photos/seed/9/800/600?grayscale', text: 'New York' },
      { image: 'https://picsum.photos/seed/10/800/600?grayscale', text: 'Good Boy' },
      { image: 'https://picsum.photos/seed/21/800/600?grayscale', text: 'Coastline' },
      { image: 'https://picsum.photos/seed/12/800/600?grayscale', text: 'Palm Trees' },
    ]
    const galleryItems = items && items.length ? items : defaultItems
    this.originalLength = galleryItems.length

    // Même esprit que l'original (concat) mais on garantit assez de
    // copies pour ne jamais voir le "trou" entre la fin et le début.
    const MIN_TOTAL_ITEMS = 12
    const copies = Math.max(2, Math.ceil(MIN_TOTAL_ITEMS / Math.max(1, this.originalLength)))
    this.mediasImages = []
    for (let c = 0; c < copies; c++) {
      this.mediasImages.push(...galleryItems)
    }

    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
        bend,
        borderRadius,
      })
    })
  }

  registerInteraction() {
    this.lastInteraction = performance.now()
  }

  /** Retourne l'index (dans la liste originale) de la carte sous clientX, ou null. */
  hitTest(clientX: number): number | null {
    if (!this.medias || !this.medias[0]) return null
    const rect = this.gl.canvas.getBoundingClientRect()
    const screenX = clientX - rect.left
    const ndcX = (screenX / rect.width) * 2 - 1
    const worldX = ndcX * (this.viewport.width / 2)

    for (const media of this.medias) {
      const halfWidth = media.plane.scale.x / 2
      const posX = media.plane.position.x
      if (worldX >= posX - halfWidth && worldX <= posX + halfWidth) {
        return media.index % this.originalLength
      }
    }
    return null
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true
    this.registerInteraction()
    this.scroll.position = this.scroll.current
    this.start = 'touches' in e ? e.touches[0].clientX : e.clientX
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const distance = (this.start - x) * (this.scrollSpeed * 0.025)
    this.scroll.target = (this.scroll.position || 0) + distance
  }

  onTouchUp() {
    this.isDown = false
    this.registerInteraction()
    this.onCheck()
  }

  onWheel(e: WheelEvent) {
    const delta = e.deltaY || (e as any).wheelDelta || (e as any).detail
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2
    this.registerInteraction()
    this.onCheckDebounce()
  }

  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        this.scroll.target += this.scrollSpeed * 5
        this.registerInteraction()
        this.onCheckDebounce()
        break
      case 'ArrowLeft':
        e.preventDefault()
        this.scroll.target -= this.scrollSpeed * 5
        this.registerInteraction()
        this.onCheckDebounce()
        break
      case 'Home':
        e.preventDefault()
        this.scroll.target = 0
        this.registerInteraction()
        this.onCheckDebounce()
        break
    }
  }

  onClick(e: MouseEvent) {
    const index = this.hitTest(e.clientX)
    if (index !== null) {
      this.onItemActivate?.(index)
      this.registerInteraction()
      this.goToIndex(index)
    }
  }

  /* ── HOVER : déclenchement immédiat dès l'entrée dans le canvas ── */
  onPointerEnter(e: MouseEvent) {
    this.isHovering = true
    this.onPointerMove(e)
  }

  onPointerLeave() {
    this.isHovering = false
    if (this.lastHoverIndex !== null) {
      this.lastHoverIndex = null
      this.onHoverIndexChange?.(null)
    }
  }

  onPointerMove(e: MouseEvent) {
    const index = this.hitTest(e.clientX)
    if (index !== this.lastHoverIndex) {
      this.lastHoverIndex = index
      this.onHoverIndexChange?.(index)
    }
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return
    const width = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }

  goToIndex(index: number) {
    if (!this.medias || !this.medias[0]) return
    const width = this.medias[0].width
    const total = this.medias[0].widthTotal
    const current = this.scroll.target
    const target = index * width
    const k = Math.round((current - target) / total)
    this.scroll.target = target + k * total
  }

  next() {
    if (!this.medias || !this.medias[0]) return
    this.registerInteraction()
    const width = this.medias[0].width
    this.scroll.target += width
    this.onCheck()
  }

  prev() {
    if (!this.medias || !this.medias[0]) return
    this.registerInteraction()
    const width = this.medias[0].width
    this.scroll.target -= width
    this.onCheck()
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({ aspect: this.screen.width / this.screen.height })
    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { width, height }
    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }))
    }
  }

  /* ── UPDATE : même squelette que l'original, direction fiable pour autoplay ── */
  update() {
    const now = performance.now()
    const dt = this.lastFrameTime !== null ? Math.min((now - this.lastFrameTime) / 1000, 0.05) : 0
    this.lastFrameTime = now

    // Autoplay : incrémente target (pas current) — le lerp fait le reste
    if (
      this.autoplay &&
      !this.isDown &&
      !this.isHovering &&
      this.medias &&
      this.medias[0] &&
      now - this.lastInteraction > this.autoplayResumeDelay
    ) {
      this.scroll.target += this.medias[0].width * this.autoplaySpeed * dt
    }

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)

    /* Direction : on se base sur la vélocité de target (l'intention)
       plutôt que sur current vs last (qui peut être nul quand le lerp
       s'arrête). Si la vélocité est nulle, on garde la dernière direction
       connue pour ne jamais bloquer le repositionnement infinis. */
    const targetVel = this.scroll.target - this.scroll.lastTarget
    let direction: 'left' | 'right'
    if (targetVel > 0.0001) direction = 'right'
    else if (targetVel < -0.0001) direction = 'left'
    else direction = this.lastDirection
    this.lastDirection = direction
    this.scroll.lastTarget = this.scroll.target

    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction))

      // Index actif = carte la plus proche du centre
      let activeIndex = 0
      let minDist = Infinity
      this.medias.forEach((media) => {
        const dist = Math.abs(media.plane.position.x)
        if (dist < minDist) {
          minDist = dist
          activeIndex = media.index % this.originalLength
        }
      })
      if (activeIndex !== this.lastActiveIndex) {
        this.lastActiveIndex = activeIndex
        this.onActiveIndexChange?.(activeIndex)
      }
    }

    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = window.requestAnimationFrame(this.update.bind(this))
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this)
    this.boundOnWheel = this.onWheel.bind(this)
    this.boundOnTouchDown = this.onTouchDown.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchUp = this.onTouchUp.bind(this)
    this.boundOnKeyDown = this.onKeyDown.bind(this)
    this.boundOnClick = this.onClick.bind(this)
    this.boundOnPointerEnter = this.onPointerEnter.bind(this)
    this.boundOnPointerLeave = this.onPointerLeave.bind(this)
    this.boundOnPointerMove = this.onPointerMove.bind(this)

    window.addEventListener('resize', this.boundOnResize)
    window.addEventListener('mousewheel', this.boundOnWheel)
    window.addEventListener('wheel', this.boundOnWheel)
    window.addEventListener('mousedown', this.boundOnTouchDown)
    window.addEventListener('mousemove', this.boundOnTouchMove)
    window.addEventListener('mouseup', this.boundOnTouchUp)
    window.addEventListener('touchstart', this.boundOnTouchDown)
    window.addEventListener('touchmove', this.boundOnTouchMove)
    window.addEventListener('touchend', this.boundOnTouchUp)
    this.container?.addEventListener('keydown', this.boundOnKeyDown)
    this.gl.canvas.addEventListener('click', this.boundOnClick)
    this.gl.canvas.addEventListener('mouseenter', this.boundOnPointerEnter)
    this.gl.canvas.addEventListener('mouseleave', this.boundOnPointerLeave)
    this.gl.canvas.addEventListener('mousemove', this.boundOnPointerMove)
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.boundOnResize)
    window.removeEventListener('mousewheel', this.boundOnWheel)
    window.removeEventListener('wheel', this.boundOnWheel)
    window.removeEventListener('mousedown', this.boundOnTouchDown)
    window.removeEventListener('mousemove', this.boundOnTouchMove)
    window.removeEventListener('mouseup', this.boundOnTouchUp)
    window.removeEventListener('touchstart', this.boundOnTouchDown)
    window.removeEventListener('touchmove', this.boundOnTouchMove)
    window.removeEventListener('touchend', this.boundOnTouchUp)
    this.container?.removeEventListener('keydown', this.boundOnKeyDown)
    if (this.gl?.canvas) {
      this.gl.canvas.removeEventListener('click', this.boundOnClick)
      this.gl.canvas.removeEventListener('mouseenter', this.boundOnPointerEnter)
      this.gl.canvas.removeEventListener('mouseleave', this.boundOnPointerLeave)
      this.gl.canvas.removeEventListener('mousemove', this.boundOnPointerMove)
      if (this.gl.canvas.parentNode) {
        this.gl.canvas.parentNode.removeChild(this.gl.canvas)
      }
    }
    this.renderer = null
    this.gl = null
  }
}

/* ═════════════════════════════════════════════════════════════════
   COMPOSANT REACT
   ═════════════════════════════════════════════════════════════════ */
const CircularGallery = forwardRef<CircularGalleryRef, CircularGalleryProps>(
  function CircularGallery(
    {
      items = [],
      bend = 3,
      borderRadius = 0.4,
      scrollSpeed = 2,
      scrollEase = 0.05,
      autoplay = true,
      autoplaySpeed = 0.15,
      autoplayResumeDelay = 2500,
      onActiveIndexChange,
      onItemActivate,
      onHoverIndexChange,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const appRef = useRef<GalleryApp | null>(null)

    useEffect(() => {
      if (!containerRef.current) return
      let app: GalleryApp | null = null

      const init = () => {
        app = new GalleryApp(containerRef.current!, {
          items,
          bend,
          borderRadius,
          scrollSpeed,
          scrollEase,
          autoplay,
          autoplaySpeed,
          autoplayResumeDelay,
          onActiveIndexChange,
          onItemActivate,
          onHoverIndexChange,
        })
        appRef.current = app
      }

      const timer = setTimeout(init, 50)

      return () => {
        clearTimeout(timer)
        app?.destroy()
        appRef.current = null
      }
    }, [
      items,
      bend,
      borderRadius,
      scrollSpeed,
      scrollEase,
      autoplay,
      autoplaySpeed,
      autoplayResumeDelay,
      onActiveIndexChange,
      onItemActivate,
      onHoverIndexChange,
    ])

    useImperativeHandle(
      ref,
      () => ({
        next: () => appRef.current?.next(),
        prev: () => appRef.current?.prev(),
      }),
      []
    )

    return (
      <div
        ref={containerRef}
        className="circular-gallery-3d"
        tabIndex={0}
        role="region"
        aria-label="Galerie circulaire — défile automatiquement. Survolez pour mettre en pause, glissez, utilisez la molette ou les flèches gauche/droite pour naviguer. Cliquez sur une image pour la sélectionner."
      />
    )
  }
)

export default CircularGallery