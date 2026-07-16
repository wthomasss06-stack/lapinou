const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

// Port direct de .sticky-cta-mobile (index.html) — remplace .nav-center
// et .btn-outline sous 900px. Stratégie mobile du design : un seul CTA
// permanent plutôt qu'un menu hamburger.
export default function StickyMobileCta() {
  if (!WHATSAPP) return null
  return (
    <a
      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Bonjour Chez Florence, je suis intéressé par vos lapins.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="sticky-cta-mobile"
    >
      Commander sur WhatsApp →
    </a>
  )
}
