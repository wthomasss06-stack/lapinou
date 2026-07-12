'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { gsap } from 'gsap'

const SLIDES = [
  {
    src: '/IMAGES/Snapchat-1680052335_001.webm',
    eyebrow: "Abidjan · Côte d'Ivoire — Élevage artisanal",
    word1: 'ÉLEVAGE',
    word2: 'ARTISANAL',
    word3: 'avec soin.',
    sub: 'Des lapins de race élevés avec soin, disponibles pour particuliers, restaurateurs & éleveurs PME.',
  },
  {
    src: '/IMAGES/Snapchat-1344115952_001.webm',
    eyebrow: ' Restaurateurs & traiteurs — Tarif pro',
    word1: '6 LAPINS',
    word2: 'À 80k FCFA',
    word3: 'qualité bouchère.',
    sub: 'Qualité bouchère garantie. Approvisionnement régulier, livraison sur Abidjan. 13 300 FCFA/lapin en lot pro.',
  },
  {
    src: '/IMAGES/Snapchat-1448875183_001.webm',
    eyebrow: ' Stock limité — Confirmation sous 24h',
    word1: 'COMMANDEZ',
    word2: 'VITE',
    
    sub: '3 formats : Unité 15 000 FCFA · Duo 25 000 FCFA · Pro 80 000 FCFA. WhatsApp ou formulaire — réponse garantie.',
  },
]

export default function HeroSection() {
  const [cur, setCur] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const blocksRef = useRef<(HTMLSpanElement | null)[]>([])
  const vidRefs = useRef<(HTMLVideoElement | null)[]>([])
  const progRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const curRef = useRef(0)

  useEffect(() => { curRef.current = cur }, [cur])

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

  useEffect(() => { vidRefs.current[0]?.play().catch(() => {}) }, [])

  const goTo = (n: number) => {
    if (busy.current || n === curRef.current) return
    busy.current = true
    if (progRef.current) progRef.current.style.width = '0%'
    vidRefs.current[curRef.current]?.pause()

    const v = vidRefs.current[n]
    if (v) { 
      v.currentTime = 0
      v.play().catch(() => {}) 
    }

    setCur(n)
    busy.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const xPercent = (e.clientX - rect.left) / rect.width - 0.5
    const yPercent = (e.clientY - rect.top) / rect.height - 0.5

    blocksRef.current.forEach((block, idx) => {
      if (!block) return
      const depth = (idx + 1) * 18
      gsap.to(block, {
        x: xPercent * depth,
        y: yPercent * depth,
        duration: 0.4,
        ease: 'power1.out'
      })
    })
  }

  const s = SLIDES[cur]

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-[#050505] flex flex-col justify-between overflow-hidden select-none max-[899px]:pt-20"
      style={{ height: '100svh' }}
    >
      {/* Background Videos en COULEUR réelle */}
      {SLIDES.map((sl, i) => (
        <div 
          key={i} 
          className="absolute inset-0 transition-opacity duration-700 ease-in-out" 
          style={{ zIndex: i === cur ? 1 : 0, opacity: i === cur ? 1 : 0 }}
        >
          <video
            ref={el => { vidRefs.current[i] = el }}
            src={sl.src}
            muted playsInline
            preload={i === 0 ? 'auto' : 'metadata'}
            onEnded={() => { if (i === curRef.current) goTo((i + 1) % SLIDES.length) }}
            className="absolute inset-0 w-full h-full object-cover opacity-65" 
          />
          {/* Overlay dégradé subtil pour garder le contraste avec le texte */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/80" />
        </div>
      ))}

      {/* Trame Grid Brutaliste */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 h-full w-full pointer-events-none opacity-15 z-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border-r border-neutral-800 h-full" />
        ))}
      </div>

      

      {/* Corps Central Typographique */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 relative z-20 flex flex-col gap-3 my-auto">
        <div className="flex items-center gap-4 flex-wrap">
          <span 
            ref={el => { blocksRef.current[0] = el }}
            className="font-black bg-white text-black px-5 py-2 rotate-[-1deg] inline-block tracking-tight text-[clamp(1.75rem,min(7vw,9vh),4.5rem)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {s.word1}
          </span>
          <span 
            ref={el => { blocksRef.current[1] = el }}
            className="text-xs text-neutral-200 max-w-[240px] leading-relaxed font-mono hidden sm:block bg-black/40 backdrop-blur-sm p-2 rounded border border-white/5"
          >
            {s.sub}
          </span>
        </div>

        <div className="flex items-center justify-end gap-4 mt-1">
          <span className="w-full h-[1px] bg-neutral-800 flex-1 hidden md:block"></span>
          <span 
            ref={el => { blocksRef.current[2] = el }}
            className="font-black border-4 px-5 py-2 rotate-[1.5deg] inline-block tracking-tight text-[clamp(1.75rem,min(7vw,9vh),4.5rem)]"
            style={{ 
              fontFamily: 'var(--font-display)',
              borderColor: 'var(--lime, #00ff00)', 
              color: 'var(--lime, #00ff00)' 
            }}
          >
            {s.word2}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-1">
          <span 
            ref={el => { blocksRef.current[3] = el }}
            className="text-white italic lowercase tracking-tight text-[clamp(2rem,min(8vw,10vh),5.5rem)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {s.word3}
          </span>
        </div>

        {/* Boutons d'actions (Centrés) */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-6 z-30 w-full">
          <Link href="/rabbits" className="btn-neon px-6 py-3 rounded-xl text-sm font-semibold">
            Voir le catalogue
          </Link>
          {process.env.NEXT_PUBLIC_WHATSAPP && (
            <a 
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP.replace(/\D/g,'')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-white/[0.08] border border-white/[0.15] backdrop-blur-md hover:bg-white/[0.18] transition-colors"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Navigation Bas */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-8 flex justify-between items-center">
       
        
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ 
                width: i === cur ? '32px' : '8px', 
                backgroundColor: i === cur ? 'var(--lime, #00ff00)' : 'rgba(255,255,255,0.2)' 
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div 
        ref={progRef} 
        className="absolute bottom-0 left-0 z-[25] h-[2px] transition-all duration-100"
        style={{ width: '0%', background: 'var(--lime, #00ff00)' }} 
      />
    </section>
  )
}