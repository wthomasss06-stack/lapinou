'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import './HoverFadeText.css'

gsap.registerPlugin(useGSAP, SplitText)

// Micro-interaction sitewide — port de la variante "06 // V-FADE-X — Smooth
// X Fade" de PROOOtypography-hover-12-variants.html. Différence avec la
// démo : les deux "mots" (wordA/wordB) portent le MÊME texte au lieu de
// deux mots différents — au survol le libellé glisse/s'efface vers la
// droite pendant qu'une copie identique arrive de la gauche ; au
// mouseleave le timeline rejoue en reverse() pour un aller-retour
// symétrique, exactement comme dans le fichier d'origine.
// Les deux copies sont aria-hidden, le libellé accessible vit sur le
// wrapper (évite la double lecture par un lecteur d'écran).
interface Props {
  children: string
  className?: string
}

export default function HoverFadeText({ children, className = '' }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const wordA = wrap.querySelector<HTMLElement>('.hfx-a')
    const wordB = wrap.querySelector<HTMLElement>('.hfx-b')
    if (!wordA || !wordB) return

    const splitA = SplitText.create(wordA, { type: 'chars' })
    const splitB = SplitText.create(wordB, { type: 'chars' })
    gsap.set(splitB.chars, { autoAlpha: 0 })

    const dur = 0.35
    const stag = 0.025

    const tl = gsap.timeline({ paused: true })
    tl.to(splitA.chars, { x: 30, autoAlpha: 0, duration: dur, stagger: stag, ease: 'power2.in' }, 0)
      .fromTo(splitB.chars, { x: -30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: dur, stagger: stag, ease: 'power2.out' }, dur * 0.5)

    const onEnter = () => tl.play()
    const onLeave = () => tl.reverse()
    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mouseleave', onLeave)
      splitA.revert()
      splitB.revert()
    }
  }, [children])

  return (
    <span className={`hfx-wrap ${className}`.trim()} ref={wrapRef} aria-label={children}>
      <span className="hfx-word hfx-a" aria-hidden="true">{children}</span>
      <span className="hfx-word hfx-b" aria-hidden="true">{children}</span>
    </span>
  )
}
