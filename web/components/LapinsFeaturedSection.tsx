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

export default function LapinsFeaturedSection() {
  const [rabbits, setRabbits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const mobileTrackRef = useRef<HTMLDivElement>(null)

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
  // défiler (le swipe seul n'était pas assez visible). Pause dès que
  // l'utilisateur touche le slider, reprend après 4s d'inactivité ; ne
  // tourne que quand le slider est réellement visible à l'écran
  // (IntersectionObserver, pas de setInterval qui tourne pour rien hors
  // champ) ; désactivé pour prefers-reduced-motion — les flèches restent
  // le seul contrôle dans ce cas.
  useEffect(() => {
    if (isDesktop || rabbits.length <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const track = mobileTrackRef.current
    if (!track) return

    let timer: ReturnType<typeof setInterval> | null = null
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null
    let inView = false

    const stop = () => {
      if (timer) clearInterval(timer)
      timer = null
    }
    const start = () => {
      stop()
      timer = setInterval(advanceMobile, 3500)
    }
    const pauseThenResume = () => {
      stop()
      if (resumeTimeout) clearTimeout(resumeTimeout)
      resumeTimeout = setTimeout(() => { if (inView) start() }, 4000)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView) start()
        else stop()
      },
      { threshold: 0.4 }
    )
    observer.observe(track)

    track.addEventListener('touchstart', pauseThenResume, { passive: true })
    track.addEventListener('pointerdown', pauseThenResume)

    return () => {
      stop()
      if (resumeTimeout) clearTimeout(resumeTimeout)
      observer.disconnect()
      track.removeEventListener('touchstart', pauseThenResume)
      track.removeEventListener('pointerdown', pauseThenResume)
    }
  }, [isDesktop, rabbits.length, loading])

  useEffect(() => {
    rabbitsApi
      .list({})
      .then((r: any) => setRabbits((r.results || []).slice(0, 8)))
      .catch(() => setError(true))
      .finally(() => {
        setLoading(false)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => ScrollTrigger.refresh())
        })
      })
  }, [])

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
