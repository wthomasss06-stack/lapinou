'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

// ── Seuls 4 webm disponibles dans /IMAGES :
//    Snapchat-1268559920.webm   3.1 MB
//    Snapchat-1680052335.webm   3.6 MB
//    Snapchat-2076662897.webm   4.9 MB
//    Snapchat-888968271.webm    2.0 MB  ← réservé pour BlobSection
const SLIDES = [
  {
    src: '/IMAGES/Snapchat-1680052335.webm',
    eyebrow: "Abidjan · Côte d'Ivoire — Élevage artisanal",
    h1: 'Élevage',
    h2: 'Artisanal',
    sub: 'Des lapins de race élevés avec soin, disponibles pour particuliers, restaurateurs & éleveurs PME.',
  },
  {
    src: '/IMAGES/Snapchat-2076662897.webm',
    eyebrow: 'Restaurateurs · Traiteurs · Gastronomie',
    h1: 'Pour votre',
    h2: 'Table',
    sub: 'Approvisionnement régulier, qualité bouchère garantie. Livraison sur Abidjan et ses environs.',
  },
  {
    src: '/IMAGES/Snapchat-1268559920.webm',
    eyebrow: 'Réservation en ligne · Confirmation 24h',
    h1: 'Réservez',
    h2: 'En ligne',
    sub: 'Choisissez votre race et votre quantité. Nous vous contactons par email et WhatsApp.',
  },
]

export default function HeroSection() {
  const [cur, setCur]         = useState(0)
  const [nextIdx, setNextIdx] = useState<number | null>(null)

  const nextRef   = useRef<HTMLDivElement>(null)
  const vidRefs   = useRef<(HTMLVideoElement | null)[]>([])
  const progRef   = useRef<HTMLDivElement>(null)
  const busy      = useRef(false)
  const curRef    = useRef(0)

  useEffect(() => { curRef.current = cur }, [cur])

  // Barre de progression — se relance à chaque changement de slide
  useEffect(() => {
    let raf: number
    const tick = () => {
      const v = vidRefs.current[cur]
      if (v && progRef.current && v.duration > 0) {
        progRef.current.style.width = `${(v.currentTime / v.duration) * 100}%`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [cur])

  // Auto-play de la première vidéo
  useEffect(() => { vidRefs.current[0]?.play().catch(() => {}) }, [])

  const goTo = async (n: number) => {
    if (busy.current || n === curRef.current) return
    busy.current = true
    if (progRef.current) progRef.current.style.width = '0%'
    vidRefs.current[curRef.current]?.pause()

    setNextIdx(n)
    await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())))

    const el = nextRef.current
    if (el) {
      // ── Diagonal wipe — Effect 9 ──────────────────────────────
      el.style.transition = 'none'
      el.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)'
      el.getBoundingClientRect()

      el.style.transition = 'clip-path 0.55s cubic-bezier(0.77,0,0.175,1)'
      el.style.clipPath = 'polygon(0 0, 68% 0, 42% 100%, 0 100%)'
      await new Promise<void>(r => setTimeout(r, 550))

      el.style.transition = 'clip-path 0.35s cubic-bezier(0.25,0.46,0.45,0.94)'
      el.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
      await new Promise<void>(r => setTimeout(r, 350))
    }

    const v = vidRefs.current[n]
    if (v) { v.currentTime = 0; v.play().catch(() => {}) }

    setCur(n)
    setNextIdx(null)
    busy.current = false
  }

  const s = SLIDES[cur]

  return (
    <section className="relative h-screen overflow-hidden bg-black" style={{ minHeight: 560 }}>

      {/* Barres cinéma haut/bas */}
      <div className="absolute inset-x-0 top-0 h-[5.5vh] bg-black z-20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[5.5vh] bg-black z-20 pointer-events-none" />

      {/* Toutes les slides empilées */}
      {SLIDES.map((sl, i) => (
        <div key={i} className="absolute inset-0" style={{ zIndex: i === cur ? 2 : 1 }}>
          <video
            ref={el => { vidRefs.current[i] = el }}
            src={sl.src}
            muted playsInline
            preload={i === 0 ? 'auto' : 'metadata'}
            onEnded={() => { if (i === curRef.current) goTo((i + 1) % SLIDES.length) }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent" />
        </div>
      ))}

      {/* Slide entrante (wipe diagonal) */}
      {nextIdx !== null && (
        <div ref={nextRef} className="absolute inset-0" style={{ zIndex: 3 }}>
          <video src={SLIDES[nextIdx].src} muted playsInline autoPlay
            className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent" />
        </div>
      )}

      {/* Contenu héro */}
      <div className="absolute inset-0 z-10 flex items-end px-8 sm:px-12 lg:px-[2.5vw] pb-[14vh]">
        <div>
          <p key={`e-${cur}`} className="text-[0.68rem] tracking-[0.35em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-label)', color: 'var(--rust)' }}>
            {s.eyebrow}
          </p>
          <h1 key={`h-${cur}`} className="font-bold text-white leading-[0.88] tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,9vw,120px)' }}>
            {s.h1}<br /><em className="italic text-white/80">{s.h2}</em>
          </h1>
          <p key={`s-${cur}`} className="mt-6 text-white/45 font-light leading-relaxed max-w-sm"
            style={{ fontSize: 'clamp(13px,1vw,15px)' }}>
            {s.sub}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/rabbits" className="btn-neon px-6 py-3 rounded-xl text-sm font-semibold">
              Voir le catalogue
            </Link>
            {process.env.NEXT_PUBLIC_WHATSAPP && (
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP.replace(/\D/g,'')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-white/[0.07] border border-white/[0.12] backdrop-blur-sm hover:bg-white/[0.13] transition-colors">
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Dots + compteur */}
      <div className="absolute right-[2.5vw] bottom-[14vh] z-10 hidden sm:flex flex-col items-end gap-3">
        <span className="text-[0.6rem] tracking-[0.2em] text-white/25" style={{ fontFamily: 'var(--font-label)' }}>
          0{cur + 1}&nbsp;/&nbsp;0{SLIDES.length}
        </span>
        <div className="flex flex-col gap-[6px]">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
              className="rounded-full transition-all duration-500"
              style={{ width: 2, height: i === cur ? 48 : 18,
                background: i === cur ? 'var(--rust)' : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>
      </div>

      <span className="absolute left-[2.5vw] bottom-[9vh] z-10 text-[0.6rem] tracking-[0.3em] uppercase text-white/20 hidden sm:block"
        style={{ fontFamily: 'var(--font-label)', writingMode: 'vertical-rl' }}>
        Défiler
      </span>

      <div ref={progRef} className="absolute bottom-[5.5vh] left-0 z-[25] h-px"
        style={{ width: '0%', background: 'var(--rust)' }} />
    </section>
  )
}
