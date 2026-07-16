'use client'
import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { rabbitsApi } from '@/lib/api'
import { GENDER_LABEL, formatPrice, isUnavailable, resolvePhotoUrl } from '@/lib/status'

// Nos Lapins ("En Vedette") — port fidèle du markup .project-item de
// chez-florence-landing.html, mais connecté à la vraie API (rabbitsApi,
// même source que components/RabbitsPreviewSection.tsx qu'elle remplace
// sur la home). Chaque carte ouvre WhatsApp directement avec un message
// pré-rempli au nom du lapin — comportement explicitement voulu ici (pas
// de lien vers la fiche /rabbits/[slug], qui reste utilisée ailleurs via
// SimilarRabbits.tsx).
//
// On affiche jusqu'à 6 lapins (2 rangées de 3, "sélection en vedette" —
// pas un catalogue exhaustif) ; "Voir tout le catalogue" pointe vers
// WhatsApp en direct, comme dans le HTML source (il n'existe plus de
// page /rabbits séparée : /rabbits redirige désormais vers /#lapins).
const MAX_VISIBLE = 6
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

function waLinkForRabbit(name: string) {
  const message = `Bonjour, le lapin ${name} est-il toujours disponible ?`
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}` : '#'
}

type Rabbit = {
  id: string | number
  slug: string
  name: string
  breed?: string
  gender?: 'male' | 'female' | 'mixed'
  weight?: number
  color?: string
  price: number
  priceNote?: string
  stock?: number
  status?: string
  photos?: { url: string; isMain?: boolean }[]
}

export default function LapinsSection() {
  const [rabbits, setRabbits] = useState<Rabbit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    rabbitsApi
      .list({})
      .then((r: any) => setRabbits(r.results || []))
      .catch(() => setError(true))
      .finally(() => {
        setLoading(false)
        // Le skeleton (hauteur fixe) est remplacé par les vraies cartes —
        // ça décale tout ce qui suit (Contact). Sans ce refresh, les
        // ScrollTrigger déjà calculés (theming, reveal-text) gardent une
        // zone de déclenchement basée sur la hauteur du skeleton.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => ScrollTrigger.refresh())
        })
      })
  }, [])

  const visible = rabbits.slice(0, MAX_VISIBLE)

  return (
    <section id="lapins" data-theme="light" style={{ paddingBottom: '100px' }}>
      <div className="section-head">
        <div>
          <div className="eyebrow">No. 08 — Nos Lapins</div>
          <div className="section-title reveal-text">En Vedette</div>
        </div>
        <div className="section-desc">
          Ajoutés par notre équipe, prêts à la vente. Azaguié Gare.
        </div>
      </div>

      {loading ? (
        <div className="projects-grid" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div className="project-item project-item-skeleton" key={i}>
              <div className="project-img-box" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="lapins-error">Impossible de charger les lapins pour le moment.</p>
      ) : visible.length === 0 ? (
        <p className="lapins-empty">Aucun lapin disponible pour le moment.</p>
      ) : (
        <div className="projects-grid">
          {visible.map((rabbit, i) => {
            const mainPhoto = rabbit.photos?.find((p) => p.isMain) || rabbit.photos?.[0]
            const src = mainPhoto ? resolvePhotoUrl(mainPhoto.url) : null
            const unavailable = isUnavailable(rabbit)
            const subParts = [
              rabbit.gender ? GENDER_LABEL[rabbit.gender] : null,
              rabbit.weight ? `${rabbit.weight} kg` : null,
              rabbit.color || null,
            ].filter(Boolean)

            return (
              <a
                key={rabbit.id}
                href={unavailable ? undefined : waLinkForRabbit(rabbit.name)}
                target={unavailable ? undefined : '_blank'}
                rel={unavailable ? undefined : 'noopener noreferrer'}
                className={`project-item hover-view${i % 3 === 1 ? ' offset' : ''}${unavailable ? ' is-unavailable' : ''}`}
                aria-disabled={unavailable}
                tabIndex={unavailable ? -1 : undefined}
                onClick={unavailable ? (e) => e.preventDefault() : undefined}
              >
                <div className="project-img-box">
                  <div className={`stock-pill${unavailable ? ' is-out' : ''}`}>
                    {unavailable ? 'Épuisé' : `${rabbit.stock ?? 0} en stock`}
                  </div>
                  {src ? (
                    <img src={src} alt={rabbit.name} />
                  ) : (
                    <div className="project-img-placeholder" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 3c-1.5 2-2 3.5-2 5a2 2 0 1 0 4 0c0-1.5-.5-3-2-5Z" />
                        <path d="M8 9c-2.5 1-4 3-4 6a8 8 0 0 0 16 0c0-3-1.5-5-4-6" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="project-meta">
                  <div>{rabbit.breed || rabbit.name}</div>
                  <div className="p-price">{formatPrice(rabbit.price)}</div>
                </div>
                <div className="project-sub">
                  {subParts.join(' · ')}
                  {subParts.length > 0 ? ' — ' : ''}
                  {rabbit.priceNote || 'Prix net'}
                </div>
              </a>
            )
          })}
        </div>
      )}

      <div className="lapins-cta-row">
        <a
          href={WHATSAPP ? `https://wa.me/${WHATSAPP}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-line hover-target"
        >
          Voir tout le catalogue →
        </a>
      </div>
    </section>
  )
}
