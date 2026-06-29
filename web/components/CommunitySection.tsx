'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, Sparkles } from 'lucide-react'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

export default function CommunitySection() {
  const whatsappUrl = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Bonjour, je suis intéressé(e) par un lapin Lapinou. Pouvez-vous me renseigner ?')}`
    : '/contact'

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(58,47,34,0.95) 0%, rgba(30,24,18,0.98) 100%)',
            border: '1px solid rgba(184,131,74,0.18)',
          }}
        >
          {/* BG decoration */}
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(184,131,74,0.12) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(194,105,61,0.08) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />

          <div className="relative z-10 text-center px-8 py-16">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-caramel/10 border border-caramel/20 mb-6"
            >
              <Sparkles size={24} className="text-caramel" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl lg:text-5xl font-extrabold mb-4"
            >
              Une question avant{' '}
              <span className="text-gradient">d'adopter ?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-white/40 text-base leading-relaxed mb-10 max-w-lg mx-auto"
            >
              Écrivez-nous directement sur WhatsApp. Nous répondons rapidement
              pour vous aider à choisir le lapin qui vous correspond.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <Link href="/rabbits">
                <motion.span
                  className="btn-outline inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold cursor-pointer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Voir les lapins
                </motion.span>
              </Link>
              <motion.a
                href={whatsappUrl}
                target={WHATSAPP ? '_blank' : undefined}
                rel={WHATSAPP ? 'noopener noreferrer' : undefined}
                className="btn-neon inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={16} />
                Discuter sur WhatsApp
              </motion.a>
            </motion.div>
            <p className="text-white/20 text-xs mt-5">
              Réponse généralement sous quelques heures.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
