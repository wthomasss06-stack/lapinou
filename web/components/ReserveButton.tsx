'use client'

import { useState } from 'react'
import { rabbitsApi } from '@/lib/api'
import { formatPrice } from '@/lib/status'
import { MessageCircle, Check, AlertCircle } from 'lucide-react'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '2250701234567'

interface ReserveButtonProps {
  slug: string
  rabbitName: string
  rabbitPrice: number
  breed: string
}

export default function ReserveButton({ slug, rabbitName, rabbitPrice, breed }: ReserveButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleReserve() {
    setState('loading')
    setErrorMsg('')

    // Récupérer la localisation GPS depuis le sessionStorage (si dispo)
    let latitude: number | null = null
    let longitude: number | null = null
    if (typeof window !== 'undefined') {
      try {
        const loc = sessionStorage.getItem('lapinou_client_location')
        if (loc) {
          const parsed = JSON.parse(loc)
          if (parsed?.lat && parsed?.lng) {
            latitude = parsed.lat
            longitude = parsed.lng
          }
        }
      } catch (_) {}
    }

    try {
      // 1. Appeler l'API de réservation (crée la résa + envoie le mail via Resend)
      await rabbitsApi.reserve(slug, {
        firstName: 'Visiteur',
        lastName: 'Lapinou',
        email: 'visiteur@lapinou.ci',
        phone: '22507000000',
        message: `Réservation instantanée du lapin ${rabbitName} (${breed}) via le bouton Réserver.`,
        latitude,
        longitude,
      })

      // 2. Ouvrir WhatsApp avec le message intelligent
      if (typeof window !== 'undefined') {
        const waNum = WHATSAPP.replace(/\D/g, '')
        const waText = `Bonjour ! Je souhaite réserver le lapin *${rabbitName}* (${breed}) présenté à ${formatPrice(rabbitPrice)} sur votre site Lapinou 🐇\n\n` +
          `Pouvez-vous me confirmer sa disponibilité et les modalités de livraison ?`
        const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waText)}`
        window.open(waUrl, '_blank', 'noopener,noreferrer')
      }

      setState('success')
      playSuccessSound()
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue.')
      setState('error')
    }
  }

  function playSuccessSound() {
    if (typeof window === 'undefined') return
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    try {
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.7)
    } catch (_) {}
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-sage/30 bg-sage/10 text-center animate-fade-in">
        <div className="flex items-center gap-1 text-sage text-xs font-bold">
          <Check size={14} />
          Réservé avec succès !
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        onClick={handleReserve}
        disabled={state === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                   bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95
                   text-white font-bold text-sm transition-all duration-200
                   shadow-lg shadow-[#25D366]/20 disabled:opacity-50"
      >
        {state === 'loading' ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Traitement…
          </>
        ) : (
          <>
            <MessageCircle size={16} className="shrink-0" />
            Réserver
          </>
        )}
      </button>

      {state === 'error' && (
        <p className="text-[10px] text-red-400 mt-1.5 flex items-center gap-1">
          <AlertCircle size={10} />
          {errorMsg}
        </p>
      )}
    </div>
  )
}
