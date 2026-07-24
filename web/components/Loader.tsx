'use client'
import { useState, useLayoutEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import Image from 'next/image'

gsap.registerPlugin(useGSAP, SplitText)

// Séquence d'entrée — chorégraphie portée de la variante « 5. Gravité »
// de gemini-code-1784715349867.html : les cartes tombent du haut de
// l'écran et atterrissent en rebond élastique (au lieu de scale+clip-path
// sur place), titre "FLORENCE" en reveal caractère par caractère, compteur
// 000→100 posé à côté du titre, sortie où les cartes continuent leur
// chute (accélération type gravité) au lieu de rétrécir sur place, puis
// rideau (clip-path) qui remonte pour révéler le Hero.
// Garde la logique "une fois par session" (sessionStorage) de l'ancienne
// version — pas de raison de la perdre en changeant l'habillage visuel.
const LOADER_SEEN_KEY = 'lapinou_loader_seen'

const CARDS = [
  { kind: 'photo', src: '/IMAGES/Snapchat-908462874.webp', rotate: 7 },
  { kind: 'photo', src: '/IMAGES/Snapchat-956074945.webp', rotate: -3 },
  { kind: 'photo', src: '/IMAGES/Snapchat-1016404691.webp', rotate: -9 },
  { kind: 'photo', src: '/IMAGES/Snapchat-1244423645.webp', rotate: 5 },
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
      const cards = gsap.utils.toArray<HTMLElement>('.loader-card')
      const titleSplit = SplitText.create('#loader-title', { type: 'chars' })
      const counterEl = document.querySelector<HTMLElement>('#loader-counter')

      // xPercent/yPercent recentrent la carte (remplace le translate(-50%,-50%)
      // qui vivait avant dans la CSS) — GSAP doit posséder tout le transform
      // pour composer la chute (y) et la rotation d'atterrissage sans écraser
      // le centrage. Chaque carte démarre au-dessus de l'écran, légèrement
      // réduite, prête à "tomber".
      gsap.set(cards, { xPercent: -50, yPercent: -50, y: '-70vh', rotation: 0, scale: 0.72 })
      gsap.set(titleSplit.chars, { yPercent: 100 })
      gsap.set('#loader-counter', { yPercent: 100 })

      const tl = gsap.timeline({ delay: 0.3 })

      // Chute + atterrissage élastique (variante "5. Gravité") : chaque
      // carte tombe du haut de l'écran et rebondit sur sa position finale.
      tl.to(cards, {
        y: 0,
        scale: 1,
        rotation: (i: number) => CARDS[i]?.rotate ?? 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.55)',
        stagger: 0.12,
      })

      tl.to(titleSplit.chars, {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: { each: 0.05, from: 'random' },
      }, '<0.4')

      tl.to('#loader-counter', {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
        onStart: () => {
          const counter = { value: 0 }
          gsap.to(counter, {
            value: 100,
            duration: 1.9,
            delay: 0.3,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counterEl) counterEl.textContent = String(Math.round(counter.value)).padStart(3, '0')
            },
          })
        },
      }, '<')

      // Sortie : le texte descend (au lieu de remonter) pour rester dans la
      // logique "gravité" ; les cartes ne rétrécissent plus sur place, elles
      // continuent leur chute et accélèrent, comme si rien ne les retenait.
      tl.to('#loader-counter', { yPercent: 100, duration: 0.6, ease: 'power3.in' }, '+=2.1')
      tl.to(titleSplit.chars, {
        yPercent: 100,
        duration: 0.6,
        ease: 'power3.in',
        stagger: { each: 0.04, from: 'random' },
      }, '<')

      tl.to(cards, {
        y: '+=70vh',
        rotation: '+=25',
        opacity: 0,
        duration: 0.9,
        ease: 'power2.in',
        stagger: -0.06,
      }, '<0.1')

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
      <div className="loader-cards">
        {CARDS.map((c, i) => (
          <div className="loader-card" key={i}>
            {c.kind === 'photo' ? (
              <Image src={c.src!} alt="" fill sizes="220px" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="loader-card-solid" style={{ background: c.bg }}>
                <Image src="/logo-icon.png" alt="" width={44} height={44} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="loader-title-row">
        <h1 id="loader-title">FLORENCE</h1>
        <div className="loader-counter-wrap">
          <span id="loader-counter">000</span>
        </div>
      </div>
    </div>
  )
}
