'use client'

import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Porté depuis text.html ("Rainbow to Black Reveal Effect") : chaque lettre
// occupe une tranche de la timeline de scroll du bloc (mot i/N → lettres de
// ce mot réparties dans sa tranche), et traverse fantôme → couleur arc-en-ciel
// → couleur finale, avec un halo (text-shadow) qui pulse au passage.
//
// Adaptation au site (fond sombre ou clair selon la section) : text.html
// va gris clair → noir (pensé pour un fond blanc). Ici fantôme et couleur
// finale sont LA MÊME teinte de marque, juste à deux opacités — la lettre
// émerge de son propre fantôme, traverse un flash arc-en-ciel, et se pose
// dans sa vraie couleur. Remplace entièrement l'ancien reveal clip-path
// (#above-intro / #behind-intro) sur les 5 intros de la home.
const RAINBOW_COLORS = ['#FF0055', '#FF9900', '#FFEE00', '#00FF66', '#00CCFF', '#8800FF']

type Variant = 'muted' | 'white' | 'dark'

const VARIANT_RGB: Record<Variant, [number, number, number]> = {
  muted: [168, 150, 120], // var(--muted) — Garanties / Tarifs (fond sombre)
  white: [255, 255, 255], // Contact + pages Aide/Confidentialité/Conditions (fond sombre)
  dark: [42, 33, 24],     // var(--dark) — Nos Lapins (fond clair, #page4)
}

type Rgba = [number, number, number, number]

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function lerpRgba(a: Rgba, b: Rgba, t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  const al = a[3] + (b[3] - a[3]) * t
  return `rgba(${r}, ${g}, ${bl}, ${al.toFixed(3)})`
}

interface RainbowTextProps {
  text: string
  variant?: Variant
  className?: string
  as?: 'p' | 'h2' | 'h3' | 'span' | 'div'
  /** Ne s'active qu'à partir de ce breakpoint (desktop uniquement). */
  minWidth?: number
  /**
   * Joue le reveal une fois au montage (tween minuté) au lieu du scrub lié
   * au scroll. Pour le contenu déjà visible au chargement — typiquement le
   * Hero — où il n'y a pas de scroll "vers" l'élément : avec le scrub
   * classique (start: 'top 90%', end: 'top 10%'), un bloc déjà dans le
   * premier écran reste coincé entre les deux seuils et n'atteint jamais
   * sa couleur finale tant que l'utilisateur n'a pas scrollé exactement la
   * bonne plage.
   */
  immediate?: boolean
}

export default function RainbowText({
  text,
  variant = 'muted',
  className = '',
  as: Tag = 'p',
  minWidth,
  immediate = false,
}: RainbowTextProps) {
  const containerRef = useRef<HTMLElement | null>(null)
  const charRefs = useRef<(HTMLSpanElement | null)[]>([])

  const words = useMemo(() => text.split(' '), [text])

  // Un mot = 1/N de la timeline ; ses lettres se partagent cette tranche à
  // parts égales. globalIndex sert uniquement à piocher une couleur arc-en-
  // ciel différente à chaque lettre (round-robin sur les 6 teintes).
  const wordGroups = useMemo(() => {
    let globalIndex = 0
    return words.map((word, wordIndex) => {
      const wordStart = wordIndex / words.length
      const wordEnd = wordStart + 1 / words.length
      const chars = word.split('')
      const step = (wordEnd - wordStart) / chars.length
      const charData = chars.map((char, charIndex) => {
        const start = wordStart + charIndex * step
        const data = {
          char,
          start,
          end: start + step,
          color: RAINBOW_COLORS[globalIndex % RAINBOW_COLORS.length],
          globalIndex,
        }
        globalIndex += 1
        return data
      })
      return { word, charData }
    })
  }, [words])

  const flatChars = useMemo(() => wordGroups.flatMap((g) => g.charData), [wordGroups])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const [r, g, b] = VARIANT_RGB[variant]
    const GHOST: Rgba = [r, g, b, 0.22]
    const FINAL: Rgba = [r, g, b, 1]

    const update = (progress: number) => {
      flatChars.forEach((meta) => {
        const el = charRefs.current[meta.globalIndex]
        if (!el) return
        const { start, end, color } = meta

        if (progress <= start) {
          el.style.color = `rgba(${GHOST.join(',')})`
          el.style.textShadow = 'none'
          return
        }
        if (progress >= end) {
          el.style.color = `rgba(${FINAL.join(',')})`
          el.style.textShadow = 'none'
          return
        }

        const t = (progress - start) / (end - start)
        const rgb = hexToRgb(color)
        const ACTIVE: Rgba = [...rgb, 1]

        if (t <= 0.05) {
          el.style.color = lerpRgba(GHOST, ACTIVE, t / 0.05)
        } else if (t <= 0.95) {
          el.style.color = `rgba(${ACTIVE.join(',')})`
        } else {
          el.style.color = lerpRgba(ACTIVE, FINAL, (t - 0.95) / 0.05)
        }

        const shadowAlpha = t <= 0.5 ? (t / 0.5) * 0.4 : (1 - (t - 0.5) / 0.5) * 0.4
        el.style.textShadow = `0 0 18px rgba(${rgb.join(',')}, ${shadowAlpha.toFixed(3)})`
      })
    }

    const registerScroll = () => {
      update(0)
      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top 90%',
        end: 'top 10%',
        scrub: 0.8,
        onUpdate: (self) => update(self.progress),
      })
      return () => st.kill()
    }

    const registerImmediate = () => {
      update(0)
      const tw = gsap.to({ p: 0 }, {
        p: 1,
        duration: Math.min(2.2, 0.9 + flatChars.length * 0.018),
        delay: 0.15,
        ease: 'power1.inOut',
        onUpdate: function () { update(this.targets()[0].p) },
      })
      return () => tw.kill()
    }

    const register = immediate ? registerImmediate : registerScroll

    let cleanup: (() => void) | undefined
    let mm: ReturnType<typeof gsap.matchMedia> | undefined

    if (minWidth) {
      mm = gsap.matchMedia()
      mm.add(`(min-width: ${minWidth}px)`, register)
    } else {
      cleanup = register()
    }

    return () => {
      cleanup?.()
      mm?.revert()
    }
  }, [flatChars, variant, minWidth, immediate])

  return (
    <Tag ref={containerRef as any} className={`rainbow-reveal ${className}`}>
      {wordGroups.map((group, wIndex) => (
        <span className="rainbow-word" key={wIndex}>
          {group.charData.map((meta) => (
            <span
              key={meta.globalIndex}
              ref={(el) => { charRefs.current[meta.globalIndex] = el }}
              className="rainbow-char"
            >
              {meta.char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
