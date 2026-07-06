'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

const diagVariant = {
  hidden: { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
  show:   { clipPath: 'polygon(0 0, 110% 0, 100% 100%, 0 100%)' },
}

export default function CtaSection() {
  const ref = useRef<HTMLElement>(null)

  // scrollYProgress sur la section — de 0 (entre dans le viewport par le bas)
  // à 1 (quitte le viewport par le haut)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  // ── Effect 4: Iris cinématique ──────────────────────────────────
  // Le fond caramel sombre s'ouvre depuis le centre comme un iris
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    [
      'circle(0% at 50% 50%)',
      'circle(70% at 50% 50%)',
      'circle(130% at 50% 50%)',
    ]
  )

  // Léger zoom sur le fond au moment de l'ouverture
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1])

  return (
    <section
      id="sec-iris"
      ref={ref}
      className="relative overflow-hidden flex flex-col items-center justify-center text-center py-40"
      style={{ minHeight: '80vh' }}
    >
      {/* Base sombre */}
      <div className="absolute inset-0" style={{ background: 'var(--border)' }} />

      {/* ── Iris bg ──────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 iris-mask"
        style={{
          clipPath,
          scale: bgScale,
          background: 'radial-gradient(ellipse at center, var(--dark) 0%, var(--border) 100%)',
          transformOrigin: 'center center',
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 max-w-3xl mx-auto">
        {/* Eyebrow — diagonal wipe */}
        <motion.p
          variants={diagVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
          className="font-mono text-[0.68rem] tracking-[0.35em] uppercase text-[#B8834A] mb-6"
        >
          — Réservation en ligne
        </motion.p>

        {/* Titre principal */}
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-bold text-white mb-6"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(40px, 8vw, 112px)',
            lineHeight: 0.88,
            letterSpacing: '-0.03em',
          }}
        >
          Prêt à
          <br />
          <em className="italic text-[#B8834A]">réserver</em>
          <br />
          votre lapin&nbsp;?
        </motion.h2>

        {/* Sous-titre */}
        <motion.p
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.3, ease: 'easeOut' }}
          className="text-white/35 font-light leading-relaxed mb-10 mx-auto"
          style={{ fontSize: 'clamp(13px, 1vw, 15px)', maxWidth: 420 }}
        >
          Choisissez votre race, indiquez votre quantité. Nous vous recontactons
          sous 24h pour confirmer la livraison sur Abidjan et ses environs.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            href="/rabbits"
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-white border border-[rgba(var(--green-rgb),0.5)] rounded-full px-8 py-4 hover:bg-[var(--green)] hover:border-[var(--green)] hover:text-[var(--border)] transition-all duration-300"
          >
            Voir le catalogue &nbsp;↗
          </Link>
          <Link
            href="#races"
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-white/40 border border-white/[0.1] rounded-full px-8 py-4 hover:text-white hover:border-white/30 transition-all duration-300"
          >
            Nos races
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
