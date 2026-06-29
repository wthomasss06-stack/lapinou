'use client'
import { useEffect, useState } from 'react'
import { ShieldCheck, Music, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export default function CookieBanner() {
  const [show, setShow] = useState(false)
  const [preferences, setPreferences] = useState({ sound: true, gps: true })

  useEffect(() => {
    // Vérifie si le consentement a déjà été donné
    const consent = localStorage.getItem('lapinou_cookie_consent')
    if (!consent) {
      // Si aucune visite enregistrée pour cette session, on affiche la bannière
      setShow(true)
    }
  }, [])

  const saveConsent = async (accepted) => {
    try {
      // 1. Stocke dans localStorage
      const consentData = {
        sound: accepted ? preferences.sound : false,
        gps: accepted ? preferences.gps : false,
        timestamp: Date.now()
      }
      localStorage.setItem('lapinou_cookie_consent', JSON.stringify(consentData))

      // 2. Tente de récupérer la localisation si GPS accepté
      if (accepted && preferences.gps && typeof navigator !== 'undefined') {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const clientLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            sessionStorage.setItem('lapinou_client_location', JSON.stringify(clientLoc))
            window.dispatchEvent(new Event('lapinou_location_ready'))
          },
          (err) => console.log('Erreur localisation:', err),
          { enableHighAccuracy: true, timeout: 5000 }
        )
      }

      // 3. Notifie l'API backend pour enregistrer les statistiques de visite
      await fetch(`${API_URL}/analytics/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted }),
      })

      // Déclenche un événement global pour signaler que les cookies ont été configurés
      window.dispatchEvent(new Event('lapinou_consent_updated'))
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
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="glass border border-brand-border/60 bg-brand-darker/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-xl bg-caramel/20 text-caramel">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  Respect de votre vie privée & Expérience
                </h3>
                <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre visite. Choisissez ce que vous souhaitez activer pour votre expérience Lapinou.
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-5">
              {/* Option 1: Son */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Music size={14} className="text-caramel" />
                  <div>
                    <div className="text-[11px] font-semibold text-white">Sons & Bruitages</div>
                    <div className="text-[9px] text-white/40">Activer le bruitage mignon à la réservation</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.sound}
                  onChange={(e) => setPreferences({ ...preferences, sound: e.target.checked })}
                  className="rounded border-brand-border bg-brand-dark text-caramel focus:ring-0 cursor-pointer h-4 w-4"
                />
              </div>

              {/* Option 2: GPS */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-caramel" />
                  <div>
                    <div className="text-[11px] font-semibold text-white">Localisation GPS</div>
                    <div className="text-[9px] text-white/40">Afficher l'itinéraire vers Azaguié Gare</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.gps}
                  onChange={(e) => setPreferences({ ...preferences, gps: e.target.checked })}
                  className="rounded border-brand-border bg-brand-dark text-caramel focus:ring-0 cursor-pointer h-4 w-4"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => saveConsent(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium text-center"
              >
                Tout refuser
              </button>
              <button
                onClick={() => saveConsent(true)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-caramel hover:bg-caramel-hover text-brand-darker font-bold text-center transition-all duration-300 shadow-lg shadow-caramel/20"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
