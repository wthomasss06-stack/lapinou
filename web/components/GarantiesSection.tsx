'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Port de l'animation "bicamérale" de vrai_vraiii.html, adapté au projet :
//   Desktop (≥769px) — liste de lignes, image de fond qui suit le curseur
//     au survol de chaque ligne (#hover-img, distinct du petit curseur
//     custom sitewide — les deux coexistent).
//   Mobile (≤768px) — piste horizontale pinnée (scroll-jack), chaque
//     carte a son image en fond plein cadre, texte empilé verticalement.
// Deux images disponibles pour l'instant (eleveur-soin / affiche),
// répétées sur les 4 lignes — à remplacer par des photos dédiées si Aka
// en fournit plus tard.
const GARANTIES = [
  { num: '01.', title: 'Santé Vérifiée', desc: 'Chaque lapin est examiné avant la vente : poids, pelage et comportement contrôlés avec soin. Aucun animal malade ne quitte notre élevage.', img: '/IMAGES/eleveur-soin.jpg' },
  { num: '02.', title: 'Pesée & Classement', desc: 'Chaque lapin est pesé et classé avec précision — du format simple au lot pour les restaurateurs. Pas de surprise sur le poids.', img: '/IMAGES/vente-lapins-affiche.jpg' },
  { num: '03.', title: 'Suivi Après-Vente', desc: "Conseils de conservation et d'élevage disponibles après chaque achat. On reste en contact pour vous accompagner.", img: '/IMAGES/eleveur-soin.jpg' },
  { num: '04.', title: 'Remise en Main Propre', desc: 'Retrait sur place à Azaguié Gare ou livraison encadrée, selon votre disponibilité et votre zone.', img: '/IMAGES/vente-lapins-affiche.jpg' },
]

export default function GarantiesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const hoverImgRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const rows = gsap.utils.toArray<HTMLElement>('.garantie-row', sectionRef.current!)

    rows.forEach((row) => {
      gsap.fromTo(row, { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none reverse' },
      })
    })

    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      const hoverImg = hoverImgRef.current
      if (!hoverImg) return

      const xTo = gsap.quickTo(hoverImg, 'left', { duration: 0.4, ease: 'power3.out' })
      const yTo = gsap.quickTo(hoverImg, 'top', { duration: 0.4, ease: 'power3.out' })

      const onMove = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY) }
      window.addEventListener('mousemove', onMove)

      const cleanups: (() => void)[] = []
      rows.forEach((row) => {
        const src = row.dataset.img
        const onEnter = () => { hoverImg.style.backgroundImage = `url(${src})`; hoverImg.classList.add('active') }
        const onLeave = () => hoverImg.classList.remove('active')
        row.addEventListener('mouseenter', onEnter)
        row.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          row.removeEventListener('mouseenter', onEnter)
          row.removeEventListener('mouseleave', onLeave)
        })
      })

      return () => {
        window.removeEventListener('mousemove', onMove)
        cleanups.forEach((fn) => fn())
      }
    })

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
    <section id="garanties" ref={sectionRef} className="garanties-section">
      <div className="section-head">
        <div>
          <div className="eyebrow">Nos Engagements — Santé · Race · Suivi</div>
          <h2 className="section-title reveal-text">
            Nos
            <br />
            Garanties
          </h2>
        </div>
      </div>

      <div className="garanties-wrapper" ref={wrapperRef}>
        <div className="garanties-track" ref={trackRef}>
          {GARANTIES.map((g) => (
            <div className="garantie-row" data-img={g.img} key={g.num}>
              <div className="garantie-row-mobile-bg">
                <Image src={g.img} alt="" fill sizes="85vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="garantie-num">{g.num}</div>
              <div className="garantie-title">{g.title}</div>
              <div className="garantie-desc">{g.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hover-img" ref={hoverImgRef} aria-hidden="true" />
    </section>
  )
}
