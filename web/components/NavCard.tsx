'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { waHref, type NavLinkItem } from './SiteNav'
import './NavCard.css'

gsap.registerPlugin(useGSAP)

interface NavCardProps {
  isOpen: boolean
  onClose: () => void
  primary: NavLinkItem[]
  secondary: NavLinkItem[]
}

// CardNav desktop (≥900px, voir NavCard.css) : la carte se déplie sous le
// header via clip-path (jamais width/height — cf. senior-dev-guardrails)
// avec un balayage puis un stagger sur les lignes. Masquée en CSS sous
// 900px, où StaggeredMenu prend le relais avec le même bouton déclencheur.
export default function NavCard({ isOpen, onClose, primary, secondary }: NavCardProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLElement[]>([])
  const isFirstRender = useRef(true)
  rowsRef.current = []
  const addRow = (el: HTMLElement | null) => {
    if (el) rowsRef.current.push(el)
  }

  useGSAP(
    () => {
      if (!panelRef.current) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const dur = isFirstRender.current ? 0 : reduce ? 0.12 : 0.5

      if (isOpen) {
        panelRef.current.style.pointerEvents = 'auto'
        gsap.to(panelRef.current, {
          clipPath: reduce ? 'none' : 'inset(0% 0% 0% 0% round 26px)',
          autoAlpha: 1,
          duration: dur,
          ease: 'power4.out',
        })
        gsap.to(rowsRef.current, {
          y: 0,
          autoAlpha: 1,
          duration: reduce ? dur : 0.42,
          stagger: reduce ? 0 : 0.045,
          delay: reduce || isFirstRender.current ? 0 : 0.16,
          ease: 'power3.out',
        })
      } else {
        gsap.to(panelRef.current, {
          clipPath: reduce ? 'none' : 'inset(0% 0% 100% 0% round 26px)',
          autoAlpha: reduce ? 0 : 1,
          duration: dur,
          ease: 'power3.inOut',
          onComplete: () => {
            if (panelRef.current) panelRef.current.style.pointerEvents = 'none'
          },
        })
        gsap.set(rowsRef.current, { y: reduce ? 0 : 14, autoAlpha: 0 })
      }
      isFirstRender.current = false
    },
    { scope: panelRef, dependencies: [isOpen] }
  )

  return (
    <div ref={panelRef} className="nav-card" data-open={isOpen} aria-hidden={!isOpen}>
      <div className="nav-card-col nav-card-col--primary">
        <span className="nav-card-eyebrow">Navigation</span>
        {primary.map((link, i) => (
          <Link
            key={link.href}
            ref={addRow as any}
            href={link.href}
            className="nav-card-link hover-target"
            onClick={onClose}
          >
            <span className="nav-card-link-index">{String(i + 1).padStart(2, '0')}</span>
            {link.label}
          </Link>
        ))}
      </div>

      <div className="nav-card-col nav-card-col--secondary">
        <span className="nav-card-eyebrow">Infos</span>
        {secondary.map((link) => (
          <Link
            key={link.href}
            ref={addRow as any}
            href={link.href}
            className="nav-card-sublink hover-target"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div ref={addRow as any} className="nav-card-col nav-card-col--cta">
        <span className="nav-card-eyebrow">Commander</span>
        <p className="nav-card-cta-text">Une race qui vous intéresse ? On répond vite sur WhatsApp.</p>
        <a
          href={waHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-card-whatsapp hover-target"
          onClick={onClose}
        >
          WhatsApp <ArrowUpRight size={16} strokeWidth={1.75} />
        </a>
        <Link href="/#tarifs" className="nav-card-outline hover-target" onClick={onClose}>
          <span className="pixel-square" /> Voir les tarifs
        </Link>
      </div>
    </div>
  )
}
