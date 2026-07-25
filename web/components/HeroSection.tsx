'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import RainbowText from './RainbowText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

// HERO — port de la variante "01 — L'Original" de vrai_hero_pour_akatech.html :
// grille spotlight 3×3 surdimensionnée (300%) qui se réduit (scale 1→0.5,
// médias 1.25→1) pendant que la section reste pinnée au scroll (scrub).
// Remplace l'ancien carousel vidéo plein écran + dots. Fond webp en
// couche 0 (peint instantanément, visible dans les interstices de la
// grille). Titre "FLORENCE" + sous-titre inchangés (reveal élastique au
// montage, pas lié au scroll — le hero est déjà visible au chargement).
// Sur mobile, la grille reste figée à son état "réduit" (pas de pin/scrub
// — trop de vidéos simultanées + scroll-jack sur petit écran = jank).
const GRID_COLS: Array<Array<{ src: string; type: 'video' | 'image' }>> = [
  [
    { src: '/IMAGES/1.webm', type: 'video' },
    { src: '/IMAGES/Snapchat-956074945.webp', type: 'image' },
    { src: '/IMAGES/2.webm', type: 'video' },
  ],
  [
    { src: '/IMAGES/Snapchat-1244900246.webp', type: 'image' },
    { src: '/IMAGES/3.webm', type: 'video' },
    { src: '/IMAGES/Snapchat-533353503.webp', type: 'image' },
  ],
  [
    { src: '/IMAGES/Snapchat-677178772_001.webm', type: 'video' },
    { src: '/IMAGES/Snapchat-1244423645.webp', type: 'image' },
    { src: '/IMAGES/4.webp', type: 'image' },
  ],
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
    const media = gallery?.querySelectorAll<HTMLElement>('.hero-spotlight-item img, .hero-spotlight-item video')
    if (!gallery || !media) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      gsap.set(gallery, { scale: 1 })
      gsap.set(media, { scale: 1.25 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      })
      tl.to(gallery, { scale: 0.5, ease: 'none' }, 0)
      tl.to(media, { scale: 1, ease: 'none' }, 0)

      return () => tl.scrollTrigger?.kill()
    })

    // Mobile : pas de pin/scrub (trop de vidéos + scroll-jack = jank),
    // la grille reste figée sur son état "réduit".
    mm.add('(max-width: 768px)', () => {
      gsap.set(gallery, { scale: 0.62 })
      gsap.set(media, { scale: 1 })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="hero-section" id="hero" ref={sectionRef}>
      <div className="hero-bg" aria-hidden="true" />

      <div className="hero-spotlight-gallery" ref={galleryRef} aria-hidden="true">
        {GRID_COLS.map((col, ci) => (
          <div className="hero-spotlight-col" key={ci}>
            {col.map((item, ii) =>
              item.type === 'video' ? (
                <div className="hero-spotlight-item" key={ii}>
                  <video src={item.src} muted autoPlay loop playsInline preload="metadata" />
                </div>
              ) : (
                <div className="hero-spotlight-item" key={ii}>
                  <img src={item.src} alt="" loading="eager" />
                </div>
              )
            )}
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
