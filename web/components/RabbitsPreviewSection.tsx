'use client'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowUpRight, PawPrint } from 'lucide-react'
import RabbitCard from './RabbitCard'
import { rabbitsApi } from '@/lib/api'

// Page 4 — "Nos Lapins" en carousel 1x3 (scroll-snap natif + boutons).
// Vraies fiches (même source que <RabbitsSection id="lapins"> plus bas,
// même <RabbitCard/>) — tout ce qui est ajouté via l'admin s'affiche ici
// automatiquement. "Voir tout" renvoie vers le catalogue complet filtrable.
export default function RabbitsPreviewSection() {
  const [rabbits, setRabbits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    rabbitsApi.list({})
      .then((r: any) => setRabbits(r.results || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const updateEdges = () => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    updateEdges()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [rabbits])

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.lapins-card')
    const gap = 24
    const amount = card ? card.getBoundingClientRect().width + gap : el.clientWidth / 3
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section id="lapins">
      <div id="page4">
        <div className="lapins-head">
          <div>
            <div className="lapins-eyebrow">(Nos Lapins)</div>
            <h2 className="lapins-title">En Vedette</h2>
            <p className="lapins-sub">Ajoutés par notre équipe, prêts à la vente</p>
          </div>
          <div className="lapins-nav-btns">
          <button
            type="button"
            aria-label="Précédent"
            className="lapins-nav-btn"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Suivant"
            className="lapins-nav-btn lapins-nav-btn--active"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="lapins-viewport" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div className="lapins-card" key={i}>
              <div className="lapins-card-skeleton" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="lapins-empty">Impossible de charger les lapins pour le moment.</p>
      ) : rabbits.length === 0 ? (
        <p className="lapins-empty">
          <PawPrint size={20} style={{ marginRight: '0.5em', verticalAlign: '-0.15em' }} />
          Aucun lapin disponible pour le moment.
        </p>
      ) : (
        <div className="lapins-viewport" ref={trackRef}>
          {rabbits.map((rabbit, i) => (
            <div className="lapins-card" key={rabbit.id}>
              <RabbitCard rabbit={rabbit} index={i} layout="grid" />
            </div>
          ))}
        </div>
      )}

      <div id="page4-btn">
        <a href="/rabbits">Voir tout</a>
        <ArrowUpRight size={18} strokeWidth={2} />
      </div>
    </div>
  </section>
  )
}
