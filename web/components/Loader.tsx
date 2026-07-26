'use client'
import { useState, useLayoutEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import Image from 'next/image'

gsap.registerPlugin(useGSAP, SplitText)

// Refonte fidèle à la variante « 5. Gravité » de gemini-code-1784715349867.html
// (telle que le fichier la définit, images + logo réels compris), en 3
// phases séquentielles comme l'original (preloader → intro → hero) :
//   1. Préchargement : titre "Chez" / "Florence" sur deux lignes (comme
//      le grand lettrage du footer) + compteur 000→100, sur fond plein.
//      Une fois terminé, glisse vers le haut (expo.inOut).
//   2. Intro "Gravité" — reprise à l'identique du bloc `case 5` : 4 bandes
//      de rideau se déploient en rebond (bounce.out), les 5 lapins
//      tombent du haut de l'écran (y:-50vh, scale initial 0 comme dans
//      resetDOM()) et atterrissent en rebond élastique (elastic.out(1,0.5))
//      à leurs 5 positions (4 coins + 1 en haut au centre), logo Chez
//      Florence qui apparaît en élastique (elastic.out(1,0.6)), pause de
//      1.2s, puis sortie identique au fichier source : items + logo dans
//      le même tween, scale 3 + rotation +180 + fade, stagger 0.05,
//      power2.in.
//   3. Rideau (#loader) qui remonte pour révéler le Hero, simplement.
// Garde la logique "une fois par session" (sessionStorage) de l'ancienne
// version.
const LOADER_SEEN_KEY = 'lapinou_loader_seen'

// Ordre + rôles repris tels quels du fichier de référence (intro-item-1 à
// 5) : chaque lapin est assigné à une position précise de itemTargets.
const BUNNIES = [
  { src: '/IMAGES/loader/bunny-purple.webp' }, // item 1 — haut-gauche
  { src: '/IMAGES/loader/bunny-amber.webp' },  // item 2 — haut-droite
  { src: '/IMAGES/loader/bunny-rust.webp' },   // item 3 — bas-gauche
  { src: '/IMAGES/loader/bunny-red.webp' },    // item 4 — bas-droite
  { src: '/IMAGES/loader/bunny-marble.png' }, // item 5 — haut-centre
]

// Positions cibles — reprises telles quelles de itemTargets dans
// gemini-code-1784715349867.html (5ème élément placé en haut au centre).
const ITEM_TARGETS = [
  { x: '-26vw', y: '-30vh', rotation: -20 },
  { x: '28vw', y: '-25vh', rotation: 15 },
  { x: '-30vw', y: '28vh', rotation: 12 },
  { x: '22vw', y: '26vh', rotation: -15 },
  { x: '0vw', y: '-38vh', rotation: 5 },
]

export default function Loader() {
  // Doit être identique au 1er rendu serveur et client (sessionStorage
  // n'existe pas côté serveur) — on démarre à false puis on resynchronise
  // juste après, avant peinture, pour qu'un retour dans la même session
  // ne montre jamais le loader à l'écran.
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
      const revealers = gsap.utils.toArray<HTMLElement>('.loader-revealer')
      const items = gsap.utils.toArray<HTMLElement>('.loader-item')
      const titleSplit = SplitText.create('#loader-title', { type: 'chars' })
      const counterEl = document.querySelector<HTMLElement>('#loader-counter')

      gsap.set(titleSplit.chars, { yPercent: 100 })
      gsap.set('#loader-counter', { yPercent: 100 })
      gsap.set(revealers, { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' })
      gsap.set(items, { xPercent: -50, yPercent: -50, y: '-50vh', x: (i: number) => ITEM_TARGETS[i].x, scale: 0, rotation: 0 })
      gsap.set('.loader-logo', { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 })

      const tl = gsap.timeline({ delay: 0.3 })

      // --- Phase 1 : préchargement (titre + compteur) ---
      tl.to(titleSplit.chars, {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: { each: 0.05, from: 'random' },
      })
      tl.to('#loader-counter', {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        onStart: () => {
          const counter = { value: 0 }
          gsap.to(counter, {
            value: 100,
            duration: 1.6,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (counterEl) counterEl.textContent = String(Math.round(counter.value)).padStart(3, '0')
            },
          })
        },
      }, '<')

      // Le bloc "préchargement" glisse vers le haut et disparaît.
      tl.to('#loader-pre', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=1.7')
      tl.set('#loader-pre', { display: 'none' })

      // --- Phase 2 : "Gravité" (rideau + 5 lapins + logo) ---
      tl.to(revealers, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1,
        stagger: 0.2,
        ease: 'bounce.out',
      })
      tl.set(revealers, { display: 'none' })

      items.forEach((item, i) => {
        tl.to(item, {
          y: ITEM_TARGETS[i].y,
          scale: 1,
          rotation: ITEM_TARGETS[i].rotation,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
        }, i === 0 ? '-=0.2' : '<0.1')
      })

      tl.to('.loader-logo', {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.6)',
      }, '-=1.2')

      tl.to({}, { duration: 1.2 })

      // Sortie — reprise à l'identique de case 5 : items ET logo dans le
      // même tween (même stagger group), scale 3 + fade + rotation +180.
      tl.to('.loader-item, .loader-logo', {
        scale: 3,
        opacity: 0,
        rotation: '+=180',
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.in',
      })

      // --- Phase 3 : révélation du Hero, simplement ---
      tl.to('#loader', {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.9,
        ease: 'power3.inOut',
      }, '+=0.15')

      tl.call(() => {
        if (!cancelled) {
          setDone(true)
          try { sessionStorage.setItem(LOADER_SEEN_KEY, '1') } catch (_) {}
        }
      })
    })

    document.fonts.ready.then(() => {
      if (!cancelled) start()
    })

    return () => { cancelled = true }
  }, [])

  if (done) return null

  return (
    <div id="loader">
      <div id="loader-pre">
        <div className="loader-title-row">
          <h1 id="loader-title">
            <span className="loader-title-line">Chez</span>
            <span className="loader-title-line">Florence</span>
          </h1>
          <div className="loader-counter-wrap">
            <span id="loader-counter">000</span>
          </div>
        </div>
      </div>

      <div className="loader-revealer loader-revealer-1" />
      <div className="loader-revealer loader-revealer-2" />
      <div className="loader-revealer loader-revealer-3" />
      <div className="loader-revealer loader-revealer-4" />

      <div className="loader-items">
        {BUNNIES.map((b, i) => (
          <div className="loader-item" key={i}>
            <Image src={b.src} alt="" fill sizes="220px" style={{ objectFit: 'contain' }} />
          </div>
        ))}
      </div>

      <div className="loader-logo">
        <Image src="/logo.webp" alt="Chez Florence" fill sizes="160px" style={{ objectFit: 'contain' }} />
      </div>
    </div>
  )
}
