'use client'
import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { cld } from '@/lib/cloudinary'
import SectionHead from './SectionHead'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Port de l'animation "bicamérale" de vrai_vraiii.html, adapté au projet :
//   Desktop (≥769px) — liste de lignes ; au survol, le titre de la ligne
//     glisse vers le haut et révèle une copie identique qui arrive du bas
//     (port de hover_video.html/.reveal-item), pendant qu'une fenêtre
//     flottante suit le curseur en ressort (même lerp/offset que
//     hover_video.html : easeFactor 0.08, offsetX 200) et fait défiler
//     ses tranches d'image empilées (above/active/below) selon l'index
//     survolé par rapport au précédent — pas un simple crossfade opacité.
//   Mobile (≤768px) — piste horizontale pinnée (scroll-jack), chaque
//     carte a son image en fond plein cadre, texte empilé verticalement.
const GARANTIES = [
  { num: '01.', title: 'Santé Vérifiée', desc: 'Chaque lapin est examiné avant la vente : poids, pelage et comportement contrôlés avec soin. Aucun animal malade ne quitte notre élevage.', img: cld('/IMAGES/1.webp') },
  { num: '02.', title: 'Pesée & Classement', desc: 'Chaque lapin est pesé et classé avec précision — du format simple au lot pour les restaurateurs. Pas de surprise sur le poids.', img: cld('/IMAGES/2.webp') },
  { num: '03.', title: 'Suivi Après-Vente', desc: "Conseils de conservation et d'élevage disponibles après chaque achat. On reste en contact pour vous accompagner.", img: cld('/IMAGES/4.webp') },
  { num: '04.', title: 'Remise en Main Propre', desc: 'Retrait sur place à Azaguié Gare ou livraison encadrée, selon votre disponibilité et votre zone.', img: cld('/IMAGES/3.webp') },
]

// Offset + amortissement — repris tels quels de hover_video.html.
const OFFSET_X = 160
const OFFSET_Y = 0
const EASE_FACTOR = 0.08

export default function GarantiesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const anyActive = hoveredIndex !== null

  // Boucle à ressort (lerp) qui fait suivre la fenêtre au curseur — port
  // direct de updatePhysics() dans hover_video.html.
  useEffect(() => {
    if (!window.matchMedia('(min-width: 769px)').matches) return
    let mouseX = 0, mouseY = 0
    let currentX = 0, currentY = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX + OFFSET_X
      mouseY = e.clientY + OFFSET_Y
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      currentX += (mouseX - currentX) * EASE_FACTOR
      currentY += (mouseY - currentY) * EASE_FACTOR
      if (windowRef.current) {
        windowRef.current.style.left = `${currentX}px`
        windowRef.current.style.top = `${currentY}px`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  useGSAP(() => {
    const rows = gsap.utils.toArray<HTMLElement>('.garantie-row', sectionRef.current!)

    rows.forEach((row) => {
      gsap.fromTo(row, { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none reverse' },
      })
    })

    const mm = gsap.matchMedia()

    mm.add('(max-width: 768px)', () => {
      const track = trackRef.current
      const wrapper = wrapperRef.current
      if (!track || !wrapper) return

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth)
      const tween = gsap.to(track, { x: getScrollAmount, ease: 'none' })

      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: 'center center',
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
      })

      return () => st.kill()
    })
  }, { scope: sectionRef })

  return (
    <section id="garanties" ref={sectionRef} className="garanties-section" data-theme="rust">
      <SectionHead
        number={2}
        eyebrow="Nos Engagements — Santé · Race · Suivi"
        title={(
          <h2 className="section-title elastic-title">
            Nos
            <br />
            Garanties
          </h2>
        )}
      />

      <div
        className={`garanties-wrapper${anyActive ? ' any-active' : ''}`}
        ref={wrapperRef}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div className="garanties-track" ref={trackRef}>
          {GARANTIES.map((g, i) => (
            <div
              className="garantie-row"
              data-img={g.img}
              key={g.num}
              onMouseEnter={() => setHoveredIndex(i)}
            >
              <div className="garantie-row-mobile-bg">
                <Image src={g.img} alt="" fill sizes="85vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="garantie-num">{g.num}</div>
              <div className="garantie-title-wrap">
                <span className="garantie-title">{g.title}</span>
                <span className="garantie-title sub" aria-hidden="true">{g.title}</span>
              </div>
              <div className="garantie-desc">{g.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`garantie-image-window${anyActive ? ' active' : ''}`} ref={windowRef} aria-hidden="true">
        {GARANTIES.map((g, i) => {
          const cls =
            hoveredIndex === null ? '' :
            i === hoveredIndex ? 'gis-active' :
            i < hoveredIndex ? 'gis-above' : 'gis-below'
          return (
            <div className={`garantie-image-slice ${cls}`} key={g.num}>
              <Image src={g.img} alt="" fill sizes="260px" style={{ objectFit: 'cover' }} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
