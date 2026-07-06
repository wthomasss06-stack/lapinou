'use client'
import { motion } from 'framer-motion'

const CARDS = [
  {
    label: '01 — Particuliers',
    title: 'Pour votre\nCuisine',
    desc: 'Une viande saine et savoureuse pour votre famille. Chaque lapin est élevé avec soin, suivi vétérinairement, prêt pour votre table.',
    img: '/IMAGES/Snapchat-73962748~1.webp',
  },
  {
    label: '02 — Restaurateurs',
    title: 'Pour votre\nCarte',
    desc: 'Approvisionnement régulier, lapins sélectionnés pour la qualité bouchère. Découpe et livraison sur commande partout à Abidjan.',
    img: '/IMAGES/Snapchat-763078288.webp',
  },
  {
    label: '03 — PME & Éleveurs',
    title: 'Démarrez votre\nÉlevage',
    desc: 'Reproducteurs certifiés pour lancer ou agrandir votre ferme. Conseil technique et vente en gros disponibles sur demande.',
    img: '/IMAGES/Snapchat-908462874.webp',
  },
]

const diagVariant = {
  hidden: { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
  show:   { clipPath: 'polygon(0 0, 110% 0, 100% 100%, 0 100%)' },
}

export default function PourQuiSection() {
  return (
    <section
      id="pour-qui"
      className="py-20 px-8 sm:px-12 lg:px-[2.5vw]"
      style={{ background: 'var(--border)' }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <motion.p
        variants={diagVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
        className="font-mono text-[0.68rem] tracking-[0.35em] uppercase text-[#B8834A] mb-4"
      >
        — Nos Clients
      </motion.p>

      <motion.h2
        variants={diagVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.1, ease: [0.77, 0, 0.175, 1] }}
        className="font-bold italic text-white mb-12"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(36px, 5.5vw, 82px)',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
        }}
      >
        Pour qui&nbsp;?
      </motion.h2>

      {/* ── Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
        {CARDS.map((card, i) => (
          <div
            key={card.label}
            className="relative overflow-hidden"
            style={{ height: '65vh', minHeight: 380, background: 'var(--border)' }}
          >
            {/* ── Effect 6: blob qui éclot depuis le centre ──────── */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${card.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={{ clipPath: 'circle(0% at 50% 42%)' }}
              whileInView={{ clipPath: 'circle(130% at 50% 42%)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 1.7,
                delay: i * 0.18,
                ease: [0.77, 0, 0.175, 1],
              }}
            />

            {/* Gradient overlay for readability */}
            <div
              className="absolute inset-0 z-[2]"
              style={{
                background:
                  'linear-gradient(to top, rgba(8,6,3,0.94) 48%, rgba(8,6,3,0.1) 100%)',
              }}
            />

            {/* Card info */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-[3] p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: i * 0.18 + 0.5, ease: 'easeOut' }}
            >
              <p className="font-mono text-[0.58rem] tracking-[0.3em] uppercase text-[#B8834A] mb-3">
                {card.label}
              </p>
              <h3
                className="font-bold text-white mb-4 whitespace-pre-line"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(20px, 2.2vw, 34px)',
                  lineHeight: 1.1,
                }}
              >
                {card.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed font-light">
                {card.desc}
              </p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}
