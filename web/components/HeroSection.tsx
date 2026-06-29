'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, ChevronRight } from 'lucide-react'
import { analyticsApi } from '@/lib/api'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

// ─── Slides plein écran — inspiré du carrousel Hero de Nexura ────────────────
const SLIDES = [
  {
    eyebrow: "Élevage · Côte d'Ivoire",
    title: 'Adoptez',
    titleItalic: 'en toute confiance.',
    sub: "Chaque lapin est suivi par un vétérinaire avant de rejoindre votre foyer. Vous échangez directement avec l'éleveur, sans intermédiaire.",
    img: 'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=1800&q=80',
  },
  {
    eyebrow: 'Bélier nain · Rex · Angora français',
    title: 'Choisissez',
    titleItalic: 'le compagnon idéal.',
    sub: "Plusieurs races disponibles à Abidjan. Photos réelles, prix nets affichés, aucune surprise.",
    img: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=1800&q=80',
  },
  {
    eyebrow: 'Réservation simple · Abidjan',
    title: 'Réservez',
    titleItalic: 'puis on échange.',
    sub: "Remplissez le formulaire en 1 minute. On vous contacte par email et WhatsApp pour fixer un rendez-vous.",
    img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1800&q=80',
  },
]

export default function HeroSection() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [stats, setStats] = useState({ totalRabbits: 120, totalBreeds: 4, totalReservations: 98 })
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  const go = (idx: number) => {
    if (fading || idx === active) return
    setFading(true)
    setTimeout(() => { setActive(idx); setFading(false) }, 600)
  }

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t) }, [])

  useEffect(() => {
    timer.current = setInterval(() => go((active + 1) % SLIDES.length), 6500)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [active])

  // Charger les statistiques depuis l'API publique
  useEffect(() => {
    analyticsApi.publicStats()
      .then(res => {
        if (res) {
          setStats({
            totalRabbits: res.totalRabbits || 0,
            totalBreeds: res.totalBreeds || 0,
            totalReservations: res.totalReservations || 0,
          })
        }
      })
      .catch(() => {})
  }, [])

  // Parallax léger au scroll
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const s = window.pageYOffset
          if (bgRef.current) {
            bgRef.current.style.transform = `scale(${1 + s / 1800}) translate3d(0,${s * 0.12}px,0)`
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const s = SLIDES[active]
  const fc = (delayMs: number) => ({ opacity: mounted ? 1 : 0, transition: `opacity .7s ${delayMs}ms ease` })

  return (
    <section className="relative h-screen min-h-[560px] overflow-hidden">
      {/* ── Fond image carrousel ── */}
      <div ref={bgRef} className="absolute inset-[-12%] will-change-transform">
        {SLIDES.map((sl, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1100ms]"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <img
              src={sl.img}
              alt=""
              aria-hidden="true"
              loading={i === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center 32%' }}
            />
          </div>
        ))}
      </div>

      {/* ── Voile dégradé pour lisibilité ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-espresso/30 via-espresso/55 to-espresso z-[3]" />
      <div className="absolute inset-0 bg-gradient-to-r from-espresso/75 via-espresso/15 to-transparent z-[4]" />
      <div
        className="absolute -top-16 -right-8 w-[560px] h-[560px] rounded-full z-[5] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(184,131,74,0.18) 0%, transparent 62%)' }}
      />

      {/* ── Contenu ── */}
      <div className="absolute inset-0 z-10 flex items-center px-6 sm:px-10 lg:px-20">
        <div className="max-w-xl -mt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.07] border border-white/[0.14] rounded-full backdrop-blur-sm mb-5" style={fc(0)}>
            <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{s.eyebrow}</span>
          </div>

          <h1
            className="font-display font-extrabold text-[clamp(38px,5.8vw,72px)] leading-[0.95] text-white mb-4"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,.5)' }}
            key={active}
          >
            {s.title}<br />
            <em className="italic font-normal text-white/85">{s.titleItalic}</em>
          </h1>

          <p className="text-white/65 text-sm sm:text-base leading-relaxed mb-7 max-w-md" style={fc(240)}>
            {s.sub}
          </p>

          <div className="flex flex-wrap gap-3 mb-2" style={fc(360)}>
            <Link href="/rabbits" className="btn-neon px-6 py-3 rounded-xl text-sm flex items-center gap-2">
              <Heart size={15} />
              Voir les lapins
            </Link>
            {WHATSAPP && (
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Bonjour, je suis intéressé(e) par un lapin Lapinou.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-white/[0.08] border border-white/[0.18] backdrop-blur-sm transition-all hover:bg-white/[0.14]"
              >
                <MessageCircle size={15} />
                Discuter sur WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Cartes flottantes (desktop) ── */}
      {!isMobile && (
        <>
          <div className="absolute top-[8%] right-[3%] w-64 z-20 glass rounded-2xl p-4" style={fc(350)}>
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-2.5">Lapinou en chiffres</div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { n: `${stats.totalRabbits}`, label: 'Lapins' },
                { n: `${stats.totalBreeds}`, label: 'Races' },
                { n: `${stats.totalReservations}`, label: 'Réservations' },
                { n: '98%', label: 'Satisfaction' },
              ].map((st, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/[0.07] rounded-lg py-2.5 px-1 text-center">
                  <div className="font-display text-lg font-extrabold text-caramel leading-none">{st.n}</div>
                  <div className="text-[8.5px] text-white/40 font-semibold uppercase tracking-wide mt-1">{st.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-[44%] right-[3%] -translate-y-1/2 w-64 z-20 glass rounded-2xl p-4" style={fc(480)}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-caramel/15 border border-caramel/20 flex items-center justify-center shrink-0">
                <MessageCircle size={15} className="text-caramel" />
              </div>
              <div>
                <div className="text-white font-display font-bold text-[11px]">Contact direct</div>
                <div className="text-white/40 text-[9px] mt-0.5">Email + WhatsApp</div>
              </div>
            </div>
            <p className="text-white/35 text-[10px] leading-relaxed">
              Chaque réservation vous met en relation immédiate avec l'éleveur.
            </p>
          </div>

          <div className="absolute bottom-[8%] right-[3%] w-64 z-20 glass rounded-2xl p-4" style={fc(580)}>
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-2.5">Races disponibles</div>
            <div className="flex flex-wrap gap-1.5">
              {['Bélier nain', 'Rex', 'Angora français', 'Hollandais'].map(r => (
                <span key={r} className="text-[9.5px] font-semibold text-white/55 bg-white/[0.05] border border-white/[0.09] rounded-md px-2 py-1">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Dots ── */}
      {!isMobile && (
        <div className="absolute bottom-8 left-20 z-30 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === active ? 28 : 14,
                background: i === active ? '#B8834A' : 'rgba(255,255,255,.25)',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Indicateur scroll ── */}
      <div className="absolute bottom-8 right-10 z-30 hidden sm:flex items-center gap-1.5 text-white/35 text-[11px] font-mono">
        <ChevronRight size={13} className="rotate-90 animate-bounce" />
        Défiler
      </div>
    </section>
  )
}
