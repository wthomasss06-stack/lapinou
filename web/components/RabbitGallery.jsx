'use client'
import { useState, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Images } from 'lucide-react'
import Lightbox from './Lightbox'
import { STATUS_LABEL } from '@/lib/status'

export default function RabbitGallery({ photos, title, unavailable, status }) {
  const [cur, setCur] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const total = photos.length
  const touchX = useRef(null)

  const prev = useCallback(e => { e?.stopPropagation(); setCur(c => (c - 1 + total) % total) }, [total])
  const next = useCallback(e => { e?.stopPropagation(); setCur(c => (c + 1) % total) }, [total])

  if (!total) {
    return (
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-card flex items-center justify-center text-6xl">
        🐇
      </div>
    )
  }

  return (
    <>
      {lightbox !== null && (
        <Lightbox photos={photos} startIndex={lightbox} title={title} onClose={() => setLightbox(null)} />
      )}

      {/* Image principale */}
      <div
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-brand-card"
        style={{ cursor: total > 1 ? 'zoom-in' : 'default' }}
        onTouchStart={e => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
          touchX.current = null
        }}
        onClick={() => setLightbox(cur)}
      >
        {photos.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`${title} ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              i === cur ? 'opacity-100' : 'opacity-0'
            } ${unavailable ? 'grayscale' : ''}`}
          />
        ))}

        {/* Voile si indisponible */}
        {unavailable && <div className="absolute inset-0 bg-espresso/35" />}

        {/* Badge agrandir */}
        <div className="absolute top-3 right-3 z-[4] bg-black/55 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-white text-[11px] font-semibold pointer-events-none">
          <Maximize2 size={12} /> Agrandir
        </div>

        {/* Badge statut */}
        <div className="absolute top-3 left-3 z-[5]">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm ${
            !unavailable ? 'bg-sage/85 text-espresso' :
            status === 'reserved' ? 'bg-terracotta/85 text-white' : 'bg-white/15 text-white border border-white/20'
          }`}>
            {!unavailable ? 'Disponible' : STATUS_LABEL[status]}
          </span>
        </div>

        {/* Flèches */}
        {total > 1 && (
          <>
            <button onClick={prev} aria-label="Précédent" className="absolute left-3 top-1/2 -translate-y-1/2 z-[5] w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-espresso hover:scale-110 transition-transform">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} aria-label="Suivant" className="absolute right-3 top-1/2 -translate-y-1/2 z-[5] w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-espresso hover:scale-110 transition-transform">
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Compteur */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 z-[5] bg-black/65 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
            {cur + 1} / {total}
          </div>
        )}
      </div>

      {/* Miniatures */}
      {total > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pt-2 pb-1" style={{ scrollbarWidth: 'none' }}>
          {photos.slice(0, 8).map((url, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setCur(i) }}
              className="shrink-0 w-[68px] h-[50px] rounded-lg overflow-hidden p-0 transition-all"
              style={{
                border: i === cur ? '2.5px solid #B8834A' : '2.5px solid rgba(255,255,255,.12)',
                opacity: i === cur ? 1 : 0.5,
              }}
            >
              <img src={url} alt="" className="w-full h-full object-cover block" />
            </button>
          ))}
          {total > 8 && (
            <button
              onClick={() => setLightbox(0)}
              className="shrink-0 w-[68px] h-[50px] rounded-lg border-2 border-brand-border flex flex-col items-center justify-center gap-0.5 text-white/40 text-[10px] font-semibold"
            >
              <Images size={14} />
              +{total - 8}
            </button>
          )}
        </div>
      )}
    </>
  )
}
