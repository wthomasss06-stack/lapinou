'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import RainbowText from './RainbowText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

// HERO — port de la variante "02 — Le Vortex" de vrai_hero_pour_akatech.html :
// grille spotlight 3×3 surdimensionnée (300%) qui se réduit ET pivote
// (scale 1→0.4, rotation 0→180) pendant que chaque média contre-pivote
// (scale 1.25→1, rotation 0→-180) pour rester lisible — section pinnée
// au scroll (scrub). Remplace l'ancien carousel vidéo plein écran + dots.
// Uniquement du webp (aucune vidéo) : 9 lecteurs webm simultanés + le
// scroll-jack aurait été trop lourd pour la perf. Fond webp en couche 0.
// Titre "FLORENCE" + sous-titre inchangés (reveal élastique au montage,
// pas lié au scroll — le hero est déjà visible au chargement).
// Sur mobile, la grille reste figée à son état "réduit" (pas de pin/scrub).
const GRID_COLS: string[][] = [
  ['/IMAGES/Snapchat-956074945.webp', '/IMAGES/Snapchat-1244900246.webp', '/IMAGES/Snapchat-533353503.webp'],
  ['/IMAGES/Snapchat-1244423645.webp', '/IMAGES/4.webp', '/IMAGES/Snapchat-1016404691.webp'],
  ['/IMAGES/Snapchat-908462874.webp', '/IMAGES/Snapchat-956074945.webp', '/IMAGES/Snapchat-1244900246.webp'],
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    document.fonts.ready.then(() => {
      // Titre "élastique" — inchangé (voir Footer/GarantiesSection pour
      // les mêmes valeurs déclenchées au scroll via useGsapLenis.ts).
      const split = SplitText.create('#hero-title', { type: 'chars', charsClass: 'hero-char' })
      gsap.set(split.chars, { y: 60, opacity: 0, scale: 0.5 })
      gsap.to(split.chars, {
        y: 0, opacity: 1, scale: 1,
        duration: 1.3,
        delay: 0.2,
        stagger: 0.015,
        ease: 'elastic.out(0.75, 0.3)',
      })
    })

    const gallery = galleryRef.current
    const media = gallery?.querySelectorAll<HTMLElement>('.hero-spotlight-item img')
    if (!gallery || !media) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      gsap.set(gallery, { scale: 1, rotation: 0 })
      gsap.set(media, { scale: 1.25, rotation: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      })
      tl.to(gallery, { scale: 0.4, rotation: 180, ease: 'none' }, 0)
      tl.to(media, { scale: 1, rotation: -180, ease: 'none' }, 0)

      return () => tl.scrollTrigger?.kill()
    })

    // Mobile : pas de pin/scrub (scroll-jack + rotation sur petit écran =
    // désagréable), la grille reste figée sur son état "réduit", sans
    // rotation.
    mm.add('(max-width: 768px)', () => {
      gsap.set(gallery, { scale: 0.62, rotation: 0 })
      gsap.set(media, { scale: 1, rotation: 0 })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="hero-section" id="hero" ref={sectionRef}>
      <div className="hero-bg" aria-hidden="true" />

      <div className="hero-spotlight-gallery" ref={galleryRef} aria-hidden="true">
        {GRID_COLS.map((col, ci) => (
          <div className="hero-spotlight-col" key={ci}>
            {col.map((src, ii) => (
              <div className="hero-spotlight-item" key={ii}>
                <img src={src} alt="" loading="eager" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="hero-scrim" />

      <div className="title-container">
        <div className="title-small">Chez</div>
        <h1 id="hero-title" className="title-main">FLORENCE</h1>
      </div>

      <RainbowText
        text="Des lapins de race élevés avec soin, disponibles pour particuliers, restaurateurs & éleveurs PME. Élevage artisanal · Abidjan, Côte d'Ivoire."
        variant="white"
        className="hero-sub"
        immediate
      />

      <div className="hero-scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
