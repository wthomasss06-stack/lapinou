'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './KineticMarqueeGallery.css'

gsap.registerPlugin(ScrollTrigger)

interface KineticItem {
  image: string
  slug: string
  name: string
  price: number
  breed?: string
  weight?: number
  stock: number
  unavailable: boolean
}

interface Props {
  items: KineticItem[]
}

export default function KineticMarqueeGallery({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return

    const ctx = gsap.context(() => {
      // Parallaxe verticale sur le bloc image + infos — amplitude quasi
      // doublée (350 → 620) et scrub numérique (au lieu de true) pour un
      // léger temps de retard du tween sur le scroll : en plus du lissage
      // Lenis déjà global (voir useGsapLenis.ts), ça donne cette sensation
      // "huilée" typique des parallax haut de gamme plutôt qu'un suivi 1:1.
      containerRef.current!.querySelectorAll<HTMLElement>('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed') || '0')
        gsap.to(el, {
          y: () => speed * 620,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.kinetic-item'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        })
      })

      // Couche de profondeur supplémentaire, indépendante, sur l'image
      // seule : elle dérive (alternée selon la parité, comme le marquee) ET
      // se recadre (zoom léger → taille réelle) à SA propre vitesse, en plus
      // du mouvement du bloc entier ci-dessus. C'est ce différentiel entre
      // les deux couches (bloc vs image) qui crée une vraie profondeur au
      // lieu d'un simple bloc qui glisse. Sur .kinetic-image-wrap (pas
      // .kinetic-img) pour ne pas entrer en conflit avec le scale:1.06 au
      // hover, déclaré en CSS sur .kinetic-img lui-même.
      containerRef.current!.querySelectorAll<HTMLElement>('.kinetic-image-wrap').forEach((wrap, index) => {
        const dir = index % 2 === 0 ? 1 : -1
        gsap.fromTo(wrap,
          { y: dir * 90, scale: 1.12 },
          {
            y: dir * -90,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap.closest('.kinetic-item'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            }
          }
        )
      })

      // Marquee horizontal cinétique — amplitude renforcée (40 → 55)
      containerRef.current!.querySelectorAll<HTMLElement>('.kinetic-marquee-track').forEach((marquee) => {
        const dir = parseFloat(marquee.getAttribute('data-direction') || '-1')
        gsap.to(marquee, {
          xPercent: dir * 55,
          ease: 'none',
          scrollTrigger: {
            trigger: marquee.closest('.kinetic-item'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [items])

  if (items.length === 0) return null

  return (
    <div className="kinetic-gallery" ref={containerRef}>
      {items.map((item, index) => (
        <div className="kinetic-item" key={item.slug}>
          {/* Marquee horizontal en arrière-plan */}
          <div className="kinetic-marquee-track" data-direction={index % 2 === 0 ? '-1' : '1'}>
            <span>{item.name} &bull; {item.name} &bull; {item.name} &bull; {item.name} &bull; </span>
            <span>{item.name} &bull; {item.name} &bull; {item.name} &bull; {item.name} &bull; </span>
          </div>

          {/* Stage : infos gauche + image centre */}
          <div className="kinetic-stage" data-speed={index % 2 === 0 ? '0.2' : '-0.15'}>
            {/* ── Infos orange à gauche ── */}
            <div className="kinetic-info-left">
              <div className="kinetic-price">{item.price.toLocaleString('fr-FR')} FCFA</div>
              {item.breed && <div className="kinetic-breed">{item.breed}</div>}
              {item.weight && (
                <div className="kinetic-weight">{item.weight} kg</div>
              )}
              <div className={`kinetic-stock ${item.unavailable ? 'out' : item.stock <= 2 ? 'low' : ''}`}>
                {item.unavailable ? 'Épuisé' : `${item.stock} en stock`}
              </div>
            </div>

            {/* ── Image au centre — clic vers détail ── */}
            {item.unavailable ? (
              <div className="kinetic-image-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  className="kinetic-img grayscale"
                  loading="lazy"
                />
                <div className="kinetic-soldout-overlay">
                  <span>Épuisé</span>
                </div>
              </div>
            ) : (
              <Link href={`/rabbits/${item.slug}`} className="kinetic-image-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  className="kinetic-img"
                  loading="lazy"
                />
                <span className="kinetic-order-btn cf-arrow-btn cf-arrow-btn--solid">
                  Commander
                  <span className="cf-arrow-btn-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
