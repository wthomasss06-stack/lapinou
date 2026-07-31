'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import NavCard from './NavCard'
import StaggeredMenu from './StaggeredMenu'
import './SiteNav.css'

export interface NavLinkItem {
  label: string
  href: string
}

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''
export const waHref = (text?: string) =>
  WHATSAPP ? `https://wa.me/${WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ''}` : '#'

// Navigation unique pour tout le site (home + pages internes + détail
// lapin). Remplace les 2 variantes de l'ancien <Navbar /> et absorbe les
// liens qui vivaient dans le footer (FAQ/Tarifs/Aide/Confidentialité/
// Conditions/WhatsApp) : un seul bouton, un seul jeu de liens.
//  • Desktop (≥900px) : le bouton ouvre <NavCard /> (carte qui se déplie
//    sous le header).
//  • Mobile (<900px) : le même bouton ouvre <StaggeredMenu /> (overlay
//    plein écran, liens en cascade). Le CTA WhatsApp sticky reste en plus
//    pour la conversion rapide.
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

  // Verrouille le scroll de fond pendant que le menu (carte ou overlay)
  // est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Échap ferme le menu, quel que soit le breakpoint.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
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

      <NavCard isOpen={open} onClose={close} primary={PRIMARY_LINKS} secondary={SECONDARY_LINKS} />
      <StaggeredMenu isOpen={open} onClose={close} primary={PRIMARY_LINKS} secondary={SECONDARY_LINKS} />
    </>
  )
}
