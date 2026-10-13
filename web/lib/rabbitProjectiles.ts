// web/lib/rabbitProjectiles.ts
// ═══════════════════════════════════════════════════════════════════
//  Lapins-projectiles — au survol (souris) ou au toucher (doigt) d'une
//  carte, N lapins tirés au hasard dans le pool sont lancés depuis le
//  point de contact, décrivent un arc et s'évanouissent.
//
//  N dépend de la carte : 1 (à l'unité), 2 (duo), 6 (lot restaurateur).
//  Mêmes images que l'effet de titre (dossier Cloudinary
//  « CURSEUR TEXTE TITRE PROJECTIL »), sans les 3 visuels qui ne sont pas
//  des lapins (pièce « $ », main « rock », lapin sur fond noir).
//
//  Technique : <img> en position fixe + Web Animations API
//  (transform / opacity uniquement), nettoyés à la fin de l'animation.
//  Aucune animation si prefers-reduced-motion.
// ═══════════════════════════════════════════════════════════════════

import { cld } from './cloudinary'

const FOLDER = '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/'

const RABBIT_PROJECTILE_FILES = [
  'BB.webp',
  'ChatGPT Image 29 juil. 2026, 15_07_14DDD.webp',
  'ChatGPT Image 29 juil. 2026, 15_17_17hh.webp',
  'ChatGPT Image 29 juil. 2026, 15_17_24bb.webp',
  'ChatGPT Image 29 juil. 2026, 15_19_56.webp',
  'ChatGPT Image 29 juil. 2026, 15_20_16.webp',
  'ChatGPT Image 29 juil. 2026, 15_20_26.webp',
  'ChatGPT Image 29 juil. 2026, 15_43_11.webp',
  'ChatGPT Image 29 juil. 2026, 15_45_34.webp',
  'ChatGPT Image 29 juil. 2026, 15_46_57.webp',
  'ChatGPT Image 29 juil. 2026, 15_50_53.webp',
  'ChatGPT Image 29 juil. 2026, 15_53_20.webp',
  'ChatGPT Image 29 juil. 2026, 16_06_25.webp',
  'ChatGPT Image 29 juil. 2026, 16_08_38.webp',
  'ChatGPT Image 29 juil. 2026, 16_10_07.webp',
  'ChatGPT Image 29 juil. 2026, 16_13_22.webp',
  'ChatGPT Image 29 juil. 2026, 16_19_32.webp',
  'ChatGPT Image 29 juil. 2026, 16_19_32ddddddd.webp',
  'ChatGPT Image 29 juil. 2026, 16_19_32gggg.webp',
  'ChatGPT Image 29 juil. 2026, 16_19_32ssss.webp',
  'ChatGPT Image 29 juil. 2026, 16_19_32xxxx.webp',
  'ChatGPT Image 29 juil. 2026, 16_21_05ddd.webp',
  'ChatGPT Image 29 juil. 2026, 16_21_05ssss.webp',
  'ChatGPT Image 29 juil. 2026, 16_21_05xx.webp',
  'ChatGPT Image 29 juil. 2026, 16_21_05zzzz.webp',
  'ChatGPT Image 29 juil. 2026, 16_23_18cccc.webp',
  'ChatGPT Image 29 juil. 2026, 16_23_18xx.webp',
  'ChatGPT Image 29 juil. 2026, 16_34_26nnnnnn.webp',
  'ChatGPT Image 29 juil. 2026, 16_34_26zzz.webp',
  'ChatGPT Image 29 juil. 2026, 16_37_54.webp',
  'ChatGPT Image 29 juil. 2026, 16_37_54ooo.webp',
  'ChatGPT Image 29 juil. 2026, 16_37_54v.webp',
  'ChatGPT Image 29 juil. 2026, 16_39_32aaaaa.webp',
  'ChatGPT Image 29 juil. 2026, 16_39_32bbbbll.webp',
  'ChatGPT Image 29 juil. 2026, 16_39_32qq.webp',
  'ChatGPT Image 29 juil. 2026, 16_40_47ccc.webp',
  'ChatGPT Image 29 juil. 2026, 16_40_47ddd.webp',
  'ChatGPT Image 29 juil. 2026, 16_40_47hhhhh.webp',
  'ChatGPT Image 29 juil. 2026, 16_40_47qqq.webp',
  'ChatGPT Image 29 juil. 2026, 16_40_47sssss.webp',
  'ChatGPT Image 29 juil. 2026, 16_40_47vvvvv.webp',
  'ChatGPT Image 29 juil. 2026, 17_46_47.webp',
  'ChatGPT Image 29 juil. 2026, 17_46_47bbbbb.webp',
  'ChatGPT Image 29 juil. 2026, 17_46_47m.webp',
  'ChatGPT Image 29 juil. 2026, 17_46_47nn.webp',
  'ChatGPT Image 29 juil. 2026, 17_46_47nnnnnn.webp',
  'HHHH.webp',
  'b.webp',
  'bbb.webp',
  'bunny-amberB.webp',
  'ddddd.webp',
  'dddddddddd.webp',
  'h.webp',
  'hh.webp',
  'jjjj.webp',
  'k.webp',
  'kkkk.webp',
  'll.webp',
  'llllllll.webp',
  'p.webp',
  'www.webp',
]

// Largeur 360 px : les projectiles s'affichent à ~60-130 px, 2-3× suffisent pour les écrans Retina.
export const RABBIT_PROJECTILE_POOL: string[] = RABBIT_PROJECTILE_FILES.map((name) =>
  cld(FOLDER + name, { width: 360 })
)

/** Même pool, à une autre largeur (ex. 640 px pour le lapin de la balance 3D). */
export function rabbitPool(width: number): string[] {
  return RABBIT_PROJECTILE_FILES.map((name) => cld(FOLDER + name, { width }))
}

// ─── Réglages ────────────────────────────────────────────────────────────────
const COOLDOWN_MS = 1700 // délai mini entre deux salves sur une même carte
const MAX_LIVE = 24 // plafond de projectiles à l'écran (toutes cartes confondues)
const STAGGER_MS = 65 // décalage entre deux lapins d'une même salve
const DECODE_TIMEOUT_MS = 1500 // image pas encore en cache (réseau mobile lent)
const WARM_COUNT = 14 // images préchargées à l'approche de la section
const SAMPLES = 30 // points de la trajectoire (interpolés linéairement)

let liveCount = 0
// URLs déjà téléchargées ET décodées : les salves puisent en priorité dedans,
// pour que les lapins partent instantanément (jamais une salve vide).
const ready = new Set<string>()
let warmed = false

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function shuffled<T>(items: T[]): T[] {
  const copy = items.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Précharge un échantillon du pool (une seule fois pour tout le site). */
function warmPool(images: string[]) {
  if (warmed) return
  warmed = true
  shuffled(images).slice(0, WARM_COUNT).forEach((src) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
    img.decode().then(() => ready.add(src)).catch(() => {})
  })
}

/** Charge une image décodée ; essaie jusqu'à 3 sources, sinon renvoie null. */
async function loadRabbit(candidates: string[]): Promise<HTMLImageElement | null> {
  for (const src of candidates.slice(0, 3)) {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
    try {
      await Promise.race([
        img.decode(),
        new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('timeout')), DECODE_TIMEOUT_MS)),
      ])
      ready.add(src)
      return img
    } catch {
      // source cassée ou trop lente : on tente la suivante
    }
  }
  return null
}

/**
 * Branche l'effet sur une carte. Retourne la fonction de nettoyage.
 * @param card   élément qui déclenche l'effet (survol souris / toucher doigt)
 * @param count  nombre de lapins lancés à chaque salve
 * @param images pool d'URL d'images
 */
export function wireRabbitProjectiles(card: HTMLElement, count: number, images: string[]): () => void {
  if (typeof window === 'undefined' || count < 1 || !images.length) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  let lastLaunch = -Infinity
  let hovering = false
  let disposed = false
  const flying = new Set<{ img: HTMLImageElement; anim: Animation }>()

  // Préchauffe le cache quand la carte approche de l'écran (ou, sans IntersectionObserver, après 1,5 s) :
  // la 1re salve part sans attendre le réseau.
  let observer: IntersectionObserver | null = null
  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          warmPool(images)
          observer?.disconnect()
        }
      },
      { rootMargin: '800px 0px' }
    )
    observer.observe(card)
  } else {
    window.setTimeout(() => warmPool(images), 1500)
  }

  async function launch(originX: number, originY: number) {
    const now = performance.now()
    if (disposed || now - lastLaunch < COOLDOWN_MS || liveCount + count > MAX_LIVE) return
    lastLaunch = now

    const compact = window.matchMedia('(max-width: 640px)').matches
    const scale = compact ? 0.7 : 1
    // Images déjà prêtes d'abord (départ instantané), les autres en renfort
    const mixed = shuffled(images)
    const pool = [...mixed.filter((src) => ready.has(src)), ...mixed.filter((src) => !ready.has(src))]
    // Éventail : 1 lapin part vers le haut (±25°), plusieurs se répartissent sur ~150°
    const spread = count === 1 ? 50 : Math.min(160, 40 + count * 22)

    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1)
      const angle = ((-90 + (t - 0.5) * spread + rand(-9, 9)) * Math.PI) / 180 // -90° = vers le haut
      const reach = rand(230, 400) * scale
      const gravity = reach * rand(2, 2.5)
      const spin = rand(-320, 320)
      const tilt = rand(-22, 22)
      const size = rand(78, 128) * scale
      const duration = rand(1250, 1650)

      const candidates = [pool[i % pool.length], pool[(count + i) % pool.length], pool[(2 * count + i) % pool.length]]
      loadRabbit(candidates).then((img) => {
        if (!img || disposed) return
        img.alt = ''
        img.setAttribute('aria-hidden', 'true')
        img.draggable = false
        img.className = 'rabbit-projectile'
        Object.assign(img.style, {
          position: 'fixed',
          left: '0',
          top: '0',
          width: `${size}px`,
          height: 'auto',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: '60',
          opacity: '0',
          willChange: 'transform, opacity',
        })
        document.body.appendChild(img)
        liveCount += 1

        const keyframes: Keyframe[] = []
        for (let s = 0; s <= SAMPLES; s++) {
          const p = s / SAMPLES
          const x = Math.cos(angle) * reach * 1.15 * p
          const y = Math.sin(angle) * reach * p + 0.5 * gravity * p * p
          const pop = p < 0.18 ? 0.2 + (p / 0.18) * 0.8 : 1 - (p - 0.18) * 0.18
          const opacity = p < 0.08 ? p / 0.08 : p > 0.72 ? Math.max(0, 1 - (p - 0.72) / 0.28) : 1
          keyframes.push({
            offset: p,
            opacity,
            transform: `translate(${originX + x}px, ${originY + y}px) translate(-50%, -50%) rotate(${tilt + spin * p}deg) scale(${pop})`,
          })
        }

        const anim = img.animate(keyframes, { duration, delay: i * STAGGER_MS, easing: 'linear', fill: 'both' })
        const entry = { img, anim }
        flying.add(entry)
        const done = () => {
          if (!flying.delete(entry)) return
          img.remove()
          liveCount -= 1
        }
        anim.onfinish = done
        anim.oncancel = done
      })
    }
  }

  // Souris / stylet : une salve à l'entrée, puis une nouvelle (après le délai) tant que le curseur bouge sur la carte.
  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    hovering = true
    launch(e.clientX, e.clientY)
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || !hovering) return
    launch(e.clientX, e.clientY)
  }
  const onLeave = () => { hovering = false }
  // Doigt : une salve à chaque pose du doigt sur la carte.
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') return
    launch(e.clientX, e.clientY)
  }

  card.addEventListener('pointerenter', onEnter)
  card.addEventListener('pointermove', onMove)
  card.addEventListener('pointerleave', onLeave)
  card.addEventListener('pointerdown', onDown, { passive: true })

  return () => {
    disposed = true
    observer?.disconnect()
    card.removeEventListener('pointerenter', onEnter)
    card.removeEventListener('pointermove', onMove)
    card.removeEventListener('pointerleave', onLeave)
    card.removeEventListener('pointerdown', onDown)
    flying.forEach(({ img, anim }) => {
      anim.oncancel = null
      anim.onfinish = null
      anim.cancel()
      img.remove()
      liveCount -= 1
    })
    flying.clear()
  }
}
