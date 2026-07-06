'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/**
 * Orchestrateur de toute l'animation scroll de la home cinématique
 * (Lenis + ScrollTrigger + SplitText). Port fidèle du <script> de
 * index.html : cible les sections par sélecteur global (#page2, #sec-iris,
 * .price-card, …) exactement comme le prototype, peu importe dans quel
 * composant React elles vivent — tous sont montés au moment où cet effet
 * tourne. À appeler une seule fois (voir <ScrollFX />).
 */
export default function useGsapLenis() {
  useGSAP((_context, contextSafe) => {
    if (!contextSafe) return

    // Active les quelques règles CSS scopées "le temps que la home
    // cinématique est montée" (masquage de la scrollbar — voir home-cinematic.css)
    document.documentElement.classList.add('lp-home-active')

    const cleanupFns: Array<() => void> = []
    let cancelled = false

    // ── Lenis (smooth scroll) + tick GSAP ────────────────────────
    const isDesktop = window.matchMedia('(pointer: fine)').matches

    const lenis = new Lenis({
      lerp: isDesktop ? 0.08 : 0.18,
      smoothWheel: true,
      smoothTouch: true,
      syncTouch: true,
      wheelMultiplier: isDesktop ? 0.8 : 0.6,
      touchMultiplier: 0.9,
      normalizeWheel: true,
      infinite: false,
      overscroll: false,
    } as ConstructorParameters<typeof Lenis>[0])

    lenis.on('scroll', ScrollTrigger.update)

    const tickLenis = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickLenis)
    gsap.ticker.lagSmoothing(0)

    // ── Reveal "above-intro" (page2) ─────────────────────────────
    gsap.to('#above-intro', {
      clipPath: 'inset(0 0 0% 0)',
      ease: 'none',
      scrollTrigger: {
        trigger: '#intro-container',
        start: 'top 80%',
        end: 'top 30%',
        scrub: 2,
      },
    })

    // ── Reveal "above-intro-1" (page3) ───────────────────────────
    gsap.to('#above-intro-1', {
      clipPath: 'inset(0 0 0% 0)',
      ease: 'none',
      scrollTrigger: {
        trigger: '#intro-container-1',
        start: 'top 80%',
        end: 'top 30%',
        scrub: 2,
      },
    })

    // ── Ligne qui se dessine (page2) ─────────────────────────────
    const scrollLine = document.querySelector<SVGLineElement>('#scroll-line line')
    if (scrollLine) {
      const length = scrollLine.getTotalLength()
      gsap.set(scrollLine, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(scrollLine, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#scroll-line',
          start: 'top 80%',
          end: 'top 40%',
          scrub: 4,
          once: true,
        },
      })
    }

    // ── Parallax croisé page3 (les 2 plates latérales) ───────────
    gsap.to('#page3-img-2', {
      xPercent: 120,
      duration: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#page3-img-2',
        scroller: 'body',
        start: 'top 100%',
        end: 'top -40%',
        scrub: 2.5,
      },
    })
    gsap.to('#page3-img-3', {
      xPercent: -120,
      duration: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#page3-img-3',
        scroller: 'body',
        start: 'top 120%',
        end: 'top -40%',
        scrub: 2.5,
      },
    })

    // ── Fond page3 : dark → muted (clair) ──────────────────────────
    gsap.to('#page3', {
      backgroundColor: '#A89678',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#page3',
        scroller: 'body',
        start: 'top -130%',
        end: 'bottom -30%',
        scrub: 1,
      },
    })

    // ── Effet pinné desktop uniquement ────────────────────────────
    // No. 04 Portrait (iris) — seul effet plein écran restant ;
    // Triptyque (Galerie) et Blob (En Mouvement) ont été entièrement
    // retirés (composants + CSS supprimés, plus seulement l'animation).
    const fxMM = gsap.matchMedia()
    fxMM.add('(min-width: 800px)', () => {
      gsap.to('.iris-mask', {
        clipPath: 'circle(150% at 50% 50%)',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '#sec-iris',
          pin: true,
          start: 'center center',
          end: '+=1000',
          scrub: 1,
        },
      })
    })

    // ── Cartes tarifs ──────────────────────────────────────────────
    gsap.from('.price-card', {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.pricing-grid',
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    })

    // ── Aperçu flottant au survol (Nos Garanties) ──────────────────
    const hoverImage = document.querySelector<HTMLElement>('#hover-img')
    const hoverItems = document.querySelectorAll<HTMLElement>('.hover-item')

    if (hoverImage) {
      gsap.set(hoverImage, { xPercent: -50, yPercent: -50 })

      const onMove = contextSafe((e: MouseEvent) => {
        gsap.to(hoverImage, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: 'power1.out',
        })
      })
      window.addEventListener('mousemove', onMove)
      cleanupFns.push(() => window.removeEventListener('mousemove', onMove))

      hoverItems.forEach((item) => {
        const enter = contextSafe(() => {
          hoverImage.style.backgroundImage = item.dataset.img || ''
          hoverImage.style.opacity = '1'
        })
        const leave = contextSafe(() => {
          hoverImage.style.opacity = '0'
        })
        item.addEventListener('mouseenter', enter)
        item.addEventListener('mouseleave', leave)
        cleanupFns.push(() => {
          item.removeEventListener('mouseenter', enter)
          item.removeEventListener('mouseleave', leave)
        })
      })
    }

    // ── Effets dépendant des polices (SplitText) ────────────────────
    // Bandeau horizontal pinné + titres "lines"/"chars" — comme
    // index.html, on attend document.fonts.ready pour que SplitText
    // mesure le texte avec la bonne police (Bodoni Moda / IBM Plex Mono).
    const runFontDependentFx = contextSafe(() => {
      const wrapper = document.querySelector<HTMLElement>('.Horizontal')
      const text = document.querySelector<HTMLElement>('.Horizontal__text')

      if (wrapper && text) {
        const splitWords = SplitText.create(text, { type: 'chars,words' })

        const scrollTween = gsap.to(text, {
          xPercent: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            end: '+=5000px',
            scrub: true,
          },
        })

        splitWords.chars.forEach((char) => {
          gsap.from(char, {
            yPercent: 'random(-200,200)',
            rotation: 'random(-20,20)',
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: char,
              containerAnimation: scrollTween,
              start: 'left 100%',
              end: 'left 30%',
              scrub: 1,
            },
          })
        })
      }

      const splitChars1 = new SplitText('.split-heading-1', { type: 'chars' })

      gsap.set(splitChars1.chars, {
        yPercent: 60,
        rotateX: -35,
        skewX: -7,
        autoAlpha: 0,
      })

      gsap.to(splitChars1.chars, {
        yPercent: 0,
        rotateX: 0,
        skewX: 0,
        autoAlpha: 1,
        duration: 1.4,
        ease: 'power4.out',
        stagger: { amount: 0.55, from: 'start' },
        scrollTrigger: {
          trigger: '.split-heading-1',
          start: 'top 90%',
          end: 'top 0%',
          scrub: 3.8,
          once: true,
        },
      })
    })

    document.fonts.ready.then(() => {
      if (!cancelled) runFontDependentFx()
    })

    return () => {
      cancelled = true
      document.documentElement.classList.remove('lp-home-active')
      cleanupFns.forEach((fn) => fn())
      gsap.ticker.remove(tickLenis)
      lenis.destroy()
    }
  }, [])
}
