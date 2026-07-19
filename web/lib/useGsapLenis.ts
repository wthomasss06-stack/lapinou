'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)
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

    // ── Thème dynamique 2 couleurs (maroon/rust) ──────────────────────
    // Port de dynamic_theming_matrix_v2.html : chaque section porte
    // data-theme="maroon|rust", un ScrollTrigger par section bascule
    // --current-bg/--current-text sur .home-cinema quand son centre
    // traverse le milieu du viewport. Changement atomique de variables
    // CSS uniquement (setProperty) — zéro reflow, la transition douce
    // vient du CSS (.home-cinema { transition: background-color … }),
    // pas de la boucle scroll. Posé sur .home-cinema (pas documentElement)
    // pour rester scopé à la home.
    const homeRoot = document.querySelector<HTMLElement>('.home-cinema')
    if (homeRoot) {
      const applyMatrix = (theme: string) => {
        if (theme === 'rust') {
          homeRoot.style.setProperty('--current-bg', 'var(--rust)')
          homeRoot.style.setProperty('--current-text', 'var(--ink)')
          homeRoot.style.setProperty('--current-accent', 'var(--maroon)')
        } else {
          homeRoot.style.setProperty('--current-bg', 'var(--maroon)')
          homeRoot.style.setProperty('--current-text', 'var(--paper)')
          homeRoot.style.setProperty('--current-accent', 'var(--rust)')
        }
      }
      homeRoot.querySelectorAll<HTMLElement>('[data-theme]').forEach((section) => {
        const theme = section.dataset.theme
        if (!theme) return
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => applyMatrix(theme),
          onEnterBack: () => applyMatrix(theme),
        })
      })
    }

    // ── Attend les polices avant de recalculer les zones de déclenchement
    // Tous les ScrollTrigger créés plus haut (.reveal-text, thème
    // dynamique maroon/rust, parallax images — et ceux, indépendants, de
    // chaque <RainbowText />) le sont avant que la police body (Space Grotesk)
    // ait fini de charger — le texte change de hauteur au chargement de
    // la police, ce qui décale leur zone de déclenchement. Sur desktop
    // l'écart passe souvent inaperçu ; sur mobile (viewport plus petit,
    // wrapping différent) le trigger se retrouve hors-zone et le reveal
    // ne se voit plus du tout. Un refresh une fois tout stabilisé
    // recalcule tous les ScrollTrigger de la page sur le layout final.
    document.fonts.ready.then(() => {
      if (!cancelled) {
        // ── Titres "élastiques" — port de chez_florence_redesign.html :
        // mêmes valeurs que le reveal d'entrée du titre "FLORENCE" du
        // Hero (y:60→0, scale:0.5→1, opacity:0→1, elastic.out(0.75,0.3),
        // stagger 0.015), mais déclenché au scroll plutôt qu'au montage
        // — pour Notre Histoire / Nos Garanties / Nos Lapins / Footer.
        gsap.utils.toArray<HTMLElement>('.elastic-title').forEach((heading) => {
          const split = SplitText.create(heading, { type: 'chars', charsClass: 'hero-char' })
          gsap.set(split.chars, { y: 60, opacity: 0, scale: 0.5 })
          gsap.to(split.chars, {
            y: 0, opacity: 1, scale: 1,
            duration: 1.3,
            stagger: 0.015,
            ease: 'elastic.out(0.75, 0.3)',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          })
        })

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
