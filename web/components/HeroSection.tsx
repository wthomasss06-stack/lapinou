'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import RainbowText from './RainbowText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const GRID_COLS: string[][] = [
  ['/IMAGES/Snapchat-956074945.webp', , '/IMAGES/Snapchat-533353503.webp'],
  ['/IMAGES/Snapchat-1244423645.webp', '/IMAGES/3.webm', '/IMAGES/Snapchat-1016404691.webp'],
  ['/IMAGES/Snapchat-908462874.webp', '/IMAGES/Snapchat-956074945.webp', '/IMAGES/Snapchat-1244900246.webp'],
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    const gallery = galleryRef.current
    if (!section || !gallery) return

        const items = gallery.querySelectorAll<HTMLElement>('.hero-spotlight-item')
    const imgs = gallery.querySelectorAll<HTMLImageElement | HTMLVideoElement>(
      '.hero-spotlight-item img, .hero-spotlight-item video'
    )
    const titleWrap = section.querySelector<HTMLElement>('.hero-title-wrap')
    const centerContent = section.querySelector<HTMLElement>('.hero-center-content')
    const heroOverlay = section.querySelector<HTMLElement>('.hero-overlay')

    /* ═══════════════════════════════════════════════
       1. INTRODUCTION AU MONTAGE
       Les 9 cases arrivent en stagger depuis le bas.
       Le titre apparaît au bas une fois la grille stable.
       Le bloc centre reste caché.
       ═══════════════════════════════════════════════ */
    const introTl = gsap.timeline({ delay: 0.3 })

    // Grille : apparition staggered depuis le centre
    gsap.set(items, { y: 120, opacity: 0, scale: 0.85 })
    introTl.to(items, {
      y: 0, opacity: 1, scale: 1,
      duration: 0.9,
      stagger: { amount: 0.6, from: 'center' },
      ease: 'power3.out',
    })
    
    // Titre élastique (SplitText)
    document.fonts.ready.then(() => {
      try {
        const split = SplitText.create('#hero-title', { type: 'chars', charsClass: 'hero-char' })
        gsap.set(split.chars, { y: 50, opacity: 0, scale: 0.5 })
        gsap.to(split.chars, {
          y: 0, opacity: 1, scale: 1,
          duration: 1.2,
          delay: 0.9,
          stagger: 0.015,
          ease: 'elastic.out(0.75, 0.3)',
        })
      } catch (e) {
        console.warn('SplitText non disponible', e)
      }
    })

    // Titre wrapper : fade-in au bas du hero
    if (titleWrap) {
      gsap.set(titleWrap, { opacity: 0, y: 30 })
      introTl.to(titleWrap, {
        opacity: 1, y: 0, duration: 0.8,
        ease: 'power2.out',
      }, '-=0.3')
    }

    // Contenu centre : caché au départ
    if (centerContent) {
      gsap.set(centerContent, { opacity: 0, y: 40, pointerEvents: 'none' })
    }

    /* ═══════════════════════════════════════════════
       2. SCROLL — Variante 02 : Le Vortex
       ═══════════════════════════════════════════════ */
    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      gsap.set(gallery, { scale: 1, rotation: 0 })
      gsap.set(imgs, { scale: 1.25, rotation: 0 })

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 0.8,
        },
      })

      /* Phase A : Titre remonte du bas → centre → haut */
      if (titleWrap) {
        // Bas (18%) → Centre (50%) : 0% - 45%
        scrollTl.fromTo(titleWrap,
          { bottom: '18%', scale: 1, opacity: 1 },
          { bottom: '50%', scale: 1.1, opacity: 1, ease: 'none' },
          0
        )
        // Centre → Haut (92%) + disparition : 45% - 100%
        scrollTl.to(titleWrap,
          { bottom: '92%', scale: 1.7, opacity: 0, ease: 'none' },
          0.45
        )
      }

      /* Phase B : Overlay noir progressif */
      if (heroOverlay) {
        scrollTl.fromTo(heroOverlay,
          { opacity: 0 },
          { opacity: 0.6, ease: 'none' },
          0
        )
      }

      /* Phase C : Contenu centre apparaît une fois le titre parti */
      if (centerContent) {
        scrollTl.fromTo(centerContent,
          { opacity: 0, y: 50, pointerEvents: 'none' },
          { opacity: 1, y: 0, pointerEvents: 'auto', ease: 'none' },
          0.42
        )
      }

      /* Phase D : LE VORTEX (toute la durée) */
      scrollTl.to(gallery, { scale: 0.4, rotation: 180, ease: 'none' }, 0)
      scrollTl.to(imgs, { scale: 1, rotation: -180, ease: 'none' }, 0)

      return () => {
        scrollTl.kill()
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === section) st.kill()
        })
      }
    })

    /* MOBILE — pas de pin/scrub, tout visible */
    mm.add('(max-width: 768px)', () => {
      gsap.set(gallery, { scale: 0.62, rotation: 0 })
      gsap.set(imgs, { scale: 1, rotation: 0 })
      if (titleWrap) gsap.set(titleWrap, { opacity: 1, y: 0, bottom: 'auto', position: 'relative' })
      if (centerContent) gsap.set(centerContent, { opacity: 1, y: 0, pointerEvents: 'auto' })
    })

    return () => {
      introTl.kill()
      mm.revert()
    }
  }, { scope: sectionRef })

  return (
    <section className="hero-section" id="hero" ref={sectionRef}>
      {/* Couche 0 : fond webp */}
      <div className="hero-bg" aria-hidden="true" />

      {/* Couche 1 : overlay noir progressif */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Couche 2 : grille spotlight 3×3 */}
      <div className="hero-spotlight-gallery" ref={galleryRef} aria-hidden="true">
        {GRID_COLS.map((col, ci) => (
  <div className="hero-spotlight-col" key={ci}>
    {col.map((src, ii) => (
      <div className="hero-spotlight-item" key={ii}>
        {src.endsWith('.webm') ? (
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <img src={src} alt="" loading="eager" />
        )}
      </div>
    ))}
  </div>
))}
      </div>

      {/* Couche 3 : voile dégradé */}
      <div className="hero-scrim" />

      {/* ═══════════════════════════════════════════════
          TITRE : commence en bas, remonte au scroll
          ═══════════════════════════════════════════════ */}
      <div className="hero-title-wrap">
        <div className="title-container">
          <div className="title-small">Chez</div>
          <h1 id="hero-title" className="title-main">FLORENCE</h1>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          CONTENU CENTRE : sous-titre + CTA
          Stable au centre, apparaît après le titre
          ═══════════════════════════════════════════════ */}
      <div className="hero-center-content">
        <div className="hero-footer-text">
          <RainbowText
            text="Des lapins de race élevés avec soin, disponibles pour particuliers, restaurateurs & éleveurs PME. Élevage artisanal · Abidjan, Côte d'Ivoire."
            variant="white"
            className="hero-sub"
            immediate
          />
        </div>

        <a href="/#lapins" className="hero-cta-btn cf-arrow-btn cf-arrow-btn--solid">
          Découvrir nos lapins
          <span className="cf-arrow-btn-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </span>
        </a>
      </div>

      {/* Cue scroll */}
      <div className="hero-scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}