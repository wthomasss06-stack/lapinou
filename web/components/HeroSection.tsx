'use client'
import { useEffect, useRef, useState } from 'react'
import RainbowText from './RainbowText'

// HERO — plein écran, volontairement épuré : vidéo + titre + sous-titre.
// Stats et cartes tarifs retirées (elles créaient un hero à rallonge qui
// débordait du premier écran) — la preuve sociale et les tarifs vivent
// juste en dessous, dans <TrustMarquee /> (3 bandes défilantes), visibles
// dès qu'on scrolle d'un cran.
const SLIDES = [
  '/IMAGES/Snapchat-1680052335_001.webm',
  '/IMAGES/Snapchat-1344115952_001.webm',
  '/IMAGES/Snapchat-1448875183_001.webm',
]

export default function HeroSection() {
  const [cur, setCur] = useState(0)
  const vidRefs = useRef<(HTMLVideoElement | null)[]>([])
  const curRef = useRef(0)
  const busy = useRef(false)

  useEffect(() => { curRef.current = cur }, [cur])
  useEffect(() => { vidRefs.current[0]?.play().catch(() => {}) }, [])

  const goTo = (n: number) => {
    if (busy.current || n === curRef.current) return
    busy.current = true
    vidRefs.current[curRef.current]?.pause()
    const v = vidRefs.current[n]
    if (v) { v.currentTime = 0; v.play().catch(() => {}) }
    setCur(n)
    busy.current = false
  }

  return (
    <section className="hero-section" id="hero">
      {SLIDES.map((src, i) => (
        <div key={src} className="hero-video-slide" style={{ zIndex: i === cur ? 1 : 0, opacity: i === cur ? 1 : 0 }}>
          <video
            ref={(el) => { vidRefs.current[i] = el }}
            src={src}
            muted
            playsInline
            preload={i === 0 ? 'auto' : 'metadata'}
            onEnded={() => { if (i === curRef.current) goTo((i + 1) % SLIDES.length) }}
            className="hero-video"
          />
        </div>
      ))}
      <div className="hero-scrim" />

      <div className="title-container">
        <div className="title-small">Chez</div>
        <h1 className="title-main">FLORENCE</h1>
      </div>

      <RainbowText
        text="Des lapins de race élevés avec soin, disponibles pour particuliers, restaurateurs & éleveurs PME. Élevage artisanal · Abidjan, Côte d'Ivoire."
        variant="white"
        className="hero-sub"
        immediate
      />

      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="hero-dot"
            style={{ width: i === cur ? '28px' : '8px', backgroundColor: i === cur ? 'var(--rust)' : 'rgba(243,233,218,0.3)' }}
            aria-label={`Diapositive ${i + 1}`}
          />
        ))}
      </div>

      <div className="hero-scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
