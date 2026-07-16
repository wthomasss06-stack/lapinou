'use client'
import { useState, useLayoutEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, SplitText)

// Séquence d'entrée : compteur 0→100%, ligne qui se dessine, colonnes
// ("stairs") qui remontent, puis on démonte le loader. Le hero (slider
// vidéo) gère sa propre apparition — le loader ne fait plus que le
// masquer le temps du chargement, comme un rideau générique.
//
// Ne joue qu'UNE SEULE fois par session (sessionStorage) : revenir sur
// "/" en navigation interne, ou recharger la home plusieurs fois dans
// le même onglet, ne rejoue plus l'intro — seul un nouvel onglet/session
// la remontre.
const LOADER_SEEN_KEY = 'lapinou_loader_seen'

export default function Loader() {
  // IMPORTANT : cette valeur doit être identique au premier rendu serveur
  // ET au premier rendu client, sinon React lève une erreur d'hydratation
  // (le serveur n'a jamais accès à sessionStorage, donc il rendrait
  // toujours false — lire sessionStorage ici dans l'initializer du
  // useState faisait diverger le client dès le premier rendu si le
  // loader avait déjà été vu). On démarre donc toujours à false, et on
  // resynchronise avec sessionStorage juste après, en layout effect
  // (avant peinture), pour qu'un retour dans la même session saute le
  // loader sans qu'il ne soit jamais visible à l'écran.
  const [done, setDone] = useState(false)

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(LOADER_SEEN_KEY) === '1') setDone(true)
    } catch (_) {}
  }, [])

  useGSAP((_context, contextSafe) => {
    if (!contextSafe || done) return
    let cancelled = false

    const start = contextSafe(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => initLoader())
      mm.add('(max-width: 767px)', () => initLoader())

      function initLoader() {
        const counterEl = document.querySelector<HTMLElement>('#loader-counter')
        const stairs = document.querySelectorAll('#loader .stair')
        const line2 = document.querySelector<SVGLineElement>('#loader-line line')
        if (!counterEl || !line2) return

        const length2 = line2.getTotalLength()
        const counter = { value: 0 }

        gsap.set(line2, { strokeDasharray: length2, strokeDashoffset: length2 })
        gsap.set('#loader-line', { scaleX: -1, transformOrigin: 'center' })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.to(counter, {
          value: 100,
          duration: 2.2,
          ease: 'sine.out',
          onUpdate: () => {
            counterEl.textContent = `${Math.floor(counter.value)}%`
          },
        }, 'start')

        tl.to(line2, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: 'none',
        }, 'start')

        tl.call(() => {
          const split = new SplitText(counterEl, { type: 'chars' })
          gsap.to(split.chars, {
            xPercent: 80,
            autoAlpha: 0,
            stagger: { amount: 0.35, from: 'end' },
            duration: 0.8,
            ease: 'expo.inOut',
          })
        }, null, 'start+=2.25')

        tl.to(line2, {
          autoAlpha: 0,
          duration: 0.45,
          ease: 'sine.out',
        }, 'start+=2.4')

        tl.to(stairs, {
          y: '-110%',
          duration: 1.25,
          stagger: { amount: 0.4, from: 'center' },
          ease: 'power3.inOut',
        }, 'start+=2.7')

        tl.call(() => {
          if (!cancelled) {
            setDone(true)
            try { sessionStorage.setItem(LOADER_SEEN_KEY, '1') } catch (_) {}
          }
        }, null, 'start+=3.6')
      }
    })

    document.fonts.ready.then(() => {
      if (!cancelled) start()
    })

    return () => {
      cancelled = true
    }
  }, [])

  if (done) return null

  return (
    <div id="loader">
      {Array.from({ length: 10 }).map((_, i) => (
        <div className="stair" key={i} />
      ))}
      <div id="loader-counter">0%</div>
      <svg id="loader-line" width="97%" height="4" viewBox="0 0 1000 2" preserveAspectRatio="none">
        <line x1="0" y1="1" x2="1000" y2="1" stroke="var(--border)" strokeWidth={50} strokeLinecap="round" />
      </svg>
    </div>
  )
}
