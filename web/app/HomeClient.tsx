'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { formatWhatsappDisplay } from '@/lib/whatsapp'

const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP || '').replace(/\D/g, '')
const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export default function HomeClient() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // ── Lenis smooth scroll ──
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tickerFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    // ── Preloader & text scramble ──
    const counter = document.querySelector<HTMLElement>('.loader-counter')
    const title = document.querySelector<HTMLElement>('.title-main')
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    let load = 0
    let scrambleInterval: ReturnType<typeof setInterval> | null = null
    const loadInterval = setInterval(() => {
      load++
      if (counter) counter.innerText = load + '%'
      if (load > 99) {
        clearInterval(loadInterval)
        gsap.to('.preloader', { yPercent: -100, duration: 1.2, ease: 'expo.inOut', delay: 0.2 })
        setTimeout(() => {
          if (!title) return
          let iterations = 0
          const originalText = title.dataset.text || ''
          scrambleInterval = setInterval(() => {
            title.innerText = originalText
              .split('')
              .map((letter, index) => {
                if (index < iterations) return originalText[index]
                return letters[Math.floor(Math.random() * 26)]
              })
              .join('')
            if (iterations >= originalText.length && scrambleInterval) clearInterval(scrambleInterval)
            iterations += 1 / 3
          }, 30)
        }, 1000)
      }
    }, 15)

    // ── Custom cursor ──
    const cursor = document.getElementById('cursor')
    const onMouseMove = (e: MouseEvent) => {
      if (cursor) gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' })
    }
    document.addEventListener('mousemove', onMouseMove)

    const hoverTargets = document.querySelectorAll('.hover-target')
    const onEnterHover = () => cursor?.classList.add('hovered')
    const onLeaveHover = () => cursor?.classList.remove('hovered')
    hoverTargets.forEach((t) => {
      t.addEventListener('mouseenter', onEnterHover)
      t.addEventListener('mouseleave', onLeaveHover)
    })

    const viewTargets = document.querySelectorAll('.hover-view')
    const onEnterView = () => cursor?.classList.add('hovered', 'view-mode')
    const onLeaveView = () => cursor?.classList.remove('hovered', 'view-mode')
    viewTargets.forEach((t) => {
      t.addEventListener('mouseenter', onEnterView)
      t.addEventListener('mouseleave', onLeaveView)
    })

    // ── Parallax mouse hero ──
    const jellyfish = document.querySelector<HTMLElement>('.jellyfish-bg')
    const onParallax = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60
      const y = (e.clientY / window.innerHeight - 0.5) * 60
      if (jellyfish) gsap.to(jellyfish, { x: -x, y: -y, duration: 1.5, ease: 'power2.out' })
    }
    document.addEventListener('mousemove', onParallax)

    // ── Dynamic theme switching ──
    const themeTriggers: ScrollTrigger[] = []
    function applyTheme(theme: string) {
      document.documentElement.style.setProperty('--current-bg', theme === 'dark' ? 'var(--bg-dark)' : 'var(--bg-light)')
      document.documentElement.style.setProperty('--current-text', theme === 'dark' ? 'var(--text-light)' : 'var(--text-dark)')
    }
    document.querySelectorAll('section, footer').forEach((section) => {
      const theme = section.getAttribute('data-theme')
      if (theme) {
        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => applyTheme(theme),
          onEnterBack: () => applyTheme(theme),
        })
        themeTriggers.push(st)
      }
    })

    // ── 3D tilt cards ──
    const tiltCards = document.querySelectorAll<HTMLElement>('[data-tilt]')
    const tiltHandlers: Array<{ el: Element; move: (e: Event) => void; leave: () => void }> = []
    tiltCards.forEach((card) => {
      const move = (e: Event) => {
        const me = e as MouseEvent
        const r = card.getBoundingClientRect()
        const angleX = (r.height / 2 - (me.clientY - r.top)) / 10
        const angleY = (me.clientX - r.left - r.width / 2) / 10
        gsap.to(card, { rotateX: angleX, rotateY: angleY, scale: 1.05, duration: 0.3 })
      }
      const leave = () => gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
      card.addEventListener('mousemove', move)
      card.addEventListener('mouseleave', leave)
      tiltHandlers.push({ el: card, move, leave })
    })

    // ── Marquee speed tied to scroll velocity ──
    const marqueeTween = gsap.to('.marquee-inner', { xPercent: -50, repeat: -1, duration: 15, ease: 'none' })
    const marqueeTrigger = ScrollTrigger.create({
      trigger: '#histoire',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => gsap.to(marqueeTween, { timeScale: self.getVelocity() / 150 + 1, duration: 0.2 }),
    })

    // ── Parallax images (Nos Lapins) ──
    document.querySelectorAll('.project-item').forEach((item) => {
      const img = item.querySelector('img')
      if (!img) return
      gsap.fromTo(
        img,
        { yPercent: -15 },
        { yPercent: 15, ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } }
      )
    })

    // ── Magnetic button ──
    const magWrapper = document.querySelector<HTMLElement>('.magnetic-btn-wrapper')
    const magBtn = document.querySelector<HTMLElement>('.magnetic-btn')
    const onMagMove = (e: MouseEvent) => {
      if (!magWrapper || !magBtn) return
      const r = magWrapper.getBoundingClientRect()
      const relX = (e.clientX - (r.left + r.width / 2)) * 0.5
      const relY = (e.clientY - (r.top + r.height / 2)) * 0.5
      gsap.to(magBtn, { x: relX, y: relY, duration: 0.3, ease: 'power2.out' })
    }
    const onMagLeave = () => {
      if (magBtn) gsap.to(magBtn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' })
    }
    magWrapper?.addEventListener('mousemove', onMagMove)
    magWrapper?.addEventListener('mouseleave', onMagLeave)

    // ── Text reveal on scroll ──
    gsap.utils.toArray<HTMLElement>('.reveal-text').forEach((text) => {
      gsap.from(text, { scrollTrigger: { trigger: text, start: 'top 85%' }, y: 40, opacity: 0, duration: 1, ease: 'power3.out' })
    })

    // ── FAQ accordion ──
    const faqQuestions = document.querySelectorAll('.faq-question')
    const onFaqClick = (q: Element) => () => {
      const answer = q.nextElementSibling
      const isOpen = answer?.classList.contains('open')
      document.querySelectorAll('.faq-answer').forEach((a) => a.classList.remove('open'))
      document.querySelectorAll('.faq-question').forEach((qq) => qq.classList.remove('active'))
      if (!isOpen) {
        answer?.classList.add('open')
        q.classList.add('active')
      }
    }
    const faqHandlers: Array<{ el: Element; fn: () => void }> = []
    faqQuestions.forEach((q) => {
      const fn = onFaqClick(q)
      q.addEventListener('click', fn)
      faqHandlers.push({ el: q, fn })
    })

    // ── Social proof counter animation ──
    gsap.utils.toArray<HTMLElement>('.sp-num').forEach((num) => {
      const target = parseInt(num.innerText, 10)
      const suffix = num.innerText.includes('★') ? '★' : num.innerText.includes('+') ? '+' : ''
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        scrollTrigger: { trigger: num, start: 'top 90%' },
        duration: 2,
        ease: 'power1.out',
        snap: { val: 1 },
        onUpdate: () => {
          num.innerText = Math.ceil(obj.val) + suffix
        },
      })
    })

    // ── Stock urgency pulse ──
    const pulseTweens: gsap.core.Tween[] = []
    document.querySelectorAll('.stock-pill.low').forEach((pill) => {
      pulseTweens.push(gsap.to(pill, { scale: 1.05, duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut' }))
    })

    // ── WhatsApp click tracking (CRO) ──
    const waLinks = document.querySelectorAll('a[href*="wa.me"]')
    const onWaClick = (link: Element) => () => {
      console.log('WhatsApp CTA clicked:', (link as HTMLAnchorElement).href)
    }
    const waHandlers: Array<{ el: Element; fn: () => void }> = []
    waLinks.forEach((link) => {
      const fn = onWaClick(link)
      link.addEventListener('click', fn)
      waHandlers.push({ el: link, fn })
    })

    // ── Cleanup ──
    return () => {
      clearInterval(loadInterval)
      if (scrambleInterval) clearInterval(scrambleInterval)

      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousemove', onParallax)

      hoverTargets.forEach((t) => {
        t.removeEventListener('mouseenter', onEnterHover)
        t.removeEventListener('mouseleave', onLeaveHover)
      })
      viewTargets.forEach((t) => {
        t.removeEventListener('mouseenter', onEnterView)
        t.removeEventListener('mouseleave', onLeaveView)
      })
      tiltHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      })
      faqHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      waHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      magWrapper?.removeEventListener('mousemove', onMagMove)
      magWrapper?.removeEventListener('mouseleave', onMagLeave)

      pulseTweens.forEach((tw) => tw.kill())
      marqueeTween.kill()
      marqueeTrigger.kill()
      themeTriggers.forEach((st) => st.kill())
      ScrollTrigger.getAll().forEach((st) => st.kill())

      gsap.ticker.remove(tickerFn)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      {/* PRELOADER */}
      <div className="preloader">
        <div className="loader-counter">0%</div>
      </div>

      <div className="noise-overlay" />
      <div className="custom-cursor" id="cursor" />

      <a
        href={waLink("Bonjour Chez Florence, je suis intéressé par vos lapins.")}
        target="_blank"
        rel="noopener noreferrer"
        className="sticky-cta-mobile"
      >
        Commander sur WhatsApp →
      </a>

      <header>
        <div className="logo-area hover-target">
          <div className="logo-blob" />
          <span>Chez Florence</span>
        </div>
        <div className="nav-center">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="nav-btn orange hover-target">WhatsApp</a>
          <a href="#lapins" className="nav-btn hover-target">Nos Lapins</a>
        </div>
        <a href="#tarifs" className="btn-outline hover-target">
          <span className="pixel-square" /> Commander
        </a>
      </header>

      <main>
        {/* HERO */}
        <section className="hero-section" id="hero" data-theme="light">
          <div className="jellyfish-bg" />
          <div className="title-container">
            <div className="title-small">Chez</div>
            <h1 className="title-main" data-text="FLORENCE">FLORENCE</h1>
          </div>
          <p className="hero-sub reveal-text">Des lapins de race élevés avec soin, disponibles pour particuliers, restaurateurs &amp; éleveurs PME. Élevage artisanal · Abidjan, Côte d&apos;Ivoire.</p>

          <div className="social-proof-bar reveal-text">
            <div className="sp-item"><div className="sp-num">150+</div><div className="sp-label">Clients satisfaits</div></div>
            <div className="sp-item"><div className="sp-num">500+</div><div className="sp-label">Lapins vendus</div></div>
            <div className="sp-item"><div className="sp-num">3</div><div className="sp-label">Races disponibles</div></div>
            <div className="sp-item"><div className="sp-num">4.9★</div><div className="sp-label">Note moyenne</div></div>
          </div>

          <div className="cards-container">
            <a href={waLink("Bonjour, je suis intéressé par le format à l'unité (15 000 FCFA).")} target="_blank" rel="noopener noreferrer" className="card hover-target" data-tilt="true">
              <div className="card-tag">À l&apos;unité</div>
              <div className="card-price">15 000</div>
              <div className="card-action">1 lapin, environ 2 kg — Réserver</div>
            </a>
            <a href={waLink("Bonjour, je suis intéressé par le format Duo (25 000 FCFA).")} target="_blank" rel="noopener noreferrer" className="card hover-target" data-tilt="true">
              <div className="card-tag">Le Duo</div>
              <div className="card-price">25 000</div>
              <div className="card-action">2 lapins, format le plus demandé — Réserver</div>
            </a>
            <a href={waLink("Bonjour, je suis intéressé par le format Restaurateur (lot de 6, 80 000 FCFA).")} target="_blank" rel="noopener noreferrer" className="card hover-target" data-tilt="true">
              <div className="card-tag">Restaurateur</div>
              <div className="card-price">80 000</div>
              <div className="card-action">Lot de 6, tarif pro — Réserver</div>
            </a>
          </div>
        </section>

        {/* HISTOIRE */}
        <section className="mission-section" id="histoire" data-theme="dark">
          <div className="mission-layout">
            <div>
              <div className="eyebrow">No. 02 — Notre Histoire</div>
              <div className="mission-text-huge reveal-text">Nous élevons<br />avec<br /><span style={{ color: 'var(--accent-orange)' }}>soin.</span></div>
            </div>
            <div className="mission-description">
              <p className="reveal-text">Nous élevons et sélectionnons nos lapins avec soin — pesée précise, bonne santé, et un accompagnement complet du choix jusqu&apos;à la vente. L&apos;élevage qui vous connecte directement aux plus beaux lapins, en toute confiance, partout en Côte d&apos;Ivoire.</p>
            </div>
          </div>
          <div className="marquee-container">
            <div className="marquee-inner">
              <span>DISPONIBLE · RETRAIT RAPIDE · QUALITÉ CONTRÔLÉE · PRÊT À LA VENTE · EN STOCK · ENVIRON 2 KG · LAPIN FRAIS · SÉLECTIONNÉ · PESÉ AVEC SOIN ·</span>
              <span>DISPONIBLE · RETRAIT RAPIDE · QUALITÉ CONTRÔLÉE · PRÊT À LA VENTE · EN STOCK · ENVIRON 2 KG · LAPIN FRAIS · SÉLECTIONNÉ · PESÉ AVEC SOIN ·</span>
            </div>
          </div>
        </section>

        {/* GARANTIES */}
        <section id="garanties" data-theme="light">
          <div className="section-head">
            <div>
              <div className="eyebrow">Nos Engagements — Santé · Race · Suivi</div>
              <h2 className="section-title reveal-text">Nos<br />Garanties</h2>
            </div>
          </div>
          <div className="garanties-grid">
            <div className="garantie-item reveal-text">
              <div className="garantie-num">01.</div>
              <div className="garantie-title">Santé Vérifiée</div>
              <div className="garantie-desc">Chaque lapin est examiné avant la vente : poids, pelage et comportement contrôlés avec soin. Aucun animal malade ne quitte notre élevage.</div>
            </div>
            <div className="garantie-item reveal-text">
              <div className="garantie-num">02.</div>
              <div className="garantie-title">Pesée &amp; Classement</div>
              <div className="garantie-desc">Chaque lapin est pesé et classé avec précision — du format simple au lot pour les restaurateurs. Pas de surprise sur le poids.</div>
            </div>
            <div className="garantie-item reveal-text">
              <div className="garantie-num">03.</div>
              <div className="garantie-title">Suivi Après-Vente</div>
              <div className="garantie-desc">Conseils de conservation et d&apos;élevage disponibles après chaque achat. On reste en contact pour vous accompagner.</div>
            </div>
            <div className="garantie-item reveal-text">
              <div className="garantie-num">04.</div>
              <div className="garantie-title">Remise en Main Propre</div>
              <div className="garantie-desc">Retrait sur place à Azaguié Gare ou livraison encadrée, selon votre disponibilité et votre zone.</div>
            </div>
          </div>
        </section>

        {/* TARIFS */}
        <section id="tarifs" data-theme="dark">
          <div className="section-head">
            <div>
              <div className="eyebrow">No. 05 — Tarifs</div>
              <h2 className="section-title reveal-text">Un Tarif Pour<br />Chaque Besoin</h2>
            </div>
            <div className="section-desc">Le prix dépend du poids et de la quantité — à l&apos;unité, en duo, ou en gros pour les professionnels.</div>
          </div>
          <div className="pricing-grid">
            <div className="price-card reveal-text">
              <div className="price-tag">Format Simple</div>
              <div className="price-amount">15 000</div>
              <div className="price-sub">FCFA · 1 lapin, environ 2 kg</div>
              <ul className="price-features">
                <li>Environ 2 kg</li>
                <li>Lapin sélectionné et pesé</li>
                <li>Disponible toute la semaine</li>
                <li>Retrait ou livraison</li>
              </ul>
              <a href={waLink("Bonjour, je suis intéressé par le format à l'unité (15 000 FCFA).")} target="_blank" rel="noopener noreferrer" className="price-cta hover-target">Réserver</a>
            </div>
            <div className="price-card popular reveal-text">
              <div className="price-badge">Le plus demandé</div>
              <div className="price-tag">Le Duo</div>
              <div className="price-amount">25 000</div>
              <div className="price-sub">FCFA · 2 lapins, environ 1,6 kg chacun</div>
              <ul className="price-features">
                <li>Environ 1,6 kg par lapin</li>
                <li>Le format le plus demandé</li>
                <li>Idéal pour un repas en famille</li>
                <li>Retrait ou livraison</li>
              </ul>
              <a href={waLink("Bonjour, je suis intéressé par le format Duo (25 000 FCFA).")} target="_blank" rel="noopener noreferrer" className="price-cta hover-target">Réserver</a>
            </div>
            <div className="price-card reveal-text">
              <div className="price-tag">Format Restaurateur</div>
              <div className="price-amount">80 000</div>
              <div className="price-sub">FCFA · Lot de 6 lapins</div>
              <ul className="price-features">
                <li>Lot de 6 lapins</li>
                <li>Tarif préférentiel volume</li>
                <li>Pour restaurateurs &amp; mini-restos</li>
                <li>Livraison possible selon zone</li>
              </ul>
              <a href={waLink("Bonjour, je suis intéressé par le format Restaurateur (lot de 6, 80 000 FCFA).")} target="_blank" rel="noopener noreferrer" className="price-cta hover-target">Réserver</a>
            </div>
          </div>
        </section>

        {/* NOS LAPINS */}
        <section id="lapins" data-theme="light" style={{ paddingBottom: 100 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow">No. 08 — Nos Lapins</div>
              <h2 className="section-title reveal-text">En Vedette</h2>
            </div>
            <div className="section-desc">Ajoutés par notre équipe, prêts à la vente. Azaguié Gare.</div>
          </div>
          <div className="projects-grid">
            <a href={waLink("Bonjour, le lapin Hollandais est-il toujours disponible ?")} target="_blank" rel="noopener noreferrer" className="project-item hover-view">
              <div className="project-img-box">
                <div className="stock-pill">5 en stock</div>
                <img src="/IMAGES/hollandais.jpg" alt="Lapin Hollandais noir et blanc, race pure, élevé avec soin à Abidjan" loading="lazy" />
              </div>
              <div className="project-meta"><div>Hollandais</div><div className="p-price">8 500 FCFA</div></div>
              <div className="project-sub">Lot mixte · 1.5 kg · Noir et blanc — Prix net</div>
              <div className="last-updated">Mis à jour il y a 2 heures</div>
            </a>
            <a href={waLink("Bonjour, le lapin Angora français est-il toujours disponible ?")} target="_blank" rel="noopener noreferrer" className="project-item offset hover-view">
              <div className="project-img-box">
                <div className="stock-pill low">4 en stock</div>
                <img src="/IMAGES/angora.jpg" alt="Lapin Angora français blanc crème, pelage soyeux, disponible à Abidjan" loading="lazy" />
              </div>
              <div className="project-meta"><div>Angora Français</div><div className="p-price">9 000 FCFA</div></div>
              <div className="project-sub">Femelle · 1.8 kg · Blanc crème — Kit toilettage offert</div>
              <div className="last-updated">Mis à jour il y a 2 heures</div>
            </a>
            <a href={waLink("Bonjour, le lapin Rex est-il toujours disponible ?")} target="_blank" rel="noopener noreferrer" className="project-item hover-view">
              <div className="project-img-box">
                <div className="stock-pill low">3 en stock</div>
                <img src="/IMAGES/rex.jpg" alt="Lapin Rex gris ardoise, race pure, poids 2.1 kg, élevage Abidjan" loading="lazy" />
              </div>
              <div className="project-meta"><div>Rex</div><div className="p-price">10 000 FCFA</div></div>
              <div className="project-sub">Mâle · 2.1 kg · Gris ardoise — Prix net</div>
              <div className="last-updated">Mis à jour il y a 2 heures</div>
            </a>
          </div>
          <div className="lapins-cta-row">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-line hover-target">Voir tout le catalogue →</a>
          </div>
        </section>

        {/* TÉMOIGNAGES */}
        <section className="testimonials-section" id="temoignages" data-theme="dark">
          <div className="section-head">
            <div>
              <div className="eyebrow">No. 09 — Témoignages</div>
              <h2 className="section-title reveal-text">Ils Nous<br />Font Confiance</h2>
            </div>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card reveal-text">
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">&quot;J&apos;ai commandé le format Duo pour un repas de famille. Les lapins étaient bien pesés, en excellente santé. La livraison a été rapide. Je recommande vivement !&quot;</div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">AK</div>
                <div>
                  <div className="testimonial-name">Aminata K.</div>
                  <div className="testimonial-role">Cliente particulière · Abidjan</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card reveal-text">
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">&quot;En tant que restaurateur, j&apos;apprécie la régularité et la qualité. Le lot de 6 est parfait pour mon restaurant. Les lapins sont toujours frais et bien préparés.&quot;</div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">KB</div>
                <div>
                  <div className="testimonial-name">Koffi B.</div>
                  <div className="testimonial-role">Chef restaurateur · Cocody</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card reveal-text">
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">&quot;Je revends les lapins dans ma boutique. Chez Florence me fournit en volume avec des prix intéressants. Le suivi est excellent, ils répondent toujours vite sur WhatsApp.&quot;</div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">TA</div>
                <div>
                  <div className="testimonial-name">Thomas A.</div>
                  <div className="testimonial-role">Éleveur PME · Bingerville</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section" id="faq" data-theme="light">
          <div className="section-head">
            <div>
              <div className="eyebrow">No. 10 — Questions Fréquentes</div>
              <h2 className="section-title reveal-text">Vous Avez<br />Des Questions ?</h2>
            </div>
          </div>
          <div className="faq-grid">
            <div className="faq-item reveal-text">
              <div className="faq-question hover-target">Quel est le prix d&apos;un lapin à Abidjan ?</div>
              <div className="faq-answer">Chez Florence, les prix commencent à 8 500 FCFA pour un lapin Hollandais et atteignent 15 000 FCFA pour un lapin de 2 kg. Le format Duo (2 lapins) est à 25 000 FCFA. Les restaurateurs bénéficient d&apos;un tarif préférentiel à 80 000 FCFA le lot de 6.</div>
            </div>
            <div className="faq-item reveal-text">
              <div className="faq-question hover-target">Comment commander un lapin ?</div>
              <div className="faq-answer">La commande se fait exclusivement via WhatsApp au {formatWhatsappDisplay(process.env.NEXT_PUBLIC_WHATSAPP || '')}. Envoyez-nous un message avec la race et le format souhaité. Nous confirmons la disponibilité et organisons le retrait ou la livraison.</div>
            </div>
            <div className="faq-item reveal-text">
              <div className="faq-question hover-target">Les lapins sont-ils sains ?</div>
              <div className="faq-answer">Oui. Chaque lapin est examiné avant la vente : poids vérifié, pelage contrôlé, comportement observé. Nous ne vendons aucun animal malade. Un suivi après-vente est également proposé.</div>
            </div>
            <div className="faq-item reveal-text">
              <div className="faq-question hover-target">Où puis-je retirer ma commande ?</div>
              <div className="faq-answer">Le retrait se fait sur place à Azaguié Gare. La livraison est également possible selon votre zone à Abidjan. Contactez-nous sur WhatsApp pour organiser la livraison.</div>
            </div>
            <div className="faq-item reveal-text">
              <div className="faq-question hover-target">Quels modes de paiement acceptez-vous ?</div>
              <div className="faq-answer">Nous acceptons le paiement en espèces au retrait, ainsi que les transferts Mobile Money (Orange Money, MTN Mobile Money, Wave). Le paiement se fait à la livraison ou au retrait.</div>
            </div>
            <div className="faq-item reveal-text">
              <div className="faq-question hover-target">Proposez-vous des conseils d&apos;élevage ?</div>
              <div className="faq-answer">Oui, nous proposons un suivi après-vente avec des conseils de conservation et d&apos;élevage. Nous accompagnons également les éleveurs débutants dans la mise en place de leur élevage.</div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER / CONTACT */}
      <footer id="contact" data-theme="dark">
        <div className="footer-main">
          <h2 className="footer-title">Parlons de<br />votre lapin.</h2>
          <p className="footer-sub">Une question sur une race, un prix, une disponibilité ? Écrivez-nous — on vous répond vite.</p>
          <div className="magnetic-btn-wrapper hover-target">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="magnetic-btn">WhatsApp</a>
          </div>
          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-label">Email</div>
              <div className="contact-value"><a href="mailto:wthomasss06@gmail.com" className="hover-target">wthomasss06@gmail.com</a></div>
            </div>
            <div className="contact-item">
              <div className="contact-label">WhatsApp</div>
              <div className="contact-value"><a href={waLink()} className="hover-target">{formatWhatsappDisplay(process.env.NEXT_PUBLIC_WHATSAPP || '')}</a></div>
            </div>
            <div className="contact-item">
              <div className="contact-label">Adresse</div>
              <div className="contact-value">Abidjan, Côte d&apos;Ivoire</div>
            </div>
            <div className="contact-item">
              <div className="contact-label">Horaires</div>
              <div className="contact-value">Lun–Ven 8h–18h · Sam 9h–14h · Dim fermé</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 CHEZ FLORENCE — TOUS DROITS RÉSERVÉS</div>
          <div className="footer-links">
            <a href="#faq" className="hover-target">FAQ</a>
            <a href="#tarifs" className="hover-target">Tarifs</a>
            <a href="/aide" className="hover-target">Aide</a>
            <a href="/confidentialite" className="hover-target">Confidentialité</a>
            <a href="/conditions" className="hover-target">Conditions</a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover-target">WhatsApp</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        :root {
            --bg-light: #f3f0ea;
            --bg-dark: #0c0906;
            --text-dark: #171310;
            --text-light: #f3f0ea;
            --accent-orange: #e8622c;
            --font-main: 'Syne', sans-serif;
            --font-pixel: 'Silkscreen', sans-serif;
            --current-bg: var(--bg-light);
            --current-text: var(--text-dark);
        }
        * { box-sizing: border-box; cursor: none; }
        body {
            margin: 0; padding: 0;
            background-color: var(--current-bg);
            color: var(--current-text);
            font-family: var(--font-main);
            overflow-x: hidden;
            transition: background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1), color 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 900px) {
            * { cursor: auto; }
        }
      `}</style>
      <style jsx>{`
        .noise-overlay {
            position: fixed; top: -50%; left: -50%; width: 200%; height: 200%;
            background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
            opacity: 0.05; pointer-events: none; z-index: 9999;
            animation: noise 0.2s infinite; mix-blend-mode: difference;
        }
        @keyframes noise { 0% { transform: translate(0, 0); } 10% { transform: translate(-5%, -5%); } 20% { transform: translate(-10%, 5%); } 30% { transform: translate(5%, -10%); } 40% { transform: translate(-5%, 15%); } 50% { transform: translate(-10%, 5%); } 60% { transform: translate(15%, 0); } 70% { transform: translate(0, 15%); } 80% { transform: translate(3%, 35%); } 90% { transform: translate(-10%, 10%); } 100% { transform: translate(0, 0); } }

        .preloader {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: var(--bg-dark); color: var(--text-light);
            display: flex; justify-content: center; align-items: center;
            z-index: 10000; flex-direction: column;
        }
        .loader-counter { font-family: var(--font-pixel); font-size: 15vw; line-height: 1; color: var(--accent-orange); }

        .custom-cursor {
            width: 10px; height: 10px; background-color: var(--current-text);
            border-radius: 50%; position: fixed; top: 0; left: 0; pointer-events: none;
            z-index: 99999; transition: width 0.3s, height 0.3s, background-color 0.3s;
            mix-blend-mode: difference; transform: translate(-50%, -50%);
        }
        .custom-cursor.hovered { width: 60px; height: 60px; background-color: var(--accent-orange); mix-blend-mode: normal; }
        .custom-cursor.view-mode::after {
            content: 'VOIR'; font-size: 10px; font-family: var(--font-main); color: var(--bg-dark);
            font-weight: 800; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

        .sticky-cta-mobile {
            display: none; position: fixed; bottom: 0; left: 0; width: 100%;
            background: var(--accent-orange); color: var(--bg-dark); text-align: center;
            padding: 16px; font-weight: 800; text-transform: uppercase; font-size: 0.9rem;
            letter-spacing: 1px; z-index: 9998; text-decoration: none;
        }

        header { display: flex; justify-content: space-between; align-items: center; padding: 30px 50px; position: fixed; top: 0; width: 100%; z-index: 100; mix-blend-mode: difference; color: white; }
        .logo-area { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.1rem; text-transform: uppercase; }
        .logo-blob {
            width: 32px; height: 24px; background: var(--accent-orange);
            border-radius: 40% 60% 60% 40% / 50% 30% 70% 50%;
            animation: blobby 6s infinite ease-in-out;
        }
        @keyframes blobby {
            0%, 100% { border-radius: 40% 60% 60% 40% / 50% 30% 70% 50%; }
            50% { border-radius: 60% 40% 40% 60% / 30% 60% 40% 70%; }
        }
        .nav-center { display: flex; background-color: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 6px; border-radius: 30px; gap: 4px; }
        .nav-btn { padding: 10px 24px; border-radius: 24px; border: none; font-family: var(--font-main); font-size: 0.9rem; font-weight: 600; text-decoration: none; color: white; transition: 0.3s; }
        .nav-btn.orange { background-color: var(--accent-orange); color: var(--bg-dark); }
        .btn-outline { border: 1px solid white; padding: 12px 24px; border-radius: 12px; background: transparent; font-family: var(--font-main); font-weight: 600; color: white; display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .btn-outline .pixel-square { width: 8px; height: 8px; background: white; display: inline-block; }

        section { min-height: 100vh; width: 100%; padding: 140px 50px 80px 50px; position: relative; }

        .hero-section { display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .jellyfish-bg {
            position: absolute; width: 550px; height: 550px;
            background: url('/IMAGES/hero-bg.jpg') center/cover;
            mix-blend-mode: multiply; mask-image: radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%); -webkit-mask-image: radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%);
            opacity: 0.85; pointer-events: none; z-index: 1; transition: transform 0.1s linear;
        }
        .title-container { text-align: center; position: relative; z-index: 2; margin-bottom: -40px; }
        .title-small { font-size: 1.8rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; line-height: 1; margin-left: -120px; display: flex; align-items: center; justify-content: center; gap: 4px; }
        .title-small::after { content: ''; width: 8px; height: 8px; background-color: var(--current-text); display: inline-block; }
        .title-main { font-family: var(--font-pixel); font-size: 7.5vw; font-weight: 700; text-transform: uppercase; line-height: 0.9; letter-spacing: -3px; }
        .hero-sub { text-align: center; max-width: 480px; margin: 10px auto 0; font-size: 1.05rem; color: #776f63; position: relative; z-index: 2; }

        .social-proof-bar { display: flex; justify-content: center; gap: 40px; margin-top: 30px; z-index: 2; position: relative; flex-wrap: wrap; }
        .sp-item { text-align: center; }
        .sp-num { font-family: var(--font-pixel); font-size: 1.4rem; color: var(--accent-orange); }
        .sp-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; margin-top: 4px; }

        .cards-container { display: flex; gap: 30px; z-index: 3; max-width: 1100px; justify-content: center; margin-top: 40px; perspective: 1000px; flex-wrap: wrap; }
        .card { background: rgba(255, 255, 255, 0.25); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 24px; padding: 40px 30px; width: 260px; height: 280px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; transform-style: preserve-3d; transition: border-color 0.4s; text-decoration: none; color: inherit; }
        .card:hover { border-color: var(--accent-orange); }
        .card-tag { background: white; color: var(--text-dark); padding: 6px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; transform: translateZ(20px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .card-price { font-family: var(--font-pixel); font-size: 1.6rem; transform: translateZ(30px); }
        .card-action { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; max-width: 150px; line-height: 1.4; color: rgba(0,0,0,0.8); transform: translateZ(15px); }

        .mission-section { display: flex; flex-direction: column; justify-content: center; }
        .mission-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: flex-start; margin-top: 40px; }
        .mission-text-huge { font-size: 5vw; font-weight: 700; line-height: 1; text-transform: uppercase; }
        .mission-description { font-size: 1.5rem; line-height: 1.5; color: #a39c8f; margin-top: 20px; }
        .eyebrow { font-size: 0.85rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; opacity: 0.55; margin-bottom: 10px; }

        .marquee-container { width: 100vw; overflow: hidden; position: absolute; bottom: 5%; left: 0; background: var(--accent-orange); color: var(--bg-dark); padding: 15px 0; transform: rotate(-2deg) scale(1.05); }
        .marquee-inner { display: flex; white-space: nowrap; font-family: var(--font-pixel); font-size: 2.2rem; text-transform: uppercase; gap: 40px; font-weight: 700; }

        .section-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; flex-wrap: wrap; margin-bottom: 60px; }
        .section-head .eyebrow { margin-bottom: 14px; }
        .section-title { font-size: 4vw; font-weight: 700; line-height: 0.95; text-transform: uppercase; }
        .section-desc { max-width: 380px; font-size: 1.05rem; line-height: 1.5; color: #a39c8f; }

        .garanties-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
        .garantie-item { border-top: 1px solid rgba(150,150,150,0.3); padding-top: 20px; }
        .garantie-num { font-family: var(--font-pixel); color: var(--accent-orange); font-size: 1.1rem; margin-bottom: 14px; }
        .garantie-title { font-size: 1.15rem; font-weight: 700; margin-bottom: 10px; }
        .garantie-desc { font-size: 0.95rem; line-height: 1.5; opacity: 0.7; }

        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 20px; }
        .price-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 24px; padding: 40px 34px; display: flex; flex-direction: column; transition: border-color 0.4s, transform 0.4s; }
        .price-card:hover { border-color: var(--accent-orange); transform: translateY(-8px); }
        .price-card.popular { border-color: var(--accent-orange); background: rgba(232,98,44,0.08); }
        .price-badge { align-self: flex-start; background: var(--accent-orange); color: var(--bg-dark); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 18px; }
        .price-tag { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; margin-bottom: 10px; }
        .price-amount { font-family: var(--font-pixel); font-size: 2.6rem; color: var(--accent-orange); line-height: 1; }
        .price-sub { font-size: 0.9rem; opacity: 0.6; margin: 10px 0 24px; }
        .price-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px; flex-grow: 1; padding: 0; }
        .price-features li { font-size: 0.9rem; padding-left: 20px; position: relative; opacity: 0.85; }
        .price-features li::before { content: ''; position: absolute; left: 0; top: 7px; width: 8px; height: 8px; background: var(--accent-orange); }
        .price-cta { text-align: center; padding: 14px; border-radius: 12px; background: var(--current-text); color: var(--current-bg); text-decoration: none; font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; transition: 0.3s; }
        .price-card.popular .price-cta { background: var(--accent-orange); color: var(--bg-dark); }
        .price-cta:hover { opacity: 0.8; }

        .projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 60px; }
        .project-item { display: flex; flex-direction: column; gap: 20px; text-decoration: none; color: inherit; }
        .project-item.offset { transform: translateY(60px); }
        .project-img-box { width: 100%; height: 420px; overflow: hidden; border-radius: 24px; position: relative; }
        .project-img-box :global(img) { width: 100%; height: 110%; object-fit: cover; filter: grayscale(1); transition: filter 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: center; }
        .project-item:hover :global(img) { filter: grayscale(0); transform: scale(1.05) rotate(1deg); }
        .stock-pill { position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.6); backdrop-filter: blur(6px); color: white; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; z-index: 2; }
        .stock-pill.low { background: rgba(232,98,44,0.85); }
        .project-meta { display: flex; justify-content: space-between; font-weight: 700; text-transform: uppercase; font-size: 1.1rem; border-top: 1px solid rgba(150,150,150,0.3); padding-top: 15px; }
        .project-meta .p-price { color: var(--accent-orange); }
        .project-sub { font-size: 0.85rem; opacity: 0.6; text-transform: none; font-weight: 400; margin-top: -8px; }
        .last-updated { font-size: 0.7rem; opacity: 0.4; margin-top: 4px; }
        .lapins-cta-row { display: flex; justify-content: center; margin-top: 60px; }
        .btn-line { border-bottom: 2px solid var(--current-text); padding-bottom: 4px; text-decoration: none; color: inherit; font-weight: 700; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; }

        .testimonials-section { padding: 100px 50px; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 40px; }
        .testimonial-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 24px; padding: 34px; transition: border-color 0.4s; }
        .testimonial-card:hover { border-color: var(--accent-orange); }
        .testimonial-stars { color: var(--accent-orange); font-size: 1rem; margin-bottom: 16px; }
        .testimonial-text { font-size: 1rem; line-height: 1.6; opacity: 0.85; margin-bottom: 20px; }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .testimonial-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--accent-orange); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; color: var(--bg-dark); }
        .testimonial-name { font-weight: 700; font-size: 0.9rem; }
        .testimonial-role { font-size: 0.75rem; opacity: 0.5; }

        .faq-section { padding: 100px 50px; }
        .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; }
        .faq-item { border-bottom: 1px solid rgba(150,150,150,0.3); padding-bottom: 24px; }
        .faq-question { font-weight: 700; font-size: 1.1rem; margin-bottom: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .faq-question::after { content: '+'; font-family: var(--font-pixel); color: var(--accent-orange); font-size: 1.2rem; }
        .faq-question.active::after { content: '−'; }
        .faq-answer { font-size: 0.95rem; line-height: 1.6; opacity: 0.7; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, opacity 0.4s ease; }
        .faq-answer.open { max-height: 200px; opacity: 0.7; }

        footer { min-height: 100vh; background-color: var(--bg-dark); color: var(--text-light); display: flex; flex-direction: column; justify-content: space-between; padding: 100px 50px 40px 50px; position: relative; overflow: hidden; }
        .footer-main { display: flex; flex-direction: column; align-items: center; justify-content: center; flex-grow: 1; z-index: 2; }
        .footer-title { font-family: var(--font-pixel); font-size: 8vw; text-transform: uppercase; text-align: center; margin-bottom: 20px; line-height: 0.9; }
        .footer-sub { text-align: center; max-width: 420px; opacity: 0.6; margin-bottom: 50px; }

        .magnetic-btn-wrapper { position: relative; width: 250px; height: 250px; display: flex; justify-content: center; align-items: center; }
        .magnetic-btn { width: 180px; height: 180px; background-color: var(--accent-orange); border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--bg-dark); font-weight: 800; text-transform: uppercase; font-size: 1.2rem; letter-spacing: 1px; transition: transform 0.1s linear; text-decoration: none; text-align: center; }

        .contact-details { display: flex; gap: 50px; justify-content: center; margin-top: 60px; flex-wrap: wrap; z-index: 2; }
        .contact-item { text-align: center; }
        .contact-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.5; margin-bottom: 8px; }
        .contact-value { font-size: 1rem; }
        .contact-value :global(a) { color: var(--text-light); text-decoration: none; }
        .contact-value :global(a:hover) { color: var(--accent-orange); }

        .footer-bottom { display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 20px; font-size: 0.85rem; color: #666; z-index: 2; text-transform: uppercase; flex-wrap: wrap; gap: 10px; }
        .footer-bottom :global(a) { color: #666; text-decoration: none; }
        .footer-bottom :global(a:hover) { color: var(--accent-orange); }
        .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }

        @media (max-width: 900px) {
            .nav-center, .btn-outline { display: none; }
            .sticky-cta-mobile { display: block; }
            .mission-layout, .garanties-grid, .pricing-grid, .projects-grid, .testimonials-grid, .faq-grid { grid-template-columns: 1fr; }
            .title-small { margin-left: 0; }
            .title-main { font-size: 14vw; }
            .section-title { font-size: 9vw; }
            .footer-title { font-size: 13vw; }
            .contact-details { gap: 30px; }
            section { padding: 120px 24px 60px; }
            .testimonials-section, .faq-section { padding: 80px 24px; }
        }
      `}</style>
    </>
  )
}
