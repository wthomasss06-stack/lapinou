'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import Logo from './Logo'
import './Navbar.css'

// ── Navbar CHEZ FLORENCE — CardNav (desktop) + StaggeredMenu (mobile) ──
// Restaurée telle quelle depuis la version d'origine du projet : pill
// compacte desktop → hamburger déploie 3 cartes ; panel plein écran
// mobile qui glisse depuis la droite. Porte maintenant TOUTE la
// navigation du site (Nos Lapins/Tarifs/Notre Histoire/FAQ/Contact +
// Aide/Conditions/Confidentialité) — ces liens ne sont plus dans le
// footer (voir Footer.tsx), la nav est l'unique endroit où les trouver.
// ═══════════════════════════════════════════════════════════════════

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos Lapins', href: '/#lapins' },
  { label: 'Tarifs', href: '/#tarifs' },
  { label: 'Notre Histoire', href: '/#histoire' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
]

const infoLinks = [
  { label: 'Aide', href: '/aide' },
  { label: 'Conditions', href: '/conditions' },
  { label: 'Confidentialité', href: '/confidentialite' },
]

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''
const WHATSAPP_URL = WHATSAPP
  ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Bonjour, j'aimerais commander un lapin.")}`
  : '#'

const ArrowIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
)

/* ═══════════════════════════ DESKTOP — CardNav ═══════════════════════════ */

function DesktopCardNav() {
  const navRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const openRef = useRef(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    const content = contentRef.current
    const cards = cardsRef.current
    if (!nav || !content) return

    gsap.set(cards, { y: 45, opacity: 0 })

    const tl = gsap.timeline({ paused: true })
    tl.to(nav, { height: () => content.scrollHeight + 64, duration: 0.55, ease: 'power3.inOut' })
    tl.to(cards, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out' }, '-=0.25')
    tlRef.current = tl

    const onResize = () => { if (openRef.current) gsap.set(nav, { height: content.scrollHeight + 64 }) }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      tl.kill()
    }
  }, [])

  const toggle = () => {
    const tl = tlRef.current
    if (!tl) return
    const next = !openRef.current
    openRef.current = next
    if (next) tl.play(); else tl.reverse()
    setOpen(next)
  }

  const closeNav = () => {
    if (!openRef.current) return
    openRef.current = false
    tlRef.current?.reverse()
    setOpen(false)
  }

  return (
    <div className="cf-nav-container cf-card-nav-desktop">
      <nav
        ref={navRef}
        className={'cf-card-nav' + (open ? ' is-open' : '')}
        style={{
          '--nav-bg': open ? 'rgba(6,14,9,0.0)' : 'transparent',
          '--nav-blur': open ? 'blur(20px) saturate(160%)' : 'none',
          '--nav-border': open ? '1px solid rgba(194,114,61,0.18)' : '1px solid transparent',
          '--nav-shadow': open ? '0 8px 32px rgba(0,0,0,0.35)' : 'none',
          '--nav-hline': '#F3E9DA',
          background: open ? 'rgba(var(--maroon-rgb),0.92)' : 'transparent',
          backdropFilter: open ? 'blur(16px)' : 'none',
        } as React.CSSProperties}
      >
        <div className="cf-nav-top">
          <button className={'cf-hamburger' + (open ? ' open' : '')} onClick={toggle} aria-label="Menu" type="button">
            <div className="cf-hline" />
            <div className="cf-hline" />
          </button>

          <Logo size={52} className="cf-nav-logo" onClick={closeNav} />

          <div className="cf-nav-right">
            <Link href="/#lapins" className="cf-nav-cta" onClick={closeNav}>
              Voir les lapins
            </Link>
          </div>
        </div>

        <div className="cf-nav-content" ref={contentRef}>
          <div className="cf-nav-card cf-nav-card--brand" ref={el => { cardsRef.current[0] = el }}>
            <div className="cf-card-label">Chez Florence</div>
            <div className="cf-card-brand">
              <Logo size={76} className="cf-card-logo-link" onClick={closeNav} ariaLabel="Retour à l'accueil" />
              <p className="cf-card-slogan">
                L&apos;élevage qui vous connecte directement aux plus beaux lapins, en toute confiance.
              </p>
            </div>
          </div>

          <div className="cf-nav-card cf-nav-card--links" ref={el => { cardsRef.current[1] = el }}>
            <div className="cf-card-label">Navigation</div>
            <div className="cf-card-links">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={closeNav} className="cf-card-link">
                  <ArrowIcon className="cf-card-link-arrow" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="cf-nav-card cf-nav-card--contact" ref={el => { cardsRef.current[2] = el }}>
            <div className="cf-card-label">Informations</div>
            <div className="cf-card-links">
              {infoLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={closeNav} className="cf-card-link">
                  <ArrowIcon className="cf-card-link-arrow" />
                  {link.label}
                </Link>
              ))}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={closeNav} className="cf-card-link">
                <ArrowIcon className="cf-card-link-arrow" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

/* ═══════════════════════════ MOBILE — StaggeredMenu ═══════════════════════ */

function MobileStaggeredNav() {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const preLayersRef = useRef<HTMLDivElement>(null)
  const preLayerElsRef = useRef<HTMLElement[]>([])
  const plusHRef = useRef<HTMLSpanElement>(null)
  const plusVRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const textInnerRef = useRef<HTMLSpanElement>(null)
  const [textLines, setTextLines] = useState(['Menu', 'Fermer'])
  const busyRef = useRef(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current
      const preContainer = preLayersRef.current
      if (!panel || !plusHRef.current || !plusVRef.current || !iconRef.current || !textInnerRef.current) return

      const preLayers = preContainer ? Array.from(preContainer.querySelectorAll<HTMLElement>('.cf-mobile-prelayer')) : []
      preLayerElsRef.current = preLayers

      gsap.set([panel, ...preLayers], { xPercent: 100 })
      gsap.set(plusHRef.current, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(plusVRef.current, { rotate: 90, transformOrigin: '50% 50%' })
      gsap.set(iconRef.current, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(textInnerRef.current, { yPercent: 0 })
    })
    return () => ctx.revert()
  }, [])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) { busyRef.current = false; return }

    const itemEls = Array.from(panel.querySelectorAll<HTMLElement>('.cf-mobile-item'))
    gsap.set(itemEls, { yPercent: 130, rotate: 8 })

    const tl = gsap.timeline({ onComplete: () => { busyRef.current = false } })
    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: 100 }, { xPercent: 0, duration: 0.45, ease: 'power4.out' }, i * 0.07)
    })
    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0)
    tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.6, ease: 'power4.out' }, panelInsertTime)
    if (itemEls.length) {
      tl.to(itemEls, {
        yPercent: 0, rotate: 0, duration: 0.9, ease: 'power4.out',
        stagger: { each: 0.06, from: 'start' },
      }, panelInsertTime + 0.15)
    }
    tl.play(0)
  }, [])

  const playClose = useCallback(() => {
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return
    gsap.to([...layers, panel], {
      xPercent: 100, duration: 0.3, ease: 'power3.in', overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll<HTMLElement>('.cf-mobile-item'))
        gsap.set(itemEls, { yPercent: 130, rotate: 8 })
        busyRef.current = false
      },
    })
  }, [])

  const animateIcon = useCallback((opening: boolean) => {
    if (!iconRef.current) return
    gsap.to(iconRef.current, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.7 : 0.32,
      ease: opening ? 'power4.out' : 'power3.inOut',
      overwrite: 'auto',
    })
  }, [])

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current
    if (!inner) return
    const seq = opening ? ['Menu', 'Fermer'] : ['Fermer', 'Menu']
    setTextLines(seq)
    gsap.set(inner, { yPercent: 0 })
    gsap.to(inner, { yPercent: -50, duration: 0.45, ease: 'power4.out' })
  }, [])

  const toggleMenu = () => {
    const target = !openRef.current
    openRef.current = target
    setOpen(target)
    if (target) playOpen(); else playClose()
    animateIcon(target)
    animateText(target)
  }

  const closeMenu = () => {
    if (!openRef.current) return
    openRef.current = false
    setOpen(false)
    playClose()
    animateIcon(false)
    animateText(false)
  }

  const allLinks = [...navLinks, ...infoLinks]

  return (
    <>
      <div className={'cf-mobile-nav' + (open ? ' is-open' : '')}>
        <Logo size={48} className="cf-nav-logo" onClick={closeMenu} />
        <button
          className="cf-mobile-toggle"
          onClick={toggleMenu}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          type="button"
        >
          <span className="cf-mobile-toggle-textWrap">
            <span ref={textInnerRef} className="cf-mobile-toggle-textInner">
              {textLines.map((l, i) => <span className="cf-mobile-toggle-line" key={i}>{l}</span>)}
            </span>
          </span>
          <span ref={iconRef} className="cf-mobile-icon">
            <span ref={plusHRef} className="cf-mobile-icon-line" />
            <span ref={plusVRef} className="cf-mobile-icon-line" />
          </span>
        </button>
      </div>

      <div ref={preLayersRef} className="cf-mobile-prelayers" aria-hidden="true">
        <div className="cf-mobile-prelayer" style={{ background: 'var(--rust)' }} />
        <div className="cf-mobile-prelayer cf-mobile-prelayer--bg" />
      </div>

      <div ref={panelRef} className="cf-mobile-panel" aria-hidden={!open}>
        <div className="cf-mobile-panel-inner">
          <div className="cf-mobile-panel-header">
            <Logo size={48} />
            <button
              className="cf-mobile-close"
              onClick={closeMenu}
              aria-label="Fermer le menu"
              type="button"
            >
              <span className="cf-mobile-close-line" />
              <span className="cf-mobile-close-line" />
            </button>
          </div>

          <ul className="cf-mobile-list">
            {allLinks.map((link) => (
              <li className="cf-mobile-itemWrap" key={link.href}>
                <Link href={link.href} className="cf-mobile-item" onClick={closeMenu}>
                  {link.label}
                  <span className="cf-mobile-item-arrow">
                    <ArrowIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="cf-mobile-panel-footer">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cf-mobile-cta" onClick={closeMenu}>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════ */

export default function Navbar() {
  return (
    <>
      <DesktopCardNav />
      <MobileStaggeredNav />
    </>
  )
}
