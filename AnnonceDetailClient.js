'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { annonces as api, formatPrix, calculerCaution } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { getCategorieInfo, EQUIPEMENTS, SITE_URL } from '@/lib/config'
import Icon from '@/components/ui/Icon'
import UserAvatar from '@/components/ui/UserAvatar'
import { calcAuthenticityScore } from '@/lib/annonceScore'
import AnnonceCard from '@/components/ui/AnnonceCard'
import { SpecCard, EquipChip, DetailSectionTitle, DETAIL_SPEC_STYLES } from '@/components/ui/AnnonceDetailSpecs'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8005/api/v1').replace('/api/v1', '')

function parseChamps(raw) {
  if (!raw) return {}
  if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return {} } }
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw
  return {}
}

const LEAFLET_PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5EDD8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z"/><circle cx="12" cy="11" r="2" fill="#C8703A" stroke="none"/></svg>`

function mediaUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_BASE}/media/${path}`
}

const CAT_CTA = {
  terrain:   { reserver: 'Réserver ce terrain',   loyer: 'Prix de vente',     unite: '' },
  residence: { reserver: 'Réserver ce logement',  loyer: 'Loyer mensuel',     unite: '/mois' },
  voiture:   { reserver: 'Réserver ce véhicule',  loyer: 'Prix de vente',     unite: '' },
  moto:      { reserver: 'Réserver cette moto',   loyer: 'Prix de vente',     unite: '' },
  commerce:  { reserver: 'Réserver ce local',     loyer: 'Prix de location',  unite: '/mois' },
  autre:     { reserver: 'Réserver maintenant',   loyer: 'Prix',              unite: '' },
}
function getCTA(cat, isLoc) {
  const c = CAT_CTA[cat] || CAT_CTA.autre
  return { reserver: c.reserver, loyer: isLoc ? c.loyer : 'Prix de vente', unite: isLoc ? c.unite : '' }
}

/* ══════════════════════════════════════════════════════════
   PAGE LOADER
══════════════════════════════════════════════════════════ */
function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--nav-h, 72px)' }}>
      <style>{`
        @keyframes nx-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        @keyframes nx-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.94)} }
        @keyframes nx-bar     { 0%{width:0%;margin-left:0} 50%{width:78%;margin-left:0} 100%{width:0%;margin-left:100%} }
        .nx-sk {
          background: linear-gradient(90deg, var(--surface) 0%, var(--border) 45%, var(--surface) 100%);
          background-size: 600px 100%;
          animation: nx-shimmer 1.4s ease-in-out infinite;
          border-radius: 12px;
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, pointerEvents: 'none', zIndex: 500 }}>
        <div style={{ animation: 'nx-pulse 1.5s ease-in-out infinite', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--orange,#C87038)', opacity: .9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon n="home" size={22} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.03em' }}>Nexura</span>
        </div>
        <div style={{ width: 160, height: 2.5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--orange,#C87038)', borderRadius: 99, animation: 'nx-bar 1.4s ease-in-out infinite' }} />
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(28px,4vw,48px) var(--pad)', boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[70, 12, 90, 12, 150].map((w, i) => <div key={i} className="nx-sk" style={{ width: w, height: 14, borderRadius: 99 }} />)}
        </div>
        <div className="nx-sk" style={{ width: '100%', aspectRatio: '16/9', maxHeight: 480, marginBottom: 10, borderRadius: 20 }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="nx-sk" style={{ width: 80, height: 56, borderRadius: 10, flexShrink: 0 }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr clamp(260px,30%,320px)', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="nx-sk" style={{ width: 88, height: 26, borderRadius: 99 }} />
              <div className="nx-sk" style={{ width: 72, height: 26, borderRadius: 99 }} />
            </div>
            <div className="nx-sk" style={{ height: 44, width: '70%' }} />
            <div className="nx-sk" style={{ height: 16, width: '36%' }} />
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            {[100, 88, 94, 82, 96].map((w, i) => <div key={i} className="nx-sk" style={{ height: 14, width: `${w}%` }} />)}
          </div>
          <div className="nx-sk" style={{ height: 420, borderRadius: 20 }} />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════════ */
function Lightbox({ photos, startIndex, titre, onClose }) {
  const [cur, setCur]       = useState(startIndex)
  const [imgKey, setImgKey] = useState(0)
  const total     = photos.length
  const touchX    = useRef(null)
  const touchY    = useRef(null)
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
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [prev, next, onClose])

  const handleTouchStart = e => { touchX.current = e.touches[0].clientX; touchY.current = e.touches[0].clientY }
  const handleTouchEnd = e => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    const dy = e.changedTouches[0].clientY - touchY.current
    if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) { onClose(); return }
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev()
    touchX.current = null; touchY.current = null
  }

  const ui = (
    <>
      <style>{`
        @keyframes lb-backdrop { from{opacity:0} to{opacity:1} }
        @keyframes lb-modal-in { from{opacity:0;transform:scale(.95) translateY(12px)} to{opacity:1;transform:none} }
        @keyframes lb-img-in   { from{opacity:0;transform:scale(.98)} to{opacity:1;transform:none} }
        .lb-close-btn:hover  { background: rgba(255,255,255,.2) !important; }
        .lb-arrow-btn:hover  { background: rgba(255,255,255,.25) !important; transform: scale(1.08) !important; }
        .lb-thumb:hover      { opacity: 1 !important; transform: scale(1.05) !important; }
      `}</style>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,.82)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', animation: 'lb-backdrop .2s ease' }} />
      <div onClick={e => e.stopPropagation()} style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box', pointerEvents: 'none' }}>
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
          style={{ pointerEvents: 'auto', width: '100%', maxWidth: 900, maxHeight: '95vh', display: 'flex', flexDirection: 'column', animation: 'lb-modal-in .25s cubic-bezier(.22,1,.36,1)' }}>
          <div style={{ position: 'relative', flex: 1, minHeight: 0, borderRadius: '14px 14px 0 0', overflow: 'hidden', background: '#000' }}>
            <img key={imgKey} src={photos[cur]} alt={`${titre} ${cur + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', animation: 'lb-img-in .2s ease' }} />
            <button className="lb-close-btn" onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,.55)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', transition: 'background .15s' }}>
              <Icon n="close" size={20} color="#fff" />
            </button>
            {[{ fn: prev, icon: 'chevron_left', pos: 'left' }, { fn: next, icon: 'chevron_right', pos: 'right' }].map(b => (
              <button key={b.pos} className="lb-arrow-btn" onClick={b.fn} style={{ position: 'absolute', [b.pos]: 14, top: '50%', transform: 'none', marginTop: -22, width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,.55)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', transition: 'background .15s, transform .15s' }}>
                <Icon n={b.icon} size={24} color="#fff" />
              </button>
            ))}
            <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,.55)', color: '#fff', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{cur + 1} / {total}</div>
          </div>
          {total > 1 && (
            <div style={{ flexShrink: 0, padding: '10px 14px 14px', borderTop: '1px solid rgba(255,255,255,.06)', background: 'rgba(0,0,0,.3)', borderRadius: '0 0 14px 14px' }}>
              <div ref={thumbsRef} style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
                {photos.map((url, i) => (
                  <button key={i} className="lb-thumb" onClick={() => goto(i)} style={{ flex: '0 0 60px', width: 60, height: 46, borderRadius: 8, overflow: 'hidden', padding: 0, cursor: 'pointer', border: i === cur ? '2.5px solid var(--orange,#C87038)' : '2.5px solid rgba(255,255,255,.1)', opacity: i === cur ? 1 : .4, boxShadow: i === cur ? '0 0 0 3px rgba(200,112,58,.2)' : 'none', transition: 'opacity .15s, transform .15s, border-color .15s, box-shadow .15s' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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

/* ══════════════════════════════════════════════════════════
   GALLERY
══════════════════════════════════════════════════════════ */
function Gallery({ photos, titre, cat }) {
  const [cur, setCur] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const total = photos.length
  const touchX = useRef(null)

  const prev = useCallback(e => { e?.stopPropagation(); setCur(c => (c - 1 + total) % total) }, [total])
  const next = useCallback(e => { e?.stopPropagation(); setCur(c => (c + 1) % total) }, [total])

  if (!total) return (
    <div style={{ background: 'var(--surface)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/3' }}>
      <Icon n={cat.icon} size={48} color="var(--border)" />
    </div>
  )

  return (
    <>
      {lightbox !== null && <Lightbox photos={photos} startIndex={lightbox} titre={titre} onClose={() => setLightbox(null)} />}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden', background: 'var(--surface)', cursor: total > 1 ? 'zoom-in' : 'default' }}
        onTouchStart={e => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={e => { if (touchX.current === null) return; const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 40) dx < 0 ? next() : prev(); touchX.current = null }}
        onClick={() => setLightbox(cur)}>
        {photos.map((url, i) => (
          <img key={i} src={url} alt={`${titre} ${i + 1}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: i === cur ? 1 : 0, transition: 'opacity .4s ease' }} />
        ))}
        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 4, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5, color: '#fff', fontSize: 11, fontWeight: 600, pointerEvents: 'none' }}>
          <Icon n="open_in_full" size={14} color="#fff" /> Agrandir
        </div>
        {total > 1 && [{ fn: prev, icon: 'chevron_left', pos: 'left' }, { fn: next, icon: 'chevron_right', pos: 'right' }].map(b => (
          <button key={b.pos} onClick={b.fn} style={{ position: 'absolute', [b.pos]: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: 40, height: 40, borderRadius: '50%', background: '#ffffff', border: '1px solid rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,.22)', transition: 'transform .15s, box-shadow .15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.32)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(-50%)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.22)' }}>
            <Icon n={b.icon} size={22} color="#111111" />
          </button>
        ))}
        {total > 1 && <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 5, background: 'rgba(0,0,0,.65)', color: '#fff', padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{cur + 1} / {total}</div>}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 5, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 99, background: 'rgba(26,61,45,.75)', border: '1px solid rgba(45,180,100,.35)', color: 'rgba(100,255,150,.9)', fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', backdropFilter: 'blur(8px)' }}>
          <Icon n="verified" size={11} color="rgba(100,255,150,.9)" /> Vérifiée
        </div>
      </div>
      {total > 1 && (
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2, paddingTop: 2, scrollbarWidth: 'none' }}>
          {photos.slice(0, 8).map((url, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setCur(i) }} style={{ flex: '0 0 72px', width: 72, height: 54, borderRadius: 10, overflow: 'hidden', border: `2.5px solid ${i === cur ? 'var(--orange,#C87038)' : 'rgba(0,0,0,.12)'}`, opacity: i === cur ? 1 : .52, transition: 'all .18s', padding: 0, cursor: 'pointer', background: 'var(--surface)', boxShadow: i === cur ? '0 0 0 3px rgba(200,112,58,.22)' : 'none' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
          {total > 8 && (
            <button onClick={() => setLightbox(0)} style={{ flex: '0 0 72px', width: 72, height: 54, borderRadius: 10, border: '2px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, background: 'var(--surface)', color: 'var(--muted)', padding: 0, fontSize: 10, fontWeight: 600 }}>
              <Icon n="photo_library" size={16} color="var(--muted)" />
              +{total - 8}
            </button>
          )}
        </div>
      )}
    </>
  )
}

/* ══════════════════════════════════════════════════════════
   KYC BADGE
══════════════════════════════════════════════════════════ */
function KYCBadge({ vendeur }) {
  if (!vendeur?.est_verifie) return null
  const isCert = String(vendeur.verification_level) === '3'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: isCert ? 'rgba(196,154,60,0.15)' : 'rgba(26,61,45,0.12)', color: isCert ? 'var(--amber,#D4920A)' : 'var(--green-mid,#2A6B48)', border: `1px solid ${isCert ? 'rgba(196,154,60,0.3)' : 'rgba(26,61,45,0.22)'}` }}>
      {isCert ? '★ Certifié+' : '✓ Vérifié'}
    </span>
  )
}

/* ══════════════════════════════════════════════════════════
   STARS
══════════════════════════════════════════════════════════ */
function Stars({ note = 0, size = 12 }) {
  const full = Math.floor(note)
  const half = note - full >= 0.5
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= full ? 'var(--amber-light,#F5B731)' : i === full + 1 && half ? 'url(#half)' : 'var(--border)'}
          stroke="none">
          <defs><linearGradient id="half"><stop offset="50%" stopColor="var(--amber-light,#F5B731)" /><stop offset="50%" stopColor="var(--border)" /></linearGradient></defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SHARE PANEL
══════════════════════════════════════════════════════════ */
function SharePanel({ annonce }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isMobileSheet, setIsMobileSheet] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    const check = () => setIsMobileSheet(window.innerWidth <= 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!annonce?.id) return null

  const url = `${SITE_URL || ''}/annonces/${annonce.id}`
  const prix = annonce.prix ? ` · ${formatPrix(annonce.prix)}` : ''
  const lieu = annonce.commune ? ` à ${annonce.commune}` : ''
  const txt = `${annonce.titre || 'Annonce Nexura'}${lieu}${prix}`

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 2500) })
  }
  const share = (p) => {
    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(txt + '\n' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    }
    if (links[p]) window.open(links[p], '_blank')
  }
  const nativeShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: annonce.titre, text: txt, url }); return } catch { } }
    copyLink()
  }

  const PanelContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
        {[
          { key: 'whatsapp', label: 'WhatsApp', color: '#25D366', bg: 'rgba(37,211,102,.08)', border: 'rgba(37,211,102,.22)' },
          { key: 'facebook', label: 'Facebook', color: '#1877F2', bg: 'rgba(24,119,242,.08)', border: 'rgba(24,119,242,.22)' },
        ].map(s => (
          <button key={s.key} onClick={() => share(s.key)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '12px 8px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: s.bg, border: `1px solid ${s.border}`, color: s.color, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.75'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 10px' }}>
        <Icon n="link" size={14} color="var(--muted)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: 'var(--muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url.replace('https://', '')}</span>
        <button onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, flexShrink: 0, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: copied ? '#1a3d2d' : 'var(--ink)', color: 'var(--bg,#fafafa)', border: 'none', transition: 'background .2s' }}>
          <Icon n={copied ? 'check' : 'content_copy'} size={12} color="var(--bg,#fafafa)" />
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
      <button onClick={nativeShare} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink-2)', cursor: 'pointer' }}>
        <Icon n="ios_share" size={14} /> Autres applications…
      </button>
    </div>
  )

  return (
    <>
      <div style={{ marginTop: 12, width: '100%' }}>
        <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--ink-2)', cursor: 'pointer', transition: 'background .15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>
          <Icon n="ios_share" size={15} />
          Partager cette annonce
          <Icon n="expand_more" size={15} style={{ marginLeft: 'auto', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }} />
        </button>
        {open && !isMobileSheet && (
          <div style={{ marginTop: 8, padding: '14px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', animation: 'fadeUp .18s ease' }}>
            <PanelContent />
          </div>
        )}
      </div>
      {open && isMobileSheet && createPortal(
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)', animation: 'fadeIn .18s ease' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, background: 'var(--surface,#0F2418)', borderRadius: '20px 20px 0 0', padding: '0 16px 32px', boxShadow: '0 -8px 40px rgba(0,0,0,.45)', animation: 'slideUp .25s cubic-bezier(.22,1,.36,1)', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px' }}><div style={{ width: 36, height: 4, borderRadius: 99, background: 'var(--border)' }} /></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--ink)' }}>Partager</span>
              <button onClick={() => setOpen(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon n="close" size={16} color="var(--muted)" /></button>
            </div>
            <PanelContent />
          </div>
        </div>,
        document.body
      )}
      <style suppressHydrationWarning>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </>
  )
}

/* ══════════════════════════════════════════════════════════
   SAFESCORE BREAKDOWN — inspiré PropertyDetail safescores
   Visualisation radar-bar des critères d'authenticité
══════════════════════════════════════════════════════════ */
function SafeScoreBreakdown({ si, annonce }) {
  const [expanded, setExpanded] = useState(false)
  if (!si) return null

  const _rawCh = annonce?.champs || annonce?.detail?.champs
  const ch = _rawCh
    ? (typeof _rawCh === 'string' ? (() => { try { return JSON.parse(_rawCh) } catch { return {} } })() : (typeof _rawCh === 'object' && !Array.isArray(_rawCh) ? _rawCh : {}))
    : {}
  const v = annonce?.vendeur || {}
  const isCertifie = String(v.verification_level) === '3'
  const docs = Array.isArray(ch.documents) ? ch.documents : (ch.documents ? [ch.documents] : [])
  const nbPhotos = (annonce.photos?.length || 0) + (annonce.photo_principale ? 1 : 0)

  const criteria = [
    { label: 'KYC vendeur',      score: v.est_verifie ? (isCertifie ? 100 : 80) : 0,   icon: 'person_check' },
    { label: 'Documents',        score: docs.length > 0 ? (ch.documents_verifies ? 100 : 60) : 0, icon: 'description' },
    { label: 'Photos',           score: nbPhotos >= 4 ? 100 : nbPhotos >= 2 ? 70 : nbPhotos >= 1 ? 40 : 0, icon: 'photo_library' },
    { label: 'Téléphone',        score: v.telephone ? 100 : 0, icon: 'phone' },
    { label: 'Certifié+',        score: isCertifie ? 100 : 0, icon: 'workspace_premium' },
    { label: 'Certificat docs',  score: ch.documents_verifies ? 100 : 0, icon: 'verified_user' },
  ]

  const getBarColor = (s) => s >= 80 ? '#1CB87A' : s >= 50 ? 'var(--amber,#D4920A)' : '#EF4444'

  return (
    <div style={{ padding: '12px 16px', borderRadius: 14, background: `${si.dot}10`, border: `1px solid ${si.dot}28`, marginBottom: 16 }}>
      {/* Score header row — miroir PropertyDetail safeAvg */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: expanded ? 12 : 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: si.dot, flexShrink: 0, boxShadow: `0 0 8px ${si.dot}` }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>Score Authenticité</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: si.dot }}>{si.label}</span>
            {si.vendeurCertifieBonus && (
              <img src="/modal/verifed.png" alt="Certifié+" style={{ width: 14, height: 14, objectFit: 'contain', flexShrink: 0 }} />
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: si.dot, lineHeight: 1 }}>{si.score}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>/100</span>
        </div>
        <button onClick={() => setExpanded(e => !e)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer', flexShrink: 0, transition: 'background .15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>
          {expanded ? 'Réduire' : 'Détails'}
          <Icon n={expanded ? 'expand_less' : 'expand_more'} size={12} color="var(--muted)" />
        </button>
      </div>

      {/* Expanded criteria bars — pattern PropertyDetail safescores */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, animation: 'fadeUp .2s ease both' }}>
          {criteria.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon n={c.icon} size={12} color="var(--muted)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--muted)', width: 110, flexShrink: 0 }}>{c.label}</span>
              <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.score}%`, background: getBarColor(c.score), borderRadius: 99, transition: 'width .5s cubic-bezier(.22,1,.36,1)', transitionDelay: `${i * 0.05}s` }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: getBarColor(c.score), width: 28, textAlign: 'right', flexShrink: 0 }}>{c.score}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   BOOKING CARD — sticky droite
   + Nuits stepper (comme PropertyDetail)
   + Total calculé interactif
══════════════════════════════════════════════════════════ */
function BookingCard({ annonce, user }) {
  const isLocation = annonce.type_transaction === 'location'
  const detail = parseChamps(annonce.detail?.champs)
  const vendeurIsMe = user?.id === annonce.vendeur?.id
  const estTerrain = annonce.categorie === 'terrain'
  const isResidence = annonce.categorie === 'residence'
  const cta = getCTA(annonce.categorie, isLocation)
  const { taux, montant: caution } = calculerCaution(annonce.categorie, Number(annonce.prix))
  const pourcent = Math.round(taux * 100)
  const si = useMemo(() => calcAuthenticityScore(annonce), [annonce])

  /* Stepper nuits — miroir PropertyDetail (résidences location nuit uniquement) */
  const periodeRaw = detail?._periode_prix || detail?.periode_prix
  const isNightly = periodeRaw === 'nuit' || (!periodeRaw && isResidence && isLocation)
  const minNuits = 1
  const [nuits, setNuits] = useState(3)

  const totalCalc = isNightly ? Number(annonce.prix) * nuits : null

  const periodeLabel = (() => {
    if (periodeRaw === 'nuit') return '/ nuit'
    if (periodeRaw === 'jour' || periodeRaw === 'journee') return isResidence ? '/ nuit' : '/ jour'
    if (periodeRaw === 'semaine') return '/ semaine'
    return isLocation ? (isResidence ? '/ nuit' : '/ mois') : null
  })()

  return (
    <div className="nx-booking-card">
      {/* Barre top dégradée */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--forest,#1a3d2d), var(--gold,#C4963C))', borderRadius: '20px 20px 0 0' }} />

      {/* Prix */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>
          {isLocation ? (periodeRaw === 'nuit' ? 'Prix par nuit' : periodeRaw === 'semaine' ? 'Prix par semaine' : 'Loyer mensuel') : 'Prix de vente'}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem,2.5vw,1.75rem)', fontWeight: 800, letterSpacing: '-.035em', color: 'var(--ink)', lineHeight: 1, marginBottom: 2 }}>
          {formatPrix(annonce.prix)}
        </div>
        {isLocation && periodeLabel && (
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{periodeLabel}</div>
        )}
      </div>

      {annonce.prix_negociable && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', color: '#22c55e', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
          <Icon n="handshake" size={12} color="#22c55e" /> Prix négociable
        </div>
      )}

      {/* ── Stepper nuits — miroir PropertyDetail ── */}
      {isNightly && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>Nombre de nuits</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', borderRadius: 10, padding: '8px 12px', border: '1.5px solid var(--border)' }}>
            <button onClick={() => setNuits(n => Math.max(minNuits, n - 1))}
              style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: 'var(--ink)', flexShrink: 0 }}>−</button>
            <span style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--ink)' }}>{nuits}</span>
            <button onClick={() => setNuits(n => n + 1)}
              style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--orange,#C87038)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#fff', flexShrink: 0 }}>+</button>
          </div>
          {nuits < 2 && (
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Minimum {minNuits} nuit{minNuits > 1 ? 's' : ''}</div>
          )}
        </div>
      )}

      {/* ── Calcul total interactif (nuits) — miroir PropertyDetail ── */}
      {isNightly && totalCalc !== null && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 13px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{formatPrix(annonce.prix)} × {nuits} nuit{nuits > 1 ? 's' : ''}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{formatPrix(totalCalc)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 13px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: '#1CB87A' }}>Garantie Nexura</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1CB87A' }}>Gratuit</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 13px' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: 'var(--orange,#C87038)' }}>{formatPrix(totalCalc)}</span>
          </div>
        </div>
      )}

      <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />

      {/* SafeScore compact inline */}
      {si && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '7px 10px', borderRadius: 8, background: `${si.dot}12`, border: `1px solid ${si.dot}30` }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: si.dot, flexShrink: 0, boxShadow: `0 0 6px ${si.dot}` }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', flexShrink: 0 }}>Authenticité</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, color: si.dot }}>{si.label}</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, color: si.dot }}>{si.score}<span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>/100</span></span>
          {si.vendeurCertifieBonus && <img src="/modal/verifed.png" alt="Certifié+" style={{ width: 14, height: 14, objectFit: 'contain', flexShrink: 0 }} />}
        </div>
      )}

      {/* Garantie / Caution */}
      <div style={{ background: estTerrain ? 'rgba(26,61,45,.06)' : 'var(--gold-pale,#FFF0E6)', border: `1px solid ${estTerrain ? 'rgba(26,61,45,.2)' : 'rgba(255,122,26,.2)'}`, borderRadius: 10, padding: '8px 10px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon n={estTerrain ? 'verified_user' : 'payments'} size={12} color="var(--muted)" />
          {estTerrain ? 'Protection (3%)' : `Garantie (${pourcent}%)`}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, color: estTerrain ? 'var(--forest,#1a3d2d)' : 'var(--gold,#FF7A1A)', whiteSpace: 'nowrap' }}>
          {formatPrix(caution)}
        </span>
      </div>

      {/* CTA */}
      {vendeurIsMe ? (
        <div style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Icon n="info" size={14} />
          C&apos;est votre annonce.
          <Link href={`/annonces/${annonce.id}/modifier`} style={{ color: 'var(--gold,#FF7A1A)', fontWeight: 700, marginLeft: 4 }}>Modifier</Link>
        </div>
      ) : user ? (
        annonce.statut === 'actif' ? (
          <Link href={`/annonces/${annonce.id}/reserver`} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 16px', borderRadius: 10, background: 'var(--forest,#1a3d2d)', color: 'rgba(245,237,216,.95)', fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', textDecoration: 'none', transition: 'all .22s', boxShadow: '0 4px 16px rgba(26,61,45,.22)', marginBottom: 8, boxSizing: 'border-box' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--forest-mid,#2d5c42)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,61,45,.32)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--forest,#1a3d2d)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,61,45,.25)' }}>
            <Icon n={isLocation ? 'key' : 'bookmark_add'} size={17} color="rgba(245,237,216,.95)" />
            {cta.reserver}
          </Link>
        ) : (
          <div style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Icon n="info" size={14} /> Cette annonce n&apos;est plus disponible.
          </div>
        )
      ) : (
        <Link href="/auth" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, background: 'transparent', color: 'var(--ink)', border: '1.5px solid var(--border)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all .18s', marginBottom: 10, boxSizing: 'border-box' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--ink)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)' }}>
          <Icon n="login" size={15} /> Se connecter pour {isLocation ? 'réserver' : 'acheter'}
        </Link>
      )}

      {/* Garanties */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 2, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        {[
          { icon: 'shield', txt: estTerrain ? 'Protection 3%' : `Garantie ${pourcent}%` },
          { icon: 'verified', txt: 'Vendeur KYC vérifié' },
          { icon: 'undo', txt: 'Remboursement 48h' },
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
            <Icon n={t.icon} size={12} color="var(--gold,#FF7A1A)" /> {t.txt}
          </div>
        ))}
      </div>

      <SharePanel annonce={annonce} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ANNONCES SIMILAIRES
══════════════════════════════════════════════════════════ */
function SimCardSkeleton() {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--white)', border: '1px solid var(--border)' }}>
      <div className="nx-sk" style={{ width: '100%', paddingBottom: '65%', position: 'relative' }}>
        <div className="nx-sk" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="nx-sk" style={{ height: 11, width: '42%', borderRadius: 99 }} />
        <div className="nx-sk" style={{ height: 18, width: '88%' }} />
        <div className="nx-sk" style={{ height: 13, width: '60%' }} />
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <div className="nx-sk" style={{ height: 22, width: 64, borderRadius: 99 }} />
          <div className="nx-sk" style={{ height: 22, width: 56, borderRadius: 99 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <div className="nx-sk" style={{ height: 5, flex: 1, borderRadius: 99 }} />
          <div className="nx-sk" style={{ height: 11, width: 36, borderRadius: 99 }} />
        </div>
      </div>
    </div>
  )
}

function SimilarAnnonces({ currentId, categorie }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!categorie) { setLoading(false); return }
    api.list({ categorie, limit: 20, statut: 'actif' })
      .then(data => {
        const list = (data?.results || data || []).filter(a => String(a.id) !== String(currentId))
        const scored = list.map(a => ({ ...a, _score: calcAuthenticityScore(a)?.score ?? 0 }))
        const highQuality = scored.filter(a => a._score >= 85)
        const top3 = [...highQuality].sort((a, b) => b._score - a._score).slice(0, 3)
        const top3Ids = new Set(top3.map(a => a.id))
        const rest = scored.filter(a => !top3Ids.has(a.id))
        for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[rest[i], rest[j]] = [rest[j], rest[i]] }
        const finalItems = [...top3, ...rest.slice(0, 2)].slice(0, 5)
        if (finalItems.length < 3) {
          const selectedIds = new Set(finalItems.map(a => a.id))
          const remaining = scored.filter(a => !selectedIds.has(a.id))
          for (let i = remaining.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[remaining[i], remaining[j]] = [remaining[j], remaining[i]] }
          setItems([...finalItems, ...remaining].slice(0, 5))
        } else {
          setItems(finalItems)
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [currentId, categorie])

  const Header = () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 10, fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--gold,#C4963C)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          Vous pourriez aimer
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.25rem,2.8vw,1.75rem)', letterSpacing: '-.03em', color: 'var(--ink)', lineHeight: 1.1 }}>
          Annonces similaires
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 12, padding: '3px 10px', borderRadius: 99, fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', background: 'var(--orange-bg-subtle,rgba(200,112,58,.08))', border: '1px solid var(--orange-border,rgba(200,112,58,.2))', color: 'var(--gold,#C4963C)', verticalAlign: 'middle' }}>
            <Icon n="category" size={9} color="var(--gold,#C4963C)" />
            {categorie}
          </span>
        </h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>Sélection des meilleures annonces de la même catégorie</p>
      </div>
      <Link href="/annonces" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 99, fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', background: 'transparent', color: 'var(--ink)', border: '1.5px solid var(--border)', textDecoration: 'none', transition: 'all .18s', whiteSpace: 'nowrap' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--ink)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)' }}>
        Voir plus <Icon n="arrow_forward" size={13} />
      </Link>
    </div>
  )

  if (loading) return (
    <div style={{ marginTop: 'clamp(48px,7vw,88px)' }}>
      <Header />
      <div className="nx-sim-grid">{[1, 2, 3, 4, 5].map(i => <SimCardSkeleton key={i} />)}</div>
    </div>
  )

  const LAMBDA_ANNONCES = [
    { id: '__lambda_1', titre: 'Terrain à bâtir – Cocody Angré', categorie: 'terrain', prix: 12500000, ville: 'Abidjan', commune: 'Cocody', statut: 'actif', images: [], _score: 72, _isLambda: true },
    { id: '__lambda_2', titre: 'Résidence moderne – Marcory Zone 4', categorie: 'residence', prix: 85000000, ville: 'Abidjan', commune: 'Marcory', statut: 'actif', images: [], _score: 68, _isLambda: true },
    { id: '__lambda_3', titre: 'Local commercial – Plateau Centre', categorie: 'commerce', prix: 3500000, ville: 'Abidjan', commune: 'Plateau', statut: 'actif', images: [], _score: 65, _isLambda: true },
  ]

  if (!items.length) return (
    <div style={{ marginTop: 'clamp(48px,7vw,88px)' }}>
      <Header />
      <div className="nx-sim-grid">
        {LAMBDA_ANNONCES.map((a, i) => (
          <div key={a.id} style={{ animation: `fadeUp .44s cubic-bezier(.34,1.2,.64,1) ${i * 65}ms both`, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <a href="/annonces" style={{ position: 'absolute', inset: 0, zIndex: 5, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(13,32,21,0.55)', backdropFilter: 'blur(3px)', textDecoration: 'none', opacity: 0, transition: 'opacity .2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(200,112,58,.85)', borderRadius: 99, padding: '8px 16px' }}>
                Voir les annonces <Icon n="arrow_forward" size={12} color="#fff" />
              </span>
            </a>
            <AnnonceCard annonce={a} index={i} />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ marginTop: 'clamp(48px,7vw,88px)' }}>
      <Header />
      <div className="nx-sim-grid">
        {items.map((a, i) => (
          <div key={a.id} style={{ animation: `fadeUp .44s cubic-bezier(.34,1.2,.64,1) ${i * 65}ms both` }}>
            <AnnonceCard annonce={a} index={i} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   CARTE ZONE
══════════════════════════════════════════════════════════ */
function CarteZone({ annonce }) {
  const mapRef          = useRef(null)
  const mapInstanceRef  = useRef(null)
  const [mapReady, setMapReady]   = useState(false)
  const [coords, setCoords]       = useState(null)
  const [loadError, setLoadError] = useState(false)

  const categorie = annonce.categorie
  const ville     = annonce.commune || annonce.ville || 'Abidjan'
  const shouldShow = ['terrain', 'residence', 'commerce'].includes(categorie)

  const COMMUNE_COORDS = {
    Cocody:[5.3600,-3.9900], Angré:[5.3800,-3.9600], Riviera:[5.3650,-3.9700],
    Yopougon:[5.3500,-4.0700], Abobo:[5.4200,-4.0100], Adjamé:[5.3560,-4.0200],
    Plateau:[5.3190,-4.0180], Treichville:[5.3050,-4.0100], Marcory:[5.2990,-3.9990],
    Bingerville:[5.3600,-3.8800], Koumassi:[5.2960,-3.9770], Vridi:[5.2850,-4.0000],
    Attécoubé:[5.3450,-4.0350], 'Port-Bouët':[5.2570,-3.9280], Songon:[5.3100,-4.1600],
    Agboville:[5.9310,-4.2130],
  }

  useEffect(() => {
    if (!shouldShow) return
    const lat = parseFloat(annonce.latitude), lng = parseFloat(annonce.longitude)
    const hasCoords = !isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0)
    const offset = (range = 0.007) => (Math.random() - 0.5) * range
    if (hasCoords) setCoords([lat + offset(), lng + offset()])
    else if (COMMUNE_COORDS[ville]) setCoords([COMMUNE_COORDS[ville][0] + offset(0.012), COMMUNE_COORDS[ville][1] + offset(0.012)])
    else setCoords([5.354, -4.018])
  }, [annonce.latitude, annonce.longitude, ville, shouldShow])

  useEffect(() => {
    if (!shouldShow || !coords || !mapRef.current || mapInstanceRef.current) return
    const loadLeaflet = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }
      if (!window.L) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          s.onload = resolve; s.onerror = () => { setLoadError(true); reject() }
          document.head.appendChild(s)
        })
      }
      if (!window.L || !mapRef.current) return
      const L = window.L
      const map = L.map(mapRef.current, { center: coords, zoom: 14, zoomControl: true, scrollWheelZoom: false, attributionControl: false })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map)
      L.circle(coords, { radius: 500, color: '#1A3D2D', fillColor: '#2E6B4A', fillOpacity: 0.18, weight: 2, dashArray: '6,4' }).addTo(map)
      const icon = L.divIcon({
        html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:linear-gradient(135deg,#0F2418,#1A3D2D);border:2.5px solid #C8703A;display:flex;align-items:center;justify-content:center;transform:rotate(-45deg);box-shadow:0 4px 14px rgba(15,36,24,.45)"><span style="transform:rotate(45deg);display:flex">${LEAFLET_PIN_SVG}</span></div>`,
        className: '', iconSize: [36, 36], iconAnchor: [18, 36]
      })
      L.marker(coords, { icon }).addTo(map).bindPopup(`<div style="font-family:Syne,sans-serif;padding:4px 2px"><div style="font-weight:800;font-size:13px;margin-bottom:4px">${(annonce.titre || 'Bien').slice(0, 35)}</div><div style="font-size:11px;color:#5A7A6A">${ville}</div><div style="font-size:10px;color:#C8703A;margin-top:4px">Zone approximative</div></div>`)
      mapInstanceRef.current = map
      setMapReady(true)
    }
    loadLeaflet().catch(() => setLoadError(true))
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } }
  }, [coords, shouldShow])

  if (!shouldShow) return null

  return (
    <div style={{ marginBottom: 20 }}>
      <DetailSectionTitle icon="place">Localisation</DetailSectionTitle>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(200,112,58,.08)', border: '1px solid rgba(200,112,58,.2)', borderRadius: 8, marginBottom: 10, fontSize: 11, color: 'var(--ink)' }}>
        <Icon n="lock" size={16} color="var(--orange)" style={{ flexShrink: 0 }} />
        Zone générale affichée — l&apos;adresse exacte vous sera transmise après réservation confirmée.
      </div>
      <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
        {!mapReady && !loadError && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Chargement de la carte…</span>
          </div>
        )}
        {loadError && (
          <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--surface)', color: 'var(--muted)', fontSize: 13 }}>
            <Icon n="place" size={14} color="var(--muted)" /> {ville} — carte indisponible hors-ligne
          </div>
        )}
        <div ref={mapRef} style={{ height: 200, width: '100%' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <span style={{ padding: '5px 12px', borderRadius: 99, background: 'var(--green-bg)', border: '1px solid var(--green-border)', fontSize: 12, fontWeight: 600, color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Icon n="place" size={12} color="var(--green)" /> {ville}
        </span>
      </div>
      <style suppressHydrationWarning>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   VENDEUR CARD ENRICHIE — inspiré PropertyDetail owner card
   Tab system localisation / disponibilité / règles
══════════════════════════════════════════════════════════ */
function VendeurCardEnrichi({ vendeur, user, annonce }) {
  const note = parseFloat(vendeur?.note_moyenne) || 0
  const nbAvis = vendeur?.nb_avis || 0
  const isCertifie = String(vendeur?.verification_level) === '3'
  const [contactOpen, setContactOpen] = useState(false)
  const [msgSent, setMsgSent] = useState(false)
  const [msg, setMsg] = useState(`Bonjour, je suis intéressé(e) par "${annonce?.titre || 'votre annonce'}". Pouvez-vous me donner plus d'informations ?`)

  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, boxShadow: 'var(--sh-sm)', overflow: 'hidden', position: 'relative' }}>
      {/* Décor top — miroir PropertyDetail owner */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--forest,#1a3d2d), transparent)' }} />

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, marginBottom: 16, letterSpacing: '-.02em' }}>À propos du vendeur</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Avatar avec badge vérifié */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <UserAvatar user={vendeur} size={64} style={{ border: '3px solid var(--orange,#C87038)', display: 'block' }} />
          {vendeur?.est_verifie && (
            <img src="/modal/verifed.png" alt="Vérifié" style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, objectFit: 'contain' }} />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 3 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--ink)', letterSpacing: '-.02em' }}>
              {vendeur?.prenom} {vendeur?.nom}
            </span>
            <KYCBadge vendeur={vendeur} />
          </div>

          {/* Ventes */}
          {vendeur?.nb_ventes > 0 && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
              {vendeur.nb_ventes} vente{vendeur.nb_ventes > 1 ? 's' : ''} réalisée{vendeur.nb_ventes > 1 ? 's' : ''}
            </div>
          )}

          {/* Stars — identique PropertyDetail owner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {nbAvis > 0 ? (
              <>
                <Stars note={note} size={12} />
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{note.toFixed(1)}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>· {nbAvis} avis</span>
              </>
            ) : (
              <span style={{ fontSize: 12, color: 'var(--subtle)', fontStyle: 'italic' }}>Aucun avis pour l&apos;instant</span>
            )}
          </div>
        </div>

        {/* Bouton contacter */}
        {user && (
          <button onClick={() => setContactOpen(o => !o)}
            style={{ flexShrink: 0, padding: '9px 18px', borderRadius: 99, background: 'var(--orange,#C87038)', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--orange-light,#E07848)'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--orange,#C87038)'; e.currentTarget.style.transform = 'none' }}>
            Contacter
          </button>
        )}
      </div>

      {/* Contact expand — miroir PropertyDetail contact modal */}
      {contactOpen && user && (
        <div style={{ marginTop: 18, padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, animation: 'fadeUp .22s ease both' }}>
          {msgSent ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(28,184,122,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Icon n="check_circle" size={26} color="#1CB87A" />
              </div>
              <h4 style={{ fontWeight: 800, fontSize: 15, marginBottom: 5 }}>Message envoyé !</h4>
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>{vendeur?.prenom || 'Le vendeur'} vous répondra rapidement.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[
                  { icon: 'phone', label: 'Appel', href: vendeur?.telephone ? `tel:${vendeur.telephone}` : null },
                  { icon: 'chat', label: 'WhatsApp', href: vendeur?.telephone ? `https://wa.me/${vendeur.telephone.replace(/\D/g, '')}` : null },
                ].filter(a => a.href).map(a => (
                  <a key={a.icon} href={a.href} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '11px 6px', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', textDecoration: 'none', color: 'var(--ink)', fontSize: 11, fontWeight: 700, transition: 'all .18s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = 'rgba(200,112,58,.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)' }}>
                    <Icon n={a.icon} size={18} color="var(--orange)" /> {a.label}
                  </a>
                ))}
              </div>
              <textarea rows={3} value={msg} onChange={e => setMsg(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, fontFamily: 'var(--font-ui)', outline: 'none', resize: 'vertical', lineHeight: 1.6, marginBottom: 10, boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--orange)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              <button onClick={() => setMsgSent(true)}
                style={{ width: '100%', padding: '12px', borderRadius: 99, background: 'var(--orange,#C87038)', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--orange-light,#E07848)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--orange,#C87038)'}>
                Envoyer le message
              </button>
            </>
          )}
        </div>
      )}

      {!user && (
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(200,112,58,.06)', border: '1px solid rgba(200,112,58,.2)', borderRadius: 10, fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon n="lock" size={13} color="var(--orange)" />
          <Link href="/auth" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>Connectez-vous</Link>
          &nbsp;pour contacter le vendeur.
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   TAB SYSTEM — Localisation / Disponibilité / Règles
   Inspiré PropertyDetail tab system (tab='location'/'avail'/'rules')
══════════════════════════════════════════════════════════ */
function InfoTabs({ annonce }) {
  const [tab, setTab] = useState('localisation')
  const isLocation = annonce.type_transaction === 'location'
  const detail = parseChamps(annonce.detail?.champs)
  const shouldShowTabs = ['terrain', 'residence', 'commerce'].includes(annonce.categorie)

  if (!shouldShowTabs) return null

  const tabs = [
    { key: 'localisation', label: 'Localisation', icon: 'place' },
    ...(isLocation ? [{ key: 'disponibilite', label: 'Disponibilité', icon: 'calendar_month' }] : []),
    { key: 'regles', label: 'Informations', icon: 'info' },
  ]

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, padding: '4px', background: 'var(--surface)', borderRadius: 14, marginBottom: 20, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: '1 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '9px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700,
            fontFamily: 'var(--font-display)', letterSpacing: '.02em',
            border: 'none', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap',
            background: tab === t.key ? 'var(--white)' : 'transparent',
            color: tab === t.key ? 'var(--ink)' : 'var(--muted)',
            boxShadow: tab === t.key ? 'var(--sh-sm)' : 'none',
          }}>
            <Icon n={t.icon} size={13} color={tab === t.key ? 'var(--orange)' : 'var(--muted)'} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div key={tab} style={{ animation: 'fadeUp .22s ease both' }}>

        {tab === 'localisation' && (
          <CarteZone annonce={annonce} />
        )}

        {tab === 'disponibilite' && (
          <div>
            <DetailSectionTitle icon="calendar_month">Disponibilité & Conditions</DetailSectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 10 }}>
              {[
                { icon: 'event_available', label: 'Disponible', value: annonce.statut === 'actif' ? 'Maintenant' : 'Non disponible', ok: annonce.statut === 'actif' },
                detail.duree_min ? { icon: 'timer', label: 'Durée min.', value: `${detail.duree_min} mois` } : null,
                detail.duree_max ? { icon: 'hourglass_top', label: 'Durée max.', value: `${detail.duree_max} mois` } : null,
                detail.disponible_le ? { icon: 'calendar_today', label: 'Dispo le', value: new Date(detail.disponible_le).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) } : null,
              ].filter(Boolean).map((item, i) => (
                <div key={i} style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Icon n={item.icon} size={13} color="var(--orange)" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{item.label}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: item.ok === false ? '#EF4444' : item.ok === true ? '#1CB87A' : 'var(--ink)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'regles' && (
          <div>
            <DetailSectionTitle icon="info">Informations pratiques</DetailSectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: 'shield', text: 'Bien vérifié par l\'équipe Nexura avant mise en ligne.' },
                { icon: 'payments', text: 'Paiement 100% sécurisé via Wave ou CinetPay. Aucun paiement hors plateforme.' },
                { icon: 'undo', text: 'Remboursement sous 48h en cas de litige ou de non-conformité.' },
                { icon: 'support_agent', text: 'Support disponible 7j/7 pour tout différend entre vendeur et acheteur.' },
                ...(isLocation ? [{ icon: 'key', text: 'Les clés / codes d\'accès sont remis après confirmation de réservation.' }] : []),
                ...(detail.reglement ? [{ icon: 'gavel', text: detail.reglement }] : []),
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <Icon n={r.icon} size={15} color="var(--orange)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.55 }}>{r.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════════════════════ */
export default function AnnonceDetailPage({ initialAnnonce = null }) {
  const { id } = useParams()
  const { user } = useAuth()
  const [annonce, setAnnonce] = useState(initialAnnonce)
  const [loading, setLoading] = useState(!initialAnnonce)
  const si = useMemo(() => (annonce ? calcAuthenticityScore(annonce) : null), [annonce])

  useEffect(() => {
    api.get(id)
      .then(d => { setAnnonce(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />

  if (!annonce) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', paddingTop: 72 }}>
      <div style={{ textAlign: 'center' }}>
        <Icon n="search_off" size={64} color="var(--border)" style={{ display: 'block', margin: '0 auto 16px' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.9rem', letterSpacing: '-.03em', marginBottom: 8 }}>Annonce introuvable</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Cette annonce n&apos;existe pas ou a été supprimée.</p>
        <Link href="/annonces" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 99, background: 'var(--ink)', color: 'var(--bg)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Retour au catalogue</Link>
      </div>
    </div>
  )

  const cat = getCategorieInfo(annonce.categorie)
  const photos = [
    annonce.photo_principale,
    ...(annonce.photos?.map(p => {
      if (!p) return null
      if (typeof p === 'string') return p
      return p.image ?? p.url ?? p.photo ?? p.file ?? p.thumbnail ?? null
    }) || [])
  ].filter(Boolean).map(mediaUrl).filter(Boolean)

  const detail = parseChamps(annonce.detail?.champs)
  const vendeur = annonce.vendeur
  const isLocation = annonce.type_transaction === 'location'
  const equips = Array.isArray(detail.equipements) ? detail.equipements : []
  const EQUIP_KEYS = Object.keys(EQUIPEMENTS)
  const HIDE_KEYS = ['prix_nuit', 'prix_mois', 'prix_semaine', 'periode_prix', 'equipements', 'documents', ...EQUIP_KEYS]
  const specs = Object.entries(detail).filter(([k, v]) => {
    if (k.startsWith('_') || HIDE_KEYS.includes(k) || Array.isArray(v)) return false
    if (v === '' || v === null || v === undefined || v === false || v === 'false') return false
    return true
  })
  const note = parseFloat(vendeur?.note_moyenne) || 0
  const nbAvis = vendeur?.nb_avis || 0
  const cta = getCTA(annonce.categorie, isLocation)
  const estTerrain = annonce.categorie === 'terrain'
  const { taux, montant: caution } = calculerCaution(annonce.categorie, Number(annonce.prix))
  const pourcent = Math.round(taux * 100)
  const vendeurIsMe = user?.id === annonce.vendeur?.id

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'clip', width: '100%', boxSizing: 'border-box', position: 'relative' }}>
      <style suppressHydrationWarning>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes vd-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.85)} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:none} }
        @keyframes shimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes nx-orb-float { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.08) translate(-6px,8px)} }

        .nx-vendor-hero,
        .nx-hero-grid,
        .nx-bottom-section,
        .nx-left-col,
        .nx-right-col { max-width: 100%; box-sizing: border-box; }
        img, video, iframe, canvas, svg { max-width: 100%; height: auto; }

        .nx-vendor-hero {
          max-width: 1340px; width: 100%; margin: 0 auto;
          padding: clamp(20px,3vw,36px) clamp(24px,4vw,64px) 0;
          box-sizing: border-box;
        }
        .nx-vendor-hero-inner {
          display: flex; align-items: center; justify-content: center; gap: 28px;
          padding: 20px 32px; border-radius: 20px;
          background: linear-gradient(135deg, #0D2015 0%, #050E07 100%);
          border: 1px solid rgba(200,96,58,.22);
          position: relative; overflow: hidden; animation: fadeUp .35s ease both;
        }
        .nx-vendor-hero-inner::before {
          content:''; position:absolute; inset:0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,96,58,.07) 0%, transparent 70%);
          pointer-events:none;
        }

        .nx-hero-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;
          padding-top: clamp(20px,3vw,36px); max-width: 1340px; width: 100%; margin: 0 auto;
          padding-left: clamp(24px,4vw,64px); padding-right: clamp(24px,4vw,64px);
          box-sizing: border-box;
        }

        .nx-left-col {
          display: flex; flex-direction: column; gap: 10px;
          animation: slideIn .5s cubic-bezier(.22,1,.36,1) both;
        }

        .nx-right-col {
          display: flex; flex-direction: column; gap: 0;
          position: sticky; top: calc(var(--nav-h,72px) + 12px);
          max-height: calc(100vh - var(--nav-h,72px) - 24px);
          overflow-y: auto; scrollbar-width: none; padding-right: 4px;
        }
        .nx-right-col::-webkit-scrollbar { display: none; }

        .nx-hero-img-wrap {
          position: relative; width: 100%; aspect-ratio: 4/3;
          border-radius: 20px; overflow: hidden; background: var(--surface); cursor: zoom-in;
        }

        .nx-thumb-strip { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; }
        .nx-thumb-strip::-webkit-scrollbar { display: none; }

        .nx-prix-badge { display: inline-flex; align-items: baseline; gap: 6px; }

        /* ── Booking card ── */
        .nx-booking-card {
          background: var(--white);
          border: var(--card-border);
          border-radius: 20px;
          padding: 22px 22px 18px;
          box-shadow: var(--sh-md);
          position: relative;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .nx-cta-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 16px 24px; border-radius: 14px;
          background: linear-gradient(135deg, var(--forest,#1a3d2d) 0%, #0d2015 100%);
          color: var(--cream,#F5EDD8);
          font-family: var(--font-display); font-size: 15px; font-weight: 800;
          letter-spacing: .04em; text-transform: uppercase; text-decoration: none;
          border: none; cursor: pointer;
          transition: all .25s cubic-bezier(.22,1,.36,1);
          box-shadow: 0 6px 28px rgba(26,61,45,.28), inset 0 1px 0 rgba(255,255,255,.08);
          position: relative; overflow: hidden;
        }
        .nx-cta-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.07) 0%, transparent 60%);
          border-radius: inherit;
        }
        .nx-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(26,61,45,.38);
          background: linear-gradient(135deg, #2a5c42 0%, #1a3d2d 100%);
        }

        .nx-spec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px,1fr)); gap: 8px; }
        .nx-guarantee-strip { display: flex; gap: 6px; flex-wrap: wrap; }

        .nx-bottom-section {
          max-width: 1340px; width: 100%; margin: 48px auto 0;
          padding: 0 clamp(24px,4vw,64px); box-sizing: border-box; overflow-x: clip;
        }

        .nx-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
        .nx-detail-desc  { order: 1; }
        .nx-detail-specs { order: 2; }

        .nx-sim-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: clamp(14px,2.5vw,24px); }
        .nx-equip-grid { display: flex; flex-wrap: wrap; gap: 8px; }

        @media (max-width: 900px) {
          .nx-vendor-hero { padding-left: 16px; padding-right: 16px; }
          .nx-vendor-hero-inner { flex-wrap: wrap; gap: 16px; justify-content: flex-start; padding: 16px 20px; width: 100%; box-sizing: border-box; overflow-x: clip; }
          .nx-hero-grid { grid-template-columns: 1fr; gap: 24px; padding-top: 16px; padding-left: 16px; padding-right: 16px; overflow-x: clip; width: 100%; box-sizing: border-box; }
          .nx-left-col { position: static; max-height: none; overflow: visible; overflow-x: clip; min-width: 0; width: 100%; box-sizing: border-box; order: 1; }
          .nx-right-col { position: static; max-height: none !important; overflow: visible !important; overflow-x: clip !important; min-width: 0; width: 100%; box-sizing: border-box; order: 2; }
          .nx-bottom-section { padding-left: 16px; padding-right: 16px; }
          .nx-detail-grid { grid-template-columns: 1fr; gap: 24px; }
          .nx-detail-desc  { order: 1; }
          .nx-detail-specs { order: 2; }
          .nx-spec-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .nx-vendor-hero, .nx-hero-grid, .nx-bottom-section { max-width: 100vw; overflow-x: clip; }
          .nx-left-col, .nx-right-col, .nx-detail-desc, .nx-detail-specs, .nx-booking-card { min-width: 0; max-width: 100%; }
          .nx-right-col h1, .nx-right-col h2, .nx-right-col p, .nx-right-col span, .nx-right-col a { overflow-wrap: break-word; word-break: break-word; }
        }

        @media (max-width: 640px) {
          .nx-spec-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
          .nx-sim-grid { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; scroll-snap-type: x mandatory !important; gap: 12px !important; padding-left: 0 !important; padding-right: 16px !important; padding-bottom: 10px !important; scrollbar-width: none !important; width: 100%; box-sizing: border-box; }
          .nx-sim-grid::-webkit-scrollbar { display: none !important }
          .nx-sim-grid > * { flex: 0 0 min(260px, 72vw) !important; max-width: min(260px, 72vw) !important; min-width: 0 !important; scroll-snap-align: start !important; }
        }

        @media (max-width: 420px) {
          .nx-spec-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
          .nx-detail-grid { gap: 20px; }
        }

        ${DETAIL_SPEC_STYLES}
      `}</style>

      {/* ══════════ VENDEUR HERO ══════════ */}
      {vendeur && (
        <div className="nx-vendor-hero">
          <div className="nx-vendor-hero-inner">
            {!user && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(13,32,21,.82)', backdropFilter: 'blur(6px)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '16px 32px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <Icon n="lock" size={18} color="var(--orange,#E07848)" />
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: '#F5EDD8', letterSpacing: '-.02em' }}>Coordonnées sécurisées</div>
                    <div style={{ fontSize: 12, color: 'rgba(245,237,216,.5)', marginTop: 1 }}>Connectez-vous pour contacter le vendeur</div>
                  </div>
                </div>
                <Link href="/auth" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 99, background: 'var(--orange,#C8603A)', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Se connecter
                </Link>
              </div>
            )}

            <Link href={user ? `/vendeurs/${vendeur.id}` : '#'} style={{ position: 'relative', flexShrink: 0, textDecoration: 'none', pointerEvents: user ? 'auto' : 'none' }}>
              <UserAvatar user={vendeur} size={56} style={{ border: '2.5px solid rgba(200,96,58,.4)', boxShadow: '0 2px 16px rgba(0,0,0,.3)', display: 'block' }} />
              {vendeur.est_verifie && <img src="/modal/verifed.png" alt="Vérifié" style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, objectFit: 'contain' }} />}
            </Link>

            <div style={{ width: 1, height: 40, background: 'rgba(200,96,58,.18)', flexShrink: 0 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(245,237,216,.4)' }}>Profil vendeur</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Link href={user ? `/vendeurs/${vendeur.id}` : '#'} style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'rgba(245,237,216,.95)', letterSpacing: '-.02em', textDecoration: 'none', pointerEvents: user ? 'auto' : 'none' }}
                  onMouseEnter={e => { if (user) e.currentTarget.style.color = 'var(--orange-light,#F4A070)' }}
                  onMouseLeave={e => { if (user) e.currentTarget.style.color = 'rgba(245,237,216,.95)' }}>
                  {vendeur.prenom} {vendeur.nom}
                </Link>
                <KYCBadge vendeur={vendeur} />
                {vendeur.nb_ventes > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--orange-light,#F4A070)', background: 'rgba(200,96,58,.12)', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(200,96,58,.22)' }}>
                    {vendeur.nb_ventes} vente{vendeur.nb_ventes > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {nbAvis > 0 ? (<><Stars note={note} size={12} /><span style={{ fontSize: 12, color: 'rgba(245,237,216,.5)' }}>{note.toFixed(1)} · {nbAvis} avis</span></>) : (<span style={{ fontSize: 12, color: 'rgba(245,237,216,.35)', fontStyle: 'italic' }}>Aucun avis pour l&apos;instant</span>)}
              </div>
            </div>

            <div style={{ width: 1, height: 40, background: 'rgba(200,96,58,.18)', flexShrink: 0 }} />

            {user && (
              <a href={`tel:${vendeur.telephone}`} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 99, background: 'var(--orange,#C8603A)', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'all .18s', boxShadow: '0 4px 18px rgba(200,96,58,.35)', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--orange-light,#E07A52)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--orange,#C8603A)'; e.currentTarget.style.transform = 'none' }}>
                <Icon n="phone" size={16} color="#fff" /> Appeler
              </a>
            )}
          </div>
        </div>
      )}

      {/* ══════════ HERO GRID ══════════ */}
      <div className="nx-hero-grid">

        {/* ════ GAUCHE — Galerie ════ */}
        <div className="nx-left-col">
          <div className="nx-hero-img-wrap">
            <Gallery photos={photos} titre={annonce.titre} cat={cat} />
          </div>

          {/* Vendeur card enrichie — dans la colonne gauche, sous la galerie */}
          {vendeur && (
            <div style={{ animation: 'fadeUp .45s .1s ease both' }}>
              <VendeurCardEnrichi vendeur={vendeur} user={user} annonce={annonce} />
            </div>
          )}
        </div>

        {/* ════ DROITE — Infos + CTA + Booking ════ */}
        <div className="nx-right-col">

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)', marginBottom: 20, flexWrap: 'wrap', animation: 'fadeUp .4s ease both' }}>
            <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Accueil</Link>
            <Icon n="chevron_right" size={13} color="var(--border)" />
            <Link href="/annonces" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Annonces</Link>
            <Icon n="chevron_right" size={13} color="var(--border)" />
            <span style={{ color: 'var(--ink)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{annonce.titre}</span>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, flexWrap: 'wrap', animation: 'fadeUp .4s .05s ease both' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.04em', textTransform: 'capitalize' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color, display: 'inline-block', flexShrink: 0 }} />
              {cat.label}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>
              <Icon n={isLocation ? 'key' : 'sell'} size={11} color="var(--muted)" />
              {isLocation ? 'Location' : 'Vente'}
            </span>
            {annonce.statut === 'actif' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, background: 'rgba(5,150,105,.08)', border: '1px solid rgba(5,150,105,.2)', fontSize: 11, fontWeight: 700, color: '#05966a', letterSpacing: '.04em' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#05966a', animation: 'vd-pulse 2s ease infinite' }} />
                Disponible
              </span>
            )}
            {annonce.nb_vues > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 99, background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)' }}>
                <Icon n="visibility" size={11} color="var(--muted)" /> {annonce.nb_vues} vues
              </span>
            )}
          </div>

          {/* Titre */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem,2.8vw,2.1rem)', letterSpacing: '-.04em', lineHeight: 1.08, color: 'var(--ink)', marginBottom: 10, animation: 'fadeUp .4s .08s ease both' }}>
            {annonce.titre}
          </h1>

          {/* Localisation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)', fontSize: 13, marginBottom: 20, animation: 'fadeUp .4s .1s ease both' }}>
            <Icon n="location_on" size={15} color="var(--gold,#C4963C)" />
            {[annonce.quartier, annonce.commune, annonce.ville].filter(Boolean).join(', ')}
          </div>

          <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

          {/* Prix */}
          <div style={{ marginBottom: 20, animation: 'fadeUp .4s .12s ease both' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
              {isLocation ? 'Loyer' : 'Prix de vente'}
            </div>
            <div className="nx-prix-badge">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, letterSpacing: '-.04em', color: 'var(--ink)', lineHeight: 1 }}>
                {formatPrix(annonce.prix)}
              </span>
              {isLocation && (
                <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
                  {(() => {
                    const ch = detail || {}
                    const p = ch._periode_prix || ch.periode_prix
                    if (p === 'nuit') return '/ nuit'
                    if (p === 'jour' || p === 'journee') return '/ jour'
                    if (p === 'semaine') return '/ semaine'
                    return '/ mois'
                  })()}
                </span>
              )}
            </div>
            {annonce.prix_negociable && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 99, background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', color: '#22c55e', fontSize: 11, fontWeight: 600, marginTop: 8 }}>
                <Icon n="handshake" size={12} color="#22c55e" /> Prix négociable
              </div>
            )}
          </div>

          {/* ── SafeScore breakdown enrichi (remplace le simple badge) ── */}
          {si && (
            <div style={{ animation: 'fadeUp .4s .14s ease both', marginBottom: 0 }}>
              <SafeScoreBreakdown si={si} annonce={annonce} />
            </div>
          )}

          {/* Garantie / Caution */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', background: estTerrain ? 'rgba(26,61,45,.06)' : 'var(--gold-pale,#FFF0E6)', border: `1px solid ${estTerrain ? 'rgba(26,61,45,.2)' : 'rgba(255,122,26,.2)'}`, borderRadius: 12, marginBottom: 20, animation: 'fadeUp .4s .16s ease both', overflow: 'hidden', boxSizing: 'border-box', width: '100%' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}>
              <Icon n={estTerrain ? 'verified_user' : 'payments'} size={14} color="var(--muted)" />
              {estTerrain ? 'Protection plateforme (3%)' : `Garantie de réservation (${pourcent}%)`}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: estTerrain ? 'var(--forest,#1a3d2d)' : 'var(--gold,#FF7A1A)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {formatPrix(caution)}
            </span>
          </div>

          {/* CTA */}
          <div style={{ marginBottom: 16, animation: 'fadeUp .4s .18s ease both' }}>
            {vendeurIsMe ? (
              <div style={{ padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon n="info" size={15} /> C&apos;est votre annonce.
                <Link href={`/annonces/${annonce.id}/modifier`} style={{ color: 'var(--gold,#FF7A1A)', fontWeight: 700, marginLeft: 4 }}>Modifier</Link>
              </div>
            ) : user ? (
              annonce.statut === 'actif' ? (
                <Link href={`/annonces/${annonce.id}/reserver`} className="nx-cta-btn">
                  <Icon n={isLocation ? 'key' : 'bookmark_add'} size={20} color="var(--cream,#F5EDD8)" />
                  {cta.reserver}
                </Link>
              ) : (
                <div style={{ padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon n="info" size={15} /> Cette annonce n&apos;est plus disponible.
                </div>
              )
            ) : (
              <Link href="/auth" className="nx-cta-btn" style={{ background: 'transparent', color: 'var(--ink)', border: '1.5px solid var(--border)', boxShadow: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--ink)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                <Icon n="login" size={18} color="var(--ink)" />
                Se connecter pour {isLocation ? 'réserver' : 'acheter'}
              </Link>
            )}
          </div>

          {/* Garanties strip */}
          <div className="nx-guarantee-strip" style={{ marginBottom: 20, animation: 'fadeUp .4s .2s ease both' }}>
            {[
              { icon: 'shield', txt: estTerrain ? 'Protection 3%' : `Garantie ${pourcent}%` },
              { icon: 'verified', txt: 'Vendeur KYC vérifié' },
              { icon: 'undo', txt: 'Remboursement 48h' },
              { icon: 'support_agent', txt: 'Support 7j/7' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)', padding: '5px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 99 }}>
                <Icon n={t.icon} size={12} color="var(--gold,#FF7A1A)" /> {t.txt}
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

          {/* Partage */}
          <div style={{ animation: 'fadeUp .4s .24s ease both' }}>
            <SharePanel annonce={annonce} />
          </div>

          {/* Meta dates */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 11, color: 'var(--muted)', paddingTop: 16, marginTop: 16, borderTop: '1px solid var(--border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon n="schedule" size={12} color="var(--muted)" />
              Publiée le {new Date(annonce.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon n="update" size={12} color="var(--muted)" />
              MàJ le {new Date(annonce.updated_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════ SECTION BAS ══════════ */}
      <div className="nx-bottom-section">

        {/* Divider décoratif */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, var(--border))' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 99, border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <Icon n="description" size={14} color="var(--muted)" />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>Informations détaillées</span>
          </div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--border), transparent)' }} />
        </div>

        {/* Description + Caractéristiques */}
        <div className="nx-detail-grid" style={{ marginBottom: 48 }}>
          {annonce.description && (
            <div className="nx-detail-desc">
              <DetailSectionTitle icon="description">À propos de ce bien</DetailSectionTitle>
              <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.75, whiteSpace: 'pre-line', margin: 0, fontWeight: 400 }}>{annonce.description}</p>
            </div>
          )}

          {(specs.length > 0 || equips.length > 0) && (
            <div className="nx-detail-specs">
              <DetailSectionTitle icon="grid_view">Caractéristiques</DetailSectionTitle>
              {specs.length > 0 && (
                <div className="nx-spec-grid" style={{ marginBottom: equips.length > 0 ? 16 : 0 }}>
                  {specs.map(([k, v], i) => (
                    <SpecCard key={k} specKey={k} value={v} index={i} accent={cat.color} />
                  ))}
                </div>
              )}
              {specs.length > 0 && equips.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Équipements</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
              )}
              {equips.length > 0 && (
                <div className="nx-equip-grid">
                  {equips.map((eq) => {
                    const info = EQUIPEMENTS[eq] || { label: eq, icon: 'check_circle' }
                    return <EquipChip key={eq} eqKey={eq} label={info.label} iconName={info.icon} />
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Tab system : Localisation / Disponibilité / Règles ── */}
        <InfoTabs annonce={annonce} />

        {/* Annonces similaires */}
        <SimilarAnnonces currentId={annonce.id} categorie={annonce.categorie} />

        <div style={{ height: 64 }} />
      </div>
    </div>
  )
}
