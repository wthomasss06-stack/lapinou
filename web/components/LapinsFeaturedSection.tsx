'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PawPrint } from 'lucide-react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { rabbitsApi } from '@/lib/api'
import { isUnavailable, formatPrice, resolvePhotoUrl } from '@/lib/status'
import ArrowButton from './ArrowButton'
import RainbowText from './RainbowText'

// Port direct de <section id="lapins"> (index.html, .projects-grid /
// .project-item) — les 3 cartes mock (Unsplash, "5 en stock" en dur) sont
// remplacées par les vraies fiches (rabbitsApi, même source que
// /rabbits/[slug] et SimilarRabbits) : tout ajout côté admin apparaît
// ici automatiquement.
export default function LapinsFeaturedSection() {
  const [rabbits, setRabbits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    rabbitsApi.list({})
      .then((r: any) => setRabbits((r.results || []).slice(0, 6)))
      .catch(() => setError(true))
      .finally(() => {
        setLoading(false)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => ScrollTrigger.refresh())
        })
      })
  }, [])

  return (
    <section id="lapins">
      <div className="section-head">
        <div>
          <div className="eyebrow">No. 08 — Nos Lapins</div>
          <h2 className="section-title reveal-text">En Vedette</h2>
        </div>
        <RainbowText text="Ajoutés par notre équipe, prêts à la vente. Azaguié Gare." variant="white" className="section-desc" />
      </div>

      {loading ? (
        <div className="projects-grid" aria-hidden="true">
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
        <div className="projects-grid">
          {rabbits.map((rabbit, i) => {
            const unavailable = isUnavailable(rabbit)
            const mainPhoto = rabbit.photos?.find((p: any) => p.isMain) || rabbit.photos?.[0]
            const src = mainPhoto ? resolvePhotoUrl(mainPhoto.url) : null
            return (
              <Link
                href={`/rabbits/${rabbit.slug}`}
                key={rabbit.id}
                className={`project-item reveal-text hover-view${i % 2 === 1 ? ' offset' : ''}${unavailable ? ' unavailable' : ''}`}
                aria-disabled={unavailable}
              >
                <div className="project-img-box">
                  {src ? (
                    <Image src={src} alt={rabbit.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
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

      {process.env.NEXT_PUBLIC_WHATSAPP && (
        <div className="projects-cta-row">
          <ArrowButton href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP.replace(/\D/g, '')}`} external>
            Voir tout le catalogue
          </ArrowButton>
        </div>
      )}
    </section>
  )
}
