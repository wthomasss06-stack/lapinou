'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PawPrint, ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { rabbitsApi } from '@/lib/api'
import { isUnavailable, resolvePhotoUrl } from '@/lib/status'
import RainbowText from './RainbowText'
import KineticMarqueeGallery from './KineticMarqueeGallery'
import RabbitCard from './RabbitCard'
import SectionHead from './SectionHead'

type GalleryItem = {
  image: string
  slug: string
  name: string
  price: number
  breed?: string
  weight?: number
  stock: number
  unavailable: boolean
}

export default function LapinsFeaturedSection({ filters = {} }: { filters?: Record<string, string> }) {
  const [rabbits, setRabbits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const autoSlideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoSlideResumeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scrollMobile = (dir: number) => {
    const track = mobileTrackRef.current
    if (!track) return
    const slide = track.querySelector<HTMLElement>('.lapins-mobile-slide')
    const step = slide ? slide.offsetWidth + 14 : track.clientWidth * 0.8
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  // Avance auto du slider mobile — boucle au début une fois la fin
  // atteinte (scrollBy seul se contenterait de clamp sur place en fin de
  // liste).
  const advanceMobile = () => {
    const track = mobileTrackRef.current
    if (!track) return
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8
    if (atEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      scrollMobile(1)
    }
  }

  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Auto-slide mobile — pour signaler qu'il y a d'autres lapins à faire
  // défiler (le swipe seul n'était pas assez visible). Minuteur tenu dans
  // une ref au niveau du COMPOSANT (pas une variable locale à l'effet) :
  // même si l'effet s'exécute deux fois sans cleanup entre les deux
  // (StrictMode en dev, ou tout autre double déclenchement), stopAutoSlide
  // efface TOUJOURS le même minuteur partagé avant d'en reposer un — donc
  // jamais deux intervalles actifs en même temps. C'était le bug : deux
  // minuteurs à 3.5s tournant en parallèle, décalés, donnaient une avance
  // perçue toutes les ~1.75s au lieu de 3.5s. Pause au toucher, reprise
  // après 4s d'inactivité, désactivé si prefers-reduced-motion (flèches
  // manuelles seul contrôle dans ce cas).
  useEffect(() => {
    if (isDesktop || rabbits.length <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const track = mobileTrackRef.current
    if (!track) return

    const stopAutoSlide = () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current)
      autoSlideTimerRef.current = null
    }
    const startAutoSlide = () => {
      stopAutoSlide()
      autoSlideTimerRef.current = setInterval(advanceMobile, 3500)
    }
    const pauseThenResume = () => {
      stopAutoSlide()
      if (autoSlideResumeRef.current) clearTimeout(autoSlideResumeRef.current)
      autoSlideResumeRef.current = setTimeout(startAutoSlide, 4000)
    }

    startAutoSlide()
    track.addEventListener('touchstart', pauseThenResume, { passive: true })
    track.addEventListener('pointerdown', pauseThenResume)

    return () => {
      stopAutoSlide()
      if (autoSlideResumeRef.current) clearTimeout(autoSlideResumeRef.current)
      autoSlideResumeRef.current = null
      track.removeEventListener('touchstart', pauseThenResume)
      track.removeEventListener('pointerdown', pauseThenResume)
    }
  }, [isDesktop, rabbits.length, loading])

  useEffect(() => {
    rabbitsApi
      .list(filters)
      .then((r: any) => setRabbits((r.results || []).slice(0, 8)))
      .catch(() => setError(true))
      .finally(() => {
        setLoading(false)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => ScrollTrigger.refresh())
        })
      })
  }, [filters])

  const galleryItems = useMemo<GalleryItem[]>(() => {
    return rabbits
      .map((rabbit): GalleryItem | null => {
        const mainPhoto = rabbit.photos?.find((p: any) => p.isMain) || rabbit.photos?.[0]
        const src = mainPhoto ? resolvePhotoUrl(mainPhoto.url) : null
        if (!src) return null
        return {
          image: src,
          slug: rabbit.slug,
          name: rabbit.name,
          price: rabbit.price,
          breed: rabbit.breed,
          weight: rabbit.weight,
          stock: rabbit.stock,
          unavailable: isUnavailable(rabbit),
        }
      })
      .filter((item): item is GalleryItem => item !== null)
  }, [rabbits])

  return (
    <section id="lapins" data-theme="dark">
      <SectionHead
        number={4}
        className="section-head--carousel"
        eyebrow="Nos Lapins"
        title={<h2 className="section-title elastic-title">En Vedette</h2>}
        desc={(
          <RainbowText
            text="Ajoutés par notre équipe, prêts à la vente. Azaguié Gare."
            variant="white"
            className="section-desc"
          />
        )}
      />

      {loading ? (
        <div className="projects-track" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div className="project-skeleton" key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="projects-empty">Impossible de charger les lapins pour le moment.</p>
      ) : galleryItems.length === 0 ? (
        <p className="projects-empty">
          <PawPrint size={20} style={{ marginRight: '0.5em', verticalAlign: '-0.15em' }} />
          Aucun lapin disponible pour le moment.
        </p>
      ) : isDesktop ? (
        <KineticMarqueeGallery items={galleryItems} />
      ) : (
        <div className="lapins-mobile-slider">
          <div className="lapins-mobile-track" ref={mobileTrackRef}>
            {rabbits.map((rabbit) => (
              <div className="lapins-mobile-slide" key={rabbit.slug}>
                <RabbitCard rabbit={rabbit} />
              </div>
            ))}
          </div>
          {rabbits.length > 1 && (
            <div className="carousel-nav lapins-mobile-nav">
              <button
                type="button"
                className="carousel-btn"
                onClick={() => scrollMobile(-1)}
                aria-label="Lapin précédent"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="carousel-btn carousel-btn--accent"
                onClick={() => scrollMobile(1)}
                aria-label="Lapin suivant"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
