'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(useGSAP, ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

/**
 * Orchestrateur de toute l'animation scroll de la home cinématique
 * (Lenis + ScrollTrigger). Reveal au scroll (.reveal-text) et parallax
 * images (.project-item) — génériques par classe, n'importe quel
 * nouveau composant de la home peut s'y accrocher sans toucher ce
 * fichier. (Le thème clair/sombre dynamique par section a été retiré :
 * un seul fond marron sur tout le site désormais, plus d'alternance.)
 * À appeler une seule fois (voir <ScrollFX />).
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

    // ── Reveal "above-intro" / -1 / -2 / -3 : remplacés par <RainbowText />
    // (voir components/RainbowText.tsx), qui enregistre son propre
    // ScrollTrigger par instance — plus besoin de les piloter ici.

    // ── Reveal générique — reprend le seul mécanisme de reveal des 5
    // maquettes HTML : gsap.from(y:40, opacity:0) au scroll, appliqué à
    // TOUT ce qui porte .reveal-text (titres compris — pas de traitement
    // "3D split" séparé pour les headings, la maquette n'en a pas).
    gsap.utils.toArray<HTMLElement>('.reveal-text').forEach((el) => {
      gsap.from(el, {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      })
    })

    // ── Parallax images — grille "Nos Lapins" ────────────────────────
    gsap.utils.toArray<HTMLElement>('.project-item img').forEach((img) => {
      gsap.fromTo(img, { yPercent: -15 }, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.project-item') as HTMLElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    // ── Attend les polices avant de recalculer les zones de déclenchement
    // Tous les ScrollTrigger créés plus haut (.reveal-text, thème
    // dynamique, parallax images — et ceux, indépendants, de chaque
    // <RainbowText />) le sont avant que la police body (Space Grotesk)
    // ait fini de charger — le texte change de hauteur au chargement de
    // la police, ce qui décale leur zone de déclenchement. Sur desktop
    // l'écart passe souvent inaperçu ; sur mobile (viewport plus petit,
    // wrapping différent) le trigger se retrouve hors-zone et le reveal
    // ne se voit plus du tout. Un refresh une fois tout stabilisé
    // recalcule tous les ScrollTrigger de la page sur le layout final.
    document.fonts.ready.then(() => {
      if (!cancelled) {
        // Lenis a lui aussi mis en cache la hauteur totale scrollable
        // AVANT le reflow des polices — sur mobile, où le wrapping
        // change beaucoup plus la hauteur (texte réparti sur bien plus
        // de lignes qu'en desktop), ce cache devient assez faux pour que
        // le mapping scroll→progress de Lenis ne colle plus avec les
        // zones que ScrollTrigger vient de recalculer. On resync Lenis
        // d'abord. Et un simple rAF ne garantit pas toujours que le
        // reflow est déjà peint au moment où il tourne (plus vrai sur
        // mobile, pipeline de rendu plus lent) — un double rAF attend
        // une frame de plus, et le setTimeout en filet de secours
        // couvre les cas où même ça arrive trop tôt.
        lenis.resize()
        requestAnimationFrame(() => {
          requestAnimationFrame(() => ScrollTrigger.refresh())
        })
        setTimeout(() => {
          lenis.resize()
          ScrollTrigger.refresh()
        }, 800)
      }
    })

    const onWindowLoad = () => {
      lenis.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('load', onWindowLoad)
    cleanupFns.push(() => window.removeEventListener('load', onWindowLoad))

    return () => {
      cancelled = true
      document.documentElement.classList.remove('lp-home-active')
      cleanupFns.forEach((fn) => fn())
      gsap.ticker.remove(tickLenis)
      lenis.destroy()
    }
  }, [])
}
