'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import RainbowText from './RainbowText'
import MapView from './MapView'
import ContactMorphButton from './ContactMorphButton'
import HoverFadeText from './HoverFadeText'
import './Footer.css'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''
const waHref = WHATSAPP ? `https://wa.me/${WHATSAPP}` : '#'

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos Lapins', href: '/#lapins' },
  { label: 'Tarifs', href: '/#tarifs' },
  { label: 'Notre Histoire', href: '/#histoire' },
  { label: 'FAQ', href: '/#faq' },
]
const INFO_LINKS = [
  { label: 'Aide', href: '/aide' },
  { label: 'Conditions Générales', href: '/conditions' },
  { label: 'Confidentialité', href: '/confidentialite' },
]

// ── Toutes les images projectile (loader + curseur txt) ──────────────
const BUNNY_IMAGES = [
  // Loader
  '/IMAGES/loader/bunny-marble.png',
  '/IMAGES/loader/bunny-purple.webp',
  '/IMAGES/loader/bunny-red.webp',
  '/IMAGES/loader/bunny-rust.webp',
  '/IMAGES/loader/bunny-amber.webp',
  // Curseur / projectiles
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/k.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/kkkk.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ll.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/llllllll.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/p.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/v.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/www.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/b.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/BB.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/bbb.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/bunny-amberB.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_07_14DDD.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_17_17hh.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_17_24bb.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_19_56.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_20_16.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_20_26.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_43_11.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_45_34.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_46_57.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_50_53.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_53_20.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_06_25.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_08_38.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_10_07.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_13_22.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32ddddddd.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32gggg.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32ssss.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32xxxx.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05ddd.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05ssss.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05xx.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05zzzz.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_23_18cccc.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_23_18xx.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_34_26nnnnnn.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_34_26zzz.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_37_54.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_37_54ooo.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_37_54v.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_39_32aaaaa.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_39_32bbbbll.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_39_32qq.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47ccc.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47ddd.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47hhhhh.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47qqq.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47sssss.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47vvvvv.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47bbbbb.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47m.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47nn.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47nnnnnn.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ddddd.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/dddddddddd.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/h.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/hh.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/HHHH.webp',
  '/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/jjjj.webp',
]

function ProjectileBunnies() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const particles: HTMLImageElement[] = []
    const delayedCalls: gsap.core.Tween[] = []

    const numParticles = 70

    for (let i = 0; i < numParticles; i++) {
      const img = document.createElement('img')
      img.className = 'projectile-bunny'
      img.src = BUNNY_IMAGES[Math.floor(Math.random() * BUNNY_IMAGES.length)]
      img.alt = ''
      container.appendChild(img)
      particles.push(img)

      const dc = gsap.delayedCall(Math.random() * 2, () => animateParticle(img))
      delayedCalls.push(dc)
    }

    function animateParticle(particle: HTMLImageElement) {
      const h = container.offsetHeight || window.innerHeight
      const w = container.offsetWidth || window.innerWidth

      gsap.set(particle, {
        x: 0,
        y: 50,
        opacity: 1,
        scale: Math.random() * 0.6 + 0.4,
        rotation: Math.random() * 360,
      })

      const launchDuration = Math.random() * 0.3 + 0.2
      const fallDuration = 1.0
      const topY = -(Math.random() * (h * 0.7) + h * 0.3)
      const randomX = (Math.random() - 0.5) * (w * 1.2)

      const twX = gsap.to(particle, {
        x: randomX,
        rotation: `+=${(Math.random() - 0.5) * 720}`,
        duration: launchDuration + fallDuration,
        ease: 'power1.out',
      })
      delayedCalls.push(twX)

      const tl = gsap.timeline({
        onComplete: () => {
          const dc = gsap.delayedCall(Math.random() * 0.5, () => animateParticle(particle))
          delayedCalls.push(dc)
        },
      })

      tl.to(particle, {
        y: topY,
        duration: launchDuration,
        ease: 'power4.out',
      }).to(particle, {
        y: topY + h * 0.15,
        opacity: 0,
        duration: fallDuration,
        ease: 'power2.in',
      })

      delayedCalls.push(tl)
    }

    return () => {
      delayedCalls.forEach((dc) => dc.kill())
      gsap.killTweensOf(particles)
      particles.forEach((p) => p.remove())
    }
  }, [])

  return (
    <div className="projectile-container" aria-hidden="true">
      <div className="projectile-glow" />
    </div>
  )
}

export default function Footer() {
  return (
    <footer id="contact">
      <ProjectileBunnies />

      <div className="footer-main">
        <h2 className="footer-title elastic-title">
          Parlons de
          <br />
          votre lapin.
        </h2>
        <RainbowText
          text="Une question sur une race, un prix, une disponibilité ? Écrivez-nous — on vous répond vite."
          variant="white"
          className="footer-sub"
        />

        <div className="footer-grid">
          {/* Colonne info + localisation */}
          <div className="footer-info-col">
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-label">Email</div>
                <div className="contact-value">
                  <a href="mailto:wthomasss06@gmail.com" className="hover-target">
                    wthomasss06@gmail.com
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-label">WhatsApp</div>
                <div className="contact-value">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-target"
                  >
                    +225 01 42 50 77 50
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-label">Téléphone</div>
                <div className="contact-value">
                  <a href="tel:+2250101314063" className="hover-target">
                    +225 01 01 31 40 63
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-label">Horaires</div>
                <div className="contact-value">Lun–Ven 8h–18h · Sam 9h–14h</div>
              </div>
            </div>
          </div>

          {/* Bouton magnétique → formulaire de contact */}
          <div className="footer-contact-col">
            <ContactMorphButton />
          </div>
        </div>

        {/* Grille de navigation — Commander au milieu, Informations à droite */}
        <div className="footer-nav-grid">
          <div className="footer-nav-col">
            <h3>Navigation</h3>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover-target">
                    <HoverFadeText>{l.label}</HoverFadeText>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-nav-col footer-nav-action">
            <h3>Commander</h3>
            <div className="footer-map-card">
              <MapView />
            </div>
          </div>

          <div className="footer-nav-col">
            <h3>Informations</h3>
            <ul>
              {INFO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover-target">
                    <HoverFadeText>{l.label}</HoverFadeText>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-giant-type" aria-hidden="true">
          CHEZ FLORENCE
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2026 Chez Florence — Tous droits réservés · Créé par{' '}
          <a
            href="https://akatech.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-target"
          >
            AKATech Studio
          </a>
        </p>
      </div>
    </footer>
  )
}