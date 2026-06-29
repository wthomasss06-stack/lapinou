'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ photos, startIndex, title, onClose }) {
  const [cur, setCur] = useState(startIndex)
  const [imgKey, setImgKey] = useState(0)
  const total = photos.length
  const touchX = useRef(null)
  const touchY = useRef(null)
  const thumbsRef = useRef(null)

  const goto = useCallback(idx => {
    setCur(idx)
    setImgKey(k => k + 1)
    setTimeout(() => {
      if (!thumbsRef.current) return
      const btn = thumbsRef.current.children[idx]
      if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }, 40)
  }, [])

  const prev = useCallback(() => goto((cur - 1 + total) % total), [cur, total, goto])
  const next = useCallback(() => goto((cur + 1) % total), [cur, total, goto])

  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [prev, next, onClose])

  function handleTouchStart(e) {
    touchX.current = e.touches[0].clientX
    touchY.current = e.touches[0].clientY
  }
  function handleTouchEnd(e) {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    const dy = e.changedTouches[0].clientY - touchY.current
    if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) { onClose(); return }
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev()
    touchX.current = null
    touchY.current = null
  }

  const ui = (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[9998] bg-black/85 backdrop-blur-xl animate-in fade-in" />

      <div onClick={e => e.stopPropagation()} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="pointer-events-auto w-full max-w-3xl max-h-[calc(100vh-32px)] bg-gradient-to-br from-brand-card to-brand-darker border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
            <div className="flex-1 min-w-0">
              {title && (
                <div className="text-sm font-bold text-white/90 font-display truncate">{title}</div>
              )}
              <div className="text-xs text-white/35 mt-0.5">
                <span className="text-white/70 font-bold">{cur + 1}</span> / {total} photo{total > 1 ? 's' : ''}
              </div>
            </div>
            <button onClick={onClose} className="shrink-0 w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden min-h-0 bg-black/40">
            <img
              src={photos[cur]} alt="" aria-hidden
              className="absolute inset-[-10%] w-[120%] h-[120%] object-cover blur-3xl saturate-150 brightness-[0.35] pointer-events-none"
            />
            <img
              key={imgKey}
              src={photos[cur]}
              alt={`${title || 'Photo'} ${cur + 1}`}
              className="relative z-[1] max-w-full max-h-full object-contain select-none animate-in fade-in"
              draggable={false}
            />
            {total > 1 && (
              <>
                <button onClick={prev} aria-label="Précédent" className="absolute left-2.5 top-1/2 -translate-y-1/2 z-[2] w-11 h-11 rounded-full bg-black/55 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <ChevronLeft size={22} />
                </button>
                <button onClick={next} aria-label="Suivant" className="absolute right-2.5 top-1/2 -translate-y-1/2 z-[2] w-11 h-11 rounded-full bg-black/55 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {/* Miniatures */}
          {total > 1 && (
            <div className="shrink-0 px-3.5 py-3 border-t border-white/10 bg-black/20">
              <div ref={thumbsRef} className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {photos.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => goto(i)}
                    className="shrink-0 w-[60px] h-[46px] rounded-lg overflow-hidden p-0 transition-all"
                    style={{
                      border: i === cur ? '2.5px solid #B8834A' : '2.5px solid rgba(255,255,255,.1)',
                      opacity: i === cur ? 1 : 0.4,
                      boxShadow: i === cur ? '0 0 0 3px rgba(184,131,74,.2)' : 'none',
                    }}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover block" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )

  if (typeof document === 'undefined') return null
  return createPortal(ui, document.body)
}
