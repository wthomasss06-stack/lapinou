'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PawPrint, ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { rabbitsApi } from '@/lib/api'
import { isUnavailable, formatPrice, resolvePhotoUrl } from '@/lib/status'
import RainbowText from './RainbowText'
import CircularGallery from './CircularGallery'
import RabbitCard from './RabbitCard'

type GalleryItem = {
  image: string
  text: string
  slug: string
  name: string
  price: number
  breed?: string
  weight?: number
  stock: number
  unavailable: boolean
}

type GalleryHandle = { next: () => void; prev: () => void }

// "Nos Lapins" — galerie circulaire WebGL (port de PHOTO_CIRCULAIRE.html,
// voir CircularGallery.jsx : variante "vortex" de courbe + boucle infinie)
// + boutons précédent/suivant sur desktop. Remplace l'ancien carousel
// horizontal scroll-snap. Vraies fiches (rabbitsApi, même source que
// /rabbits/[slug] et SimilarRabbits) : tout ajout côté admin apparaît ici
// automatiquement.
export default function LapinsFeaturedSection() {
  const [rabbits, setRabbits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const galleryRef = useRef<GalleryHandle>(null)
  const router = useRouter()

  // Desktop : galerie circulaire. Mobile : cartes RabbitCard (grille
  // responsive) — pas de sens à faire tourner l'animation de drag/inertie
  // du carrousel 3D sur un écran qui ne l'affichera jamais.
  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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

  // Fiches avec photo uniquement — contrairement aux cartes HTML, un plan
  // WebGL n'a pas de repli "icône" possible sans image. Cas marginal : en
  // pratique les fiches admin ont (quasi) toujours au moins une photo.
  const galleryItems = useMemo<GalleryItem[]>(() => {
    return rabbits
      .map((rabbit): GalleryItem | null => {
        const mainPhoto = rabbit.photos?.find((p: any) => p.isMain) || rabbit.photos?.[0]
        const src = mainPhoto ? resolvePhotoUrl(mainPhoto.url) : null
        if (!src) return null
        const unavailable = isUnavailable(rabbit)
        return {
          image: src,
          text: `${rabbit.name} — ${formatPrice(rabbit.price)}${unavailable ? ' · Épuisé' : ''}`,
          slug: rabbit.slug,
          name: rabbit.name,
          price: rabbit.price,
          breed: rabbit.breed,
          weight: rabbit.weight,
          stock: rabbit.stock,
          unavailable,
        }
      })
      .filter((item): item is GalleryItem => item !== null)
  }, [rabbits])

  const activeRabbit = galleryItems[activeIndex] || galleryItems[0] || null

  return (
    <section id="lapins" data-theme="rust">
      <div className="section-head section-head--carousel">
        <div>
          <div className="eyebrow">No. 08 — Nos Lapins</div>
          <h2 className="section-title elastic-title">En Vedette</h2>
        </div>
        <RainbowText text="Ajoutés par notre équipe, prêts à la vente. Azaguié Gare." variant="white" className="section-desc" />
      </div>

      {loading ? (
        <div className="projects-track" aria-hidden="true">
          {[0, 1, 2].map((i) => <div className="project-skeleton" key={i} />)}
        </div>
      ) : error ? (
        <p className="projects-empty">Impossible de charger les lapins pour le moment.</p>
      ) : galleryItems.length === 0 ? (
        <p className="projects-empty">
          <PawPrint size={20} style={{ marginRight: '0.5em', verticalAlign: '-0.15em' }} />
          Aucun lapin disponible pour le moment.
        </p>
      ) : isDesktop ? (
        <div className="lapins-circular-wrap">
          <CircularGallery
            ref={galleryRef}
            items={galleryItems}
            onActiveIndexChange={setActiveIndex}
            onItemActivate={(i: number) => {
              const r = galleryItems[i]
              if (r) router.push(`/rabbits/${r.slug}`)
            }}
          />

          

          <div className="carousel-nav">
            <button type="button" className="carousel-btn" onClick={() => galleryRef.current?.prev()} aria-label="Précédent">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="carousel-btn carousel-btn--accent" onClick={() => galleryRef.current?.next()} aria-label="Suivant">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Repli accessible + crawlable : la galerie 3D n'est pas
              nativement lisible par un lecteur d'écran (le JSON-LD de
              app/page.tsx couvre déjà le SEO structuré ; ceci couvre la
              navigation clavier/lecteur d'écran réelle). */}
          <ul className="sr-only">
            {galleryItems.map((r) => (
              <li key={r.slug}><Link href={`/rabbits/${r.slug}`}>{r.name}</Link></li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="lapins-mobile-grid">
          {rabbits.map((rabbit) => (
            <RabbitCard key={rabbit.slug} rabbit={rabbit} />
          ))}
        </div>
      )}
    </section>
  )
}
