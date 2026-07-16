'use client'
import { useRef } from 'react'
import { useTilt3D } from '@/lib/useTilt3D'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

type Card = { tag: string; price: string; action: string; msg: string }

export default function HeroTiltCards({ cards }: { cards: Card[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useTilt3D(ref)

  return (
    <div className="cards-container" ref={ref}>
      {cards.map((c) => (
        <a
          key={c.tag}
          href={WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(c.msg)}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="card hover-target"
          data-tilt
        >
          <div className="card-tag">{c.tag}</div>
          <div className="card-price">{c.price}</div>
          <div className="card-action">{c.action}</div>
        </a>
      ))}
    </div>
  )
}
