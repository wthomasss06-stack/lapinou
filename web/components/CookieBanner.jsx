'use client'
import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const CONSENT_KEY = 'lapinou_cookie_consent'

// Bandeau de consentement minimal — n'enregistre qu'un choix accepter/refuser
// pour les statistiques de visite anonymisées (cf VisitStats côté backend).
// Ne déclenche AUCUNE permission navigateur (géolocalisation, son, etc.) :
// ces actions doivent rester déclenchées par un geste explicite de
// l'utilisateur au moment où elles sont réellement utiles (ex: bouton
// "Localiser" dans MapView), jamais en arrière-plan depuis ce bandeau.
export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) setShow(true)
  }, [])

  const saveConsent = async (accepted) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted, timestamp: Date.now() }))
      await fetch(`${API_URL}/analytics/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted }),
      })
    } catch (err) {
      console.error('Erreur enregistrement consentement:', err)
    } finally {
      setShow(false)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className="glass border border-brand-border/60 bg-brand-darker/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-xl bg-caramel/20 text-caramel shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white">Cookies</h3>
                <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">
                  Nous utilisons des statistiques de visite anonymisées pour améliorer le site. Aucun tracking publicitaire.
                </p>
              </div>
            </div>

            <div className="flex gap-2 text-xs">
              <button
                onClick={() => saveConsent(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium text-center"
              >
                Refuser
              </button>
              <button
                onClick={() => saveConsent(true)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-caramel hover:bg-caramel-hover text-brand-darker font-bold text-center transition-all duration-300 shadow-lg shadow-caramel/20"
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
