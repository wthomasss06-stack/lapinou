'use client'
import { useState, useEffect, useRef } from 'react'
import { Share2, Link as LinkIcon, Check, ChevronDown, X } from 'lucide-react'
import HoverFadeText from './HoverFadeText'

export default function SharePanel({ rabbit, siteUrl }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isMobileSheet, setIsMobileSheet] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    const check = () => setIsMobileSheet(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!rabbit?.slug) return null

  const url = `${siteUrl || ''}/rabbits/${rabbit.slug}`
  const txt = `${rabbit.name} — ${rabbit.breed} · CHEZ FLORENCE`

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2500)
    })
  }

  function share(platform) {
    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(txt + '\n' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    }
    if (links[platform]) window.open(links[platform], '_blank')
  }

  async function nativeShare() {
    if (navigator.share) {
      try { await navigator.share({ title: rabbit.name, text: txt, url }); return } catch { }
    }
    copyLink()
  }

  const PanelContent = () => (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <button onClick={() => share('whatsapp')} className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold bg-[rgba(var(--green-rgb),0.1)] border border-[rgba(var(--green-rgb),0.25)] text-[var(--green)] hover:opacity-75 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="rgba(var(--green-rgb),.15)" /><path d="M22.5 19.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1s-.8 1-1 1.2c-.2.2-.3.2-.6.1s-1.2-.4-2.3-1.4c-.8-.7-1.4-1.6-1.6-1.9s0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5s0-.4-.1-.5-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3c.2.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4s.2-1.3.2-1.4c0-.1-.3-.2-.6-.4z" fill="var(--green)" /></svg>
          <HoverFadeText>WhatsApp</HoverFadeText>
        </button>
        <button onClick={() => share('facebook')} className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold bg-[rgba(var(--lime-rgb),0.1)] border border-[rgba(var(--lime-rgb),0.25)] text-[var(--lime)] hover:opacity-75 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="var(--lime)"><path d="M29 16C29 8.82 23.18 3 16 3S3 8.82 3 16c0 6.49 4.75 11.87 10.97 12.85V19.8h-3.3V16h3.3v-2.86c0-3.26 1.94-5.06 4.92-5.06 1.43 0 2.92.25 2.92.25v3.2h-1.65c-1.62 0-2.12 1.01-2.12 2.03V16h3.61l-.58 3.8h-3.03v9.05C24.25 27.87 29 22.49 29 16z" /></svg>
          <HoverFadeText>Facebook</HoverFadeText>
        </button>
      </div>

      <div className="flex items-center gap-2 bg-brand-darker border border-brand-border rounded-xl px-3 py-2.5">
        <LinkIcon size={13} className="text-white/35 shrink-0" />
        <span className="text-[11px] text-white/40 flex-1 truncate">{url.replace('https://', '')}</span>
        <button onClick={copyLink} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${copied ? 'bg-sage text-espresso' : 'bg-white text-espresso'}`}>
          {copied ? <Check size={12} /> : <LinkIcon size={12} />}
          <HoverFadeText>{copied ? 'Copié !' : 'Copier'}</HoverFadeText>
        </button>
      </div>

      <button onClick={nativeShare} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-brand-card border border-brand-border text-white/60 hover:text-white transition-colors">
        <Share2 size={13} /> <HoverFadeText>Autres applications…</HoverFadeText>
      </button>
    </div>
  )

  return (
    <>
      <div className="w-full">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-sm font-semibold bg-brand-card border border-brand-border text-white/60 hover:text-white transition-colors"
        >
          <Share2 size={14} />
          <HoverFadeText>Partager cette fiche</HoverFadeText>
          <ChevronDown size={14} className={`ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && !isMobileSheet && (
          <div className="mt-2 p-3.5 rounded-xl bg-brand-card border border-brand-border">
            <PanelContent />
          </div>
        )}
      </div>

      {open && isMobileSheet && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm">
          <div onClick={e => e.stopPropagation()} className="fixed bottom-0 left-0 right-0 z-[9999] bg-brand-card rounded-t-3xl px-4 pb-8 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-center py-3">
              <div className="w-9 h-1 rounded-full bg-brand-border" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-extrabold text-white">Partager</span>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-brand-border flex items-center justify-center">
                <X size={14} className="text-white/50" />
              </button>
            </div>
            <PanelContent />
          </div>
        </div>
      )}
    </>
  )
}
