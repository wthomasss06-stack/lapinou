'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

const faqs = [
  {
    q: 'Comment réserver un lapin ?',
    a: "Sur la fiche d'une race, choisissez la quantité souhaitée avec le sélecteur +/-, puis cliquez sur \"Réserver\". Votre réservation est enregistrée immédiatement et WhatsApp s'ouvre avec un message pré-rempli pour finaliser les détails avec nous (date de retrait, livraison…).",
  },
  {
    q: 'Pourquoi je vois un nombre de lapins en stock plutôt qu\'un lapin précis ?',
    a: "Chaque fiche représente une race ou une portée disponible en plusieurs exemplaires. Le nombre affiché est le stock restant pour cette race. Vous pouvez réserver plusieurs lapins de la même race en une seule commande.",
  },
  {
    q: 'Que se passe-t-il si le stock est épuisé ?',
    a: "La fiche apparaît grisée avec la mention \"Stock épuisé\" et la réservation est désactivée. Contactez-nous sur WhatsApp si vous souhaitez être prévenu(e) d'une prochaine portée disponible pour cette race.",
  },
  {
    q: 'Puis-je commander en plusieurs fois ?',
    a: "Oui. Chaque réservation décompte uniquement la quantité que vous demandez sur le stock disponible — vous pouvez revenir plus tard pour réserver davantage si le stock le permet encore.",
  },
  {
    q: 'Quelles sont les zones et frais de livraison ?',
    a: "Abidjan : 2 000 FCFA. Azaguié et alentours : 1 000 FCFA. Reste de la Côte d'Ivoire : 3 000 FCFA. La zone est déterminée automatiquement à partir de votre position lors de la réservation.",
  },
  {
    q: 'Comment se passe le paiement ?',
    a: "Le paiement et les modalités exactes (espèces, Wave, Orange Money…) sont convenus directement avec nous sur WhatsApp après votre réservation, en même temps que le rendez-vous de retrait ou de livraison.",
  },
  {
    q: 'Les lapins sont-ils suivis par un vétérinaire ?',
    a: "Oui, chaque race proposée est suivie par un vétérinaire avant la mise en vente. Certaines fiches précisent une vaccination incluse — voir la note de prix sur la fiche concernée.",
  },
  {
    q: 'Je n\'ai pas reçu de réponse après ma réservation, que faire ?',
    a: "Écrivez-nous directement sur WhatsApp, c'est le canal le plus rapide pour une réponse. Vous pouvez aussi utiliser le formulaire de la section Contact en bas de la page d'accueil.",
  },
]

function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display font-bold text-white text-sm sm:text-base">{q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className="text-caramel shrink-0">
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-white/50 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const whatsappUrl = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Bonjour, j\'ai une question qui n\'est pas couverte par la page Aide.')}`
    : null

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">Centre d'aide</p>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Questions <span className="text-gradient">Fréquentes</span>
            </h1>
            <p className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed">
              Tout ce qu'il faut savoir avant de réserver un lapin sur CHEZ FLORENCE.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.q}
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          {whatsappUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 glass rounded-2xl p-6 text-center"
            >
              <p className="text-white/60 text-sm mb-4">Une autre question ? Écrivez-nous directement.</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
              >
                <MessageCircle size={16} />
                Écrire sur WhatsApp
              </a>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
