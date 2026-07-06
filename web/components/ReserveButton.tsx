'use client'

import { useState } from 'react'
import { rabbitsApi } from '@/lib/api'
import { formatPrice } from '@/lib/status'
import { MessageCircle, Check, AlertCircle, Minus, Plus } from 'lucide-react'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '2250142507750'

interface ReserveButtonProps {
  slug: string
  rabbitName: string
  rabbitPrice: number
  breed: string
  stock: number
}

export default function ReserveButton({ slug, rabbitName, rabbitPrice, breed, stock }: ReserveButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [quantity, setQuantity] = useState(1)

  const maxQty = Math.max(1, Math.min(stock ?? 1, 50))

  function decrement() { setQuantity(q => Math.max(1, q - 1)) }
  function increment() { setQuantity(q => Math.min(maxQty, q + 1)) }

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
      // 1. Appeler l'API de réservation (crée la résa + décompte le stock + envoie le mail via Resend)
      await rabbitsApi.reserve(slug, {
        quantity,
        firstName: 'Visiteur',
        lastName: 'CHEZ FLORENCE',
        email: 'visiteur@chezflorence.ci',
        phone: '22507000000',
        message: `Réservation instantanée de ${quantity} lapin(s) ${rabbitName} (${breed}) via le bouton Réserver.`,
        // On n'envoie lat/lng QUE si la géoloc a bien été récupérée.
        // Envoyer null explicitement dans le JSON déclencherait une erreur de validation
        // côté API (express-validator v7 ne skip pas null avec optional() sans { nullable: true }).
        ...(latitude !== null && longitude !== null ? { latitude, longitude } : {}),
      })

      // 2. Ouvrir WhatsApp avec le message intelligent
      if (typeof window !== 'undefined') {
        const waNum = WHATSAPP.replace(/\D/g, '')
        const totalPrice = rabbitPrice * quantity
        const waText = `Bonjour ! Je souhaite réserver ${quantity} lapin${quantity > 1 ? 's' : ''} *${rabbitName}* (${breed}) à ${formatPrice(rabbitPrice)}/unité (total ${formatPrice(totalPrice)}) sur votre site CHEZ FLORENCE 🐇\n\n` +
          `Pouvez-vous me confirmer la disponibilité et les modalités de livraison ?`
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
          {quantity} lapin{quantity > 1 ? 's' : ''} réservé{quantity > 1 ? 's' : ''} avec succès !
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Sélecteur de quantité */}
      <div className="flex items-center justify-between mb-2 bg-brand-darker/60 border border-brand-border/60 rounded-xl px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Quantité</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= 1 || state === 'loading'}
            aria-label="Diminuer la quantité"
            className="w-7 h-7 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-white/70 hover:text-white hover:border-caramel/40 disabled:opacity-30 disabled:hover:border-brand-border transition-colors"
          >
            <Minus size={13} />
          </button>
          <span className="font-display font-bold text-white text-sm w-6 text-center">{quantity}</span>
          <button
            type="button"
            onClick={increment}
            disabled={quantity >= maxQty || state === 'loading'}
            aria-label="Augmenter la quantité"
            className="w-7 h-7 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-white/70 hover:text-white hover:border-caramel/40 disabled:opacity-30 disabled:hover:border-brand-border transition-colors"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
      {quantity >= maxQty && (
        <p className="text-[10px] text-white/30 mb-2 text-right">Stock max atteint ({stock})</p>
      )}

      <button
        onClick={handleReserve}
        disabled={state === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                   bg-[var(--green)] hover:brightness-110 active:scale-95
                   text-white font-bold text-sm transition-all duration-200
                   shadow-lg shadow-[rgba(var(--green-rgb),0.3)] disabled:opacity-50"
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
            Réserver {quantity > 1 ? `(${quantity})` : ''}
          </>
        )}
      </button>

      {state === 'error' && (
        <p className="text-[10px] text-[var(--lime)] mt-1.5 flex items-center gap-1">
          <AlertCircle size={10} />
          {errorMsg}
        </p>
      )}
    </div>
  )
}
