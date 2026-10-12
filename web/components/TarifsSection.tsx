'use client'
import { useRef } from 'react'
import RainbowText from './RainbowText'
import CharSplitHeading from './CharSplitHeading'
import SectionHead from './SectionHead'
import ArrowButton from './ArrowButton'
import PriceSimulator from './PriceSimulator'
import { useTilt3D } from '@/lib/useTilt3D'
import { CHEZ_FLORENCE_IMAGE_POOL } from '@/lib/chezFlorenceLetters'
import {
  PRICE_FORMATS,
  PRICE_PER_KG,
  SIM_MIN_KG,
  SIM_MAX_KG,
  formatDiscount,
  formatFcfa,
  formatKg,
  formatRabbits,
} from '@/lib/pricing'

export default function TarifsSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  useTilt3D(gridRef)

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

      <div className="pricing-grid" ref={gridRef}>
        {PRICE_FORMATS.map((format) => {
          const featured = format.id === 'duo'

          return (
            <div
              key={format.id}
              className={`price-card reveal-text${featured ? ' featured' : ''}`}
              data-tilt
              data-base-scale={featured ? '1.03' : '1'}
            >
              {featured && <div className="price-badge">Le plus demandé</div>}
              <div className="price-tag">
                <span aria-hidden="true">{format.icon} </span>
                {format.label}
              </div>
              <div className="price-amount">
                {formatFcfa(PRICE_PER_KG)}<span>/ kg</span>
              </div>
              <div className="price-sub">{formatRabbits(format.rabbits)}</div>
              <ArrowButton href="#contact" solid block className="price-cta">
                Commander
              </ArrowButton>
              <ul className="price-features">
                <li>{format.formula}</li>
                <li>Remise sur le total : {formatDiscount(format.discount)}</li>
                <li>Prix final selon le poids réel</li>
              </ul>
            </div>
          )
        })}
      </div>

      <PriceSimulator />
    </section>
  )
}
