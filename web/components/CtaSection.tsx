'use client'
import CharSplitHeading from './CharSplitHeading'
import RainbowText from './RainbowText'
import ArrowButton from './ArrowButton'
import { CHEZ_FLORENCE_IMAGE_POOL } from '@/lib/chezFlorenceLetters'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || '2250142507750'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Bonjour Chez Florence, je souhaite réserver un lapin.")}`

const ArrowIcon = () => (
  <svg className="cf-nav-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
)

export default function CtaSection() {
  return (
    <section id="cta-reservation" data-theme="dark" className="cta-section">
      <div className="section-head">
        <div>
          <div className="eyebrow mb-3">Réservation en Ligne</div>
          <CharSplitHeading
            lines={['Prêt à Réserver', 'Votre Lapin ?']}
            images={CHEZ_FLORENCE_IMAGE_POOL}
            as="h2"
            className="section-title elastic-title"
          />
        </div>
        <RainbowText
          text="Choisissez votre race, indiquez votre quantité. Nous vous recontactons sous 24h pour confirmer le retrait ou la livraison sur Abidjan et ses environs."
          variant="white"
          className="section-desc mt-4 mb-8"
        />
        <div className="cta-btns">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cf-nav-cta">
            <span>Commander sur WhatsApp</span>
            <ArrowIcon />
          </a>
          <a href="/#lapins" className="cf-nav-cta cf-nav-cta--outline">
            <span>Nos lapins</span>
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  )
}
