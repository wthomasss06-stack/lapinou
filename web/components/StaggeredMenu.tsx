'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { X } from 'lucide-react'
import { waHref, type NavLinkItem } from './SiteNav'
import './StaggeredMenu.css'

gsap.registerPlugin(useGSAP)

interface StaggeredMenuProps {
  isOpen: boolean
  onClose: () => void
  primary: NavLinkItem[]
  secondary: NavLinkItem[]
}

// StaggeredMenu mobile (<900px, voir StaggeredMenu.css) : overlay plein
// écran ouvert par le même bouton que NavCard. Balayage en clip-path puis
// stagger sur les liens (jamais width/height — cf. senior-dev-guardrails).
// Masqué en CSS à partir de 900px.
export default function StaggeredMenu({ isOpen, onClose, primary, secondary }: StaggeredMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLElement[]>([])
  const isFirstRender = useRef(true)
  itemsRef.current = []
  const addItem = (el: HTMLElement | null) => {
    if (el) itemsRef.current.push(el)
  }

  useGSAP(
    () => {
      if (!overlayRef.current) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const dur = isFirstRender.current ? 0 : reduce ? 0.12 : 0.6

      if (isOpen) {
        overlayRef.current.style.pointerEvents = 'auto'
        gsap.to(overlayRef.current, {
          clipPath: reduce ? 'none' : 'inset(0% 0% 0% 0%)',
          autoAlpha: 1,
          duration: dur,
          ease: 'power4.out',
        })
        gsap.to(itemsRef.current, {
          y: 0,
          autoAlpha: 1,
          duration: reduce ? dur : 0.55,
          stagger: reduce ? 0 : 0.07,
          delay: reduce || isFirstRender.current ? 0 : 0.22,
          ease: 'power3.out',
        })
      } else {
        gsap.to(overlayRef.current, {
          clipPath: reduce ? 'none' : 'inset(0% 0% 100% 0%)',
          autoAlpha: reduce ? 0 : 1,
          duration: dur,
          ease: 'power3.inOut',
          onComplete: () => {
            if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none'
          },
        })
        gsap.set(itemsRef.current, { y: reduce ? 0 : 26, autoAlpha: 0 })
      }
      isFirstRender.current = false
    },
    { scope: overlayRef, dependencies: [isOpen] }
  )

  return (
    <div ref={overlayRef} className="staggered-menu" data-open={isOpen} aria-hidden={!isOpen}>
      <button
        type="button"
        className="staggered-menu-close hover-target"
        onClick={onClose}
        aria-label="Fermer le menu"
      >
        <X size={22} strokeWidth={1.5} />
      </button>

      <nav className="staggered-menu-list" aria-label="Navigation principale">
        {primary.map((link, i) => (
          <Link
            key={link.href}
            ref={addItem as any}
            href={link.href}
            className="staggered-menu-item hover-target"
            onClick={onClose}
          >
            <span className="staggered-menu-index">{String(i + 1).padStart(2, '0')}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="staggered-menu-secondary">
        {secondary.map((link) => (
          <Link
            key={link.href}
            ref={addItem as any}
            href={link.href}
            className="staggered-menu-sublink hover-target"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <a
        ref={addItem as any}
        href={waHref('Bonjour Chez Florence, je suis intéressé par vos lapins.')}
        target="_blank"
        rel="noopener noreferrer"
        className="staggered-menu-cta hover-target"
        onClick={onClose}
      >
        Commander sur WhatsApp
      </a>
    </div>
  )
}
