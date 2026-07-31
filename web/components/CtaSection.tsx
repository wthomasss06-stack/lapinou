'use client'
import CharSplitHeading from './CharSplitHeading'
import RainbowText from './RainbowText'
import ArrowButton from './ArrowButton'
import SectionHead from './SectionHead'
import { CHEZ_FLORENCE_IMAGE_POOL } from '@/lib/chezFlorenceLetters'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || '2250142507750'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Bonjour Chez Florence, je souhaite réserver un lapin.")}`

export default function CtaSection() {
  return (
    <section id="cta-reservation" data-theme="dark" className="cta-section">
      <SectionHead
        number={7}
        eyebrow="Réservation en Ligne"
        title={(
          <CharSplitHeading
            lines={['Prêt à Réserver', 'Votre Lapin ?']}
            images={CHEZ_FLORENCE_IMAGE_POOL}
            as="h2"
            className="section-title elastic-title"
          />
        )}
        desc={(
          <RainbowText
            text="Choisissez votre race, indiquez votre quantité. Nous vous recontactons sous 24h pour confirmer le retrait ou la livraison sur Abidjan et ses environs."
            variant="white"
            className="section-desc"
          />
        )}
        footer={(
          <div className="cta-btns">
            <ArrowButton href={WHATSAPP_URL} external solid>
              Commander sur WhatsApp
            </ArrowButton>
            <ArrowButton href="/#lapins">
              Nos lapins
            </ArrowButton>
          </div>
        )}
      />
    </section>
  )
}
