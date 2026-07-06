'use client'
import { motion } from 'framer-motion'

const ITEMS = [
  'Vente de Lapins', 'Élevage Artisanal', 'Races Pures',
  'Restaurants', 'PME & Éleveurs', 'Abidjan',
  'Réservation Rapide', 'Suivi Après-Vente',
]

export default function MarqueeBanner() {
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div
      className="overflow-hidden select-none"
      style={{
        borderTop: '1px solid rgba(243,233,218,0.12)',
        borderBottom: '1px solid rgba(243,233,218,0.12)',
        padding: '0.55rem 0',
        background: 'var(--ink)',
      }}
    >
      <div className="overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          maskImage:       'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <motion.div
          className="flex gap-0 shrink-0"
          animate={{ x: ['0%', '-25%'] }}
          transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
          style={{ willChange: 'transform' }}
        >
          {doubled.map((item, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span
                className="whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: 'clamp(10px, 0.82vw, 13px)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: i % 3 === 1
                    ? 'rgba(194,114,61,0.7)'   // rust accent
                    : 'rgba(243,233,218,0.42)', // paper dim
                }}
              >
                {item}
              </span>
              <span
                className="mx-4"
                style={{
                  color: 'rgba(124,42,26,0.5)',
                  fontSize: '0.7rem',
                }}
              >
                ✦
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
