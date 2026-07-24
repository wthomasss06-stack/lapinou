'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PawPrint, ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { rabbitsApi } from '@/lib/api'
import { isUnavailable, formatPrice, resolvePhotoUrl } from '@/lib/status'
import RainbowText from './RainbowText'

// "Nos Lapins" — carousel horizontal (scroll-snap natif, donc tactile sur
// mobile sans rien à coder en plus) + boutons précédent/suivant sur
// desktop. Vraies fiches (rabbitsApi, même source que /rabbits/[slug] et
// SimilarRabbits) : tout ajout côté admin apparaît ici automatiquement.
export default function LapinsFeaturedSection() {
  const [rabbits, setRabbits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => {
    rabbitsApi.list({})
      .then((r: any) => setRabbits((r.results || []).slice(0, 8)))
      .catch(() => setError(true))
      .finally(() => {
        setLoading(false)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => ScrollTrigger.refresh())
        })
      })
  }, [])

  const updateArrows = () => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    updateArrows()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [rabbits])

  const slide = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.project-item')
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section id="lapins" data-theme="rust">
      <div className="section-head section-head--carousel">
        <div>
          <div className="eyebrow">No. 08 — Nos Lapins</div>
          <h2 className="section-title elastic-title">En Vedette</h2>
        </div>
        <RainbowText text="Ajoutés par notre équipe, prêts à la vente. Azaguié Gare." variant="white" className="section-desc" />

        {!loading && !error && rabbits.length > 0 && (
          <div className="carousel-nav">
            <button type="button" className="carousel-btn" onClick={() => slide(-1)} disabled={!canPrev} aria-label="Précédent">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="carousel-btn carousel-btn--accent" onClick={() => slide(1)} disabled={!canNext} aria-label="Suivant">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="projects-track" aria-hidden="true">
          {[0, 1, 2].map((i) => <div className="project-skeleton" key={i} />)}
        </div>
      ) : error ? (
        <p className="projects-empty">Impossible de charger les lapins pour le moment.</p>
      ) : rabbits.length === 0 ? (
        <p className="projects-empty">
          <PawPrint size={20} style={{ marginRight: '0.5em', verticalAlign: '-0.15em' }} />
          Aucun lapin disponible pour le moment.
        </p>
      ) : (
        <div className="projects-track" ref={trackRef}>
          {rabbits.map((rabbit) => {
            const unavailable = isUnavailable(rabbit)
            const mainPhoto = rabbit.photos?.find((p: any) => p.isMain) || rabbit.photos?.[0]
            const src = mainPhoto ? resolvePhotoUrl(mainPhoto.url) : null
            return (
              <Link
                href={`/rabbits/${rabbit.slug}`}
                key={rabbit.id}
                className={`project-item reveal-text hover-view${unavailable ? ' unavailable' : ''}`}
                aria-disabled={unavailable}
              >
                <div className="project-img-box">
                  {src ? (
                    <Image src={src} alt={`${rabbit.name} — lapin ${rabbit.breed} à vendre à Abidjan`} fill sizes="(max-width: 768px) 78vw, 320px" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className="project-img-fallback"><PawPrint size={32} /></div>
                  )}
                  <span className={`stock-pill${!unavailable && rabbit.stock <= 4 ? ' low' : ''}`}>
                    {unavailable ? 'Stock épuisé' : `${rabbit.stock} en stock`}
                  </span>
                </div>
                <div className="project-meta">
                  <span>{rabbit.name}</span>
                  <span>{formatPrice(rabbit.price)}</span>
                </div>
                <div className="project-sub">{rabbit.breed}{rabbit.weight ? ` · ${rabbit.weight} kg` : ''}</div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
