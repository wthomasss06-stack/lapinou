'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import StaggeredMenu from './StaggeredMenu'
import './SiteNav.css'

export interface NavLinkItem {
  label: string
  href: string
}

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''
export const waHref = (text?: string) =>
  WHATSAPP ? `https://wa.me/${WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ''}` : '#'

// Navigation unique — StaggeredMenu sur tous les breakpoints (desktop
// inclus). Header flottant avec mix-blend-mode: difference comme l'ancien
// cf-mobile-nav / cf-card-nav.
export const PRIMARY_LINKS: NavLinkItem[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos Lapins', href: '/#lapins' },
  { label: 'Tarifs', href: '/#tarifs' },
  { label: 'FAQ', href: '/#faq' },
]

export const SECONDARY_LINKS: NavLinkItem[] = [
  { label: 'Aide', href: '/aide' },
  { label: 'Confidentialité', href: '/confidentialite' },
  { label: 'Conditions', href: '/conditions' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="site-nav-shell">
      <header className="site-nav" data-open={open}>
        <Link href="/" className="logo-area hover-target" onClick={close}>
          <div className="logo-blob" />
          <span>Chez Florence</span>
        </Link>

        <button
          type="button"
          className="nav-toggle hover-target"
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
        </button>
      </header>

      <StaggeredMenu isOpen={open} onClose={close} primary={PRIMARY_LINKS} secondary={SECONDARY_LINKS} />
    </div>
  )
}
