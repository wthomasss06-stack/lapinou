'use client'
import RainbowText from './RainbowText'
import CharSplitHeading from './CharSplitHeading'
import SectionHead from './SectionHead'
import PriceSimulator from './PriceSimulator'
import { CHEZ_FLORENCE_IMAGE_POOL } from '@/lib/chezFlorenceLetters'
import { PRICE_PER_KG, SIM_MIN_KG, SIM_MAX_KG, formatFcfa, formatKg } from '@/lib/pricing'

// Section Tarifs — un tarif unique au kilo (lib/pricing.ts), présenté sous
// forme de simulateur : on choisit un poids, le prix se calcule. La grille
// de trois cartes a laissé place à la « balance » (PriceSimulator), qui
// affiche aussi les formats courants (unité, duo, lot) toujours déduits du
// même tarif. Le résumé en ticker du TrustMarquee reste en place.
// Le bouton « Commander » pointe vers le formulaire de contact du footer
// (#contact) — pas WhatsApp direct.
export default function TarifsSection() {
  return (
    <section id="tarifs" data-theme="rust">
      <SectionHead
        number={3}
        eyebrow="Tarifs"
        title={(
          <CharSplitHeading
            lines={['Un Seul Prix,', 'Au Kilo']}
            images={CHEZ_FLORENCE_IMAGE_POOL}
            as="h2"
            className="section-title reveal-text"
          />
        )}
        desc={(
          <RainbowText
            text={`Un tarif unique : ${formatFcfa(PRICE_PER_KG)} le kilo. Choisissez un poids de ${formatKg(SIM_MIN_KG)} à ${formatKg(SIM_MAX_KG)}, le prix se calcule tout seul.`}
            variant="white"
            className="section-desc"
          />
        )}
      />

      <PriceSimulator />
    </section>
  )
}
