'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import RainbowText from './RainbowText'
import HoverFadeText from './HoverFadeText'
import { cld } from '@/lib/cloudinary'
import { wireHoverImageChars } from '@/lib/hoverImageChars'
import { CHEZ_FLORENCE_IMAGE_POOL, CHEZ_FLORENCE_LETTER_IMAGES } from '@/lib/chezFlorenceLetters'
import LetterHoverTitle from './LetterHoverTitle'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/* ═══ DESKTOP : grille 3×3 du vortex ═══ */
const GRID_COLS: string[][] = [
  [cld('/IMAGES/Snapchat-956074945.webp'), cld('/IMAGES/3.webp'), cld('/IMAGES/Snapchat-533353503.webp')],
  [cld('/IMAGES/Snapchat-1244423645.webp'), cld('/IMAGES/4.webp'), cld('/IMAGES/Snapchat-1016404691.webp')],
  [cld('/IMAGES/Snapchat-908462874.webp'), cld('/IMAGES/Snapchat-956074945.webp'), cld('/IMAGES/Snapchat-1244900246.webp')],
]

/* ═══ MOBILE : slides webm plein écran ═══ */
const SLIDES = [
  cld('/IMAGES/1.webm'),
  cld('/IMAGES/2.webm'),
  cld('/IMAGES/3.webm'),
  cld('/IMAGES/4.webm'),
  cld('/IMAGES/5.webm'),
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  /* ── Mobile carousel state ── */
  const [cur, setCur] = useState(0)
  const vidRefs = useRef<(HTMLVideoElement | null)[]>([])
  const curRef = useRef(0)
  const busy = useRef(false)

  useEffect(() => { curRef.current = cur }, [cur])
  useEffect(() => { vidRefs.current[0]?.play().catch(() => {}) }, [])

  const goTo = useCallback((n: number) => {
    if (busy.current || n === curRef.current) return
    busy.current = true
    vidRefs.current[curRef.current]?.pause()
    const v = vidRefs.current[n]
    if (v) { v.currentTime = 0; v.play().catch(() => {}) }
    setCur(n)
    busy.current = false
  }, [])

  /* ── GSAP : vortex desktop + hover images pool sur FLORENCE ── */
  useGSAP(() => {
    const section = sectionRef.current
    const gallery = galleryRef.current
    if (!section) return

    const mm = gsap.matchMedia()

    /* ═══════════════════════════════════════════════
       DESKTOP — Vortex 3×3 (pin + scrub)
       ═══════════════════════════════════════════════ */
    mm.add('(min-width: 769px)', () => {
      if (!gallery) return () => {}

      const items = gallery.querySelectorAll<HTMLElement>('.hero-spotlight-item')
      const imgs = gallery.querySelectorAll<HTMLImageElement>('.hero-spotlight-item img')
      const titleWrap = section.querySelector<HTMLElement>('.hero-desktop .hero-title-wrap')
      const centerContent = section.querySelector<HTMLElement>('.hero-desktop .hero-center-content')
      const heroOverlay = section.querySelector<HTMLElement>('.hero-desktop .hero-overlay')

      const introTl = gsap.timeline({ delay: 0.3 })

      gsap.set(items, { y: 120, opacity: 0, scale: 0.85 })
      introTl.to(items, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.9,
        stagger: { amount: 0.6, from: 'center' },
        ease: 'power3.out',
      })

      // Hover pool images sur FLORENCE desktop (même pool que le footer)
      let cleanupLetterHoverDesktop = () => {}
      document.fonts.ready.then(() => {
        try {
          const split = SplitText.create('#hero-title-desktop', { type: 'chars', charsClass: 'hero-char' })
          gsap.set(split.chars, { y: 50, opacity: 0, scale: 0.5 })
          gsap.to(split.chars, {
            y: 0, opacity: 1, scale: 1,
            duration: 1.2,
            delay: 0.9,
            stagger: 0.015,
            ease: 'elastic.out(0.75, 0.3)',
          })
          const titleEl = document.getElementById('hero-title-desktop')
          if (titleEl) {
            cleanupLetterHoverDesktop = wireHoverImageChars(titleEl, '.hero-char', CHEZ_FLORENCE_IMAGE_POOL)
          }
        } catch (e) {
          console.warn('SplitText non disponible', e)
        }
      })

      if (titleWrap) {
        gsap.set(titleWrap, { opacity: 0, y: 30 })
        introTl.to(titleWrap, {
          opacity: 1, y: 0, duration: 0.8,
          ease: 'power2.out',
        }, '-=0.3')
      }

      if (centerContent) {
        gsap.set(centerContent, { opacity: 0, y: 40, pointerEvents: 'none' })
      }

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

      if (titleWrap) {
        scrollTl.fromTo(titleWrap,
          { bottom: '18%', scale: 1, opacity: 1 },
          { bottom: '50%', scale: 1.1, opacity: 1, ease: 'none' }, 0
        )
        scrollTl.to(titleWrap,
          { bottom: '92%', scale: 1.7, opacity: 0, ease: 'none' }, 0.45
        )
      }

      if (heroOverlay) {
        scrollTl.fromTo(heroOverlay, { opacity: 0 }, { opacity: 0.6, ease: 'none' }, 0)
      }

      if (centerContent) {
        scrollTl.fromTo(centerContent,
          { opacity: 0, y: 50, pointerEvents: 'none' },
          { opacity: 1, y: 0, pointerEvents: 'auto', ease: 'none' }, 0.42
        )
      }

      scrollTl.to(gallery, { scale: 0.4, rotation: 180, ease: 'none' }, 0)
      scrollTl.to(imgs, { scale: 1, rotation: -180, ease: 'none' }, 0)

      return () => {
        cleanupLetterHoverDesktop()
        scrollTl.kill()
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === section) st.kill()
        })
      }
    })

    /* ═══════════════════════════════════════════════
       MOBILE — Slides webm (titre élastique + hover pool)
       ═══════════════════════════════════════════════ */
    mm.add('(max-width: 768px)', () => {
      let cleanupLetterHoverMobile = () => {}
      document.fonts.ready.then(() => {
        try {
          const split = SplitText.create('#hero-title-mobile', { type: 'chars', charsClass: 'hero-char' })
          gsap.set(split.chars, { y: 60, opacity: 0, scale: 0.5 })
          gsap.to(split.chars, {
            y: 0, opacity: 1, scale: 1,
            duration: 1.3,
            delay: 0.2,
            stagger: 0.015,
            ease: 'elastic.out(0.75, 0.3)',
          })
          const titleEl = document.getElementById('hero-title-mobile')
          if (titleEl) {
            cleanupLetterHoverMobile = wireHoverImageChars(titleEl, '.hero-char', CHEZ_FLORENCE_IMAGE_POOL)
          }
        } catch (e) {
          console.warn('SplitText non disponible', e)
        }
      })
      return () => { cleanupLetterHoverMobile() }
    })

    return () => { mm.revert() }
  }, { scope: sectionRef })

  return (
    <section className="hero-section" id="hero" ref={sectionRef}>
      {/* ═══════════════════════════════════════════════
          DESKTOP : Vortex 3×3
          ═══════════════════════════════════════════════ */}
      <div className="hero-desktop">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-spotlight-gallery" ref={galleryRef} aria-hidden="true">
          {GRID_COLS.map((col, ci) => (
            <div className="hero-spotlight-col" key={ci}>
              {col.map((src, ii) => {
                const isVisible = ci === 1 && ii === 1 // centre de la grille
                return (
                  <div className="hero-spotlight-item" key={ii}>
                    <img
                      src={src}
                      alt=""
                      loading={isVisible ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="hero-scrim" />
        <div className="hero-title-wrap">
          <div className="title-container">
            <LetterHoverTitle
              as="div"
              words={['Chez']}
              letterImages={CHEZ_FLORENCE_LETTER_IMAGES}
              className="title-small"
            />
            <h1 id="hero-title-desktop" className="title-main">FLORENCE</h1>
          </div>
        </div>
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
            <HoverFadeText>Découvrir nos lapins</HoverFadeText>
            <span className="cf-arrow-btn-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE : Slides webm plein écran
          ═══════════════════════════════════════════════ */}
      <div className="hero-mobile">
        {SLIDES.map((src, i) => (
          <div key={src} className="hero-video-slide" style={{ zIndex: i === cur ? 1 : 0, opacity: i === cur ? 1 : 0 }}>
            <video
              ref={(el) => { vidRefs.current[i] = el }}
              src={src}
              muted
              playsInline
              preload={i === 0 ? 'auto' : 'metadata'}
              poster={cld('/IMAGES/Snapchat-908462874.webp')}
              onEnded={() => { if (i === curRef.current) goTo((i + 1) % SLIDES.length) }}
              className="hero-video"
              style={{ transform: 'translateZ(0)' }}
            />
          </div>
        ))}
        <div className="hero-scrim" />
        <div className="title-container">
          <div className="title-small">Chez</div>
          <h1 id="hero-title-mobile" className="title-main">FLORENCE</h1>
        </div>
        <RainbowText
          text="Des lapins de race élevés avec soin, disponibles pour particuliers, restaurateurs & éleveurs PME. Élevage artisanal · Abidjan, Côte d'Ivoire."
          variant="white"
          className="hero-sub"
          immediate
        />
        <a href="#contact" className="hero-cta-btn cf-arrow-btn cf-arrow-btn--solid hover-target">
          <HoverFadeText>Commander</HoverFadeText>
          <span className="cf-arrow-btn-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </span>
        </a>
      </div>

      {/* Cue scroll (partagé) */}
      <div className="hero-scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}