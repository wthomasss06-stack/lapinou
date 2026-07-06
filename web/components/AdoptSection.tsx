'use client'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

// Page 5 — clôture cinématique "Commandez". Purement déclarative (aucune
// animation JS dédiée côté index.html au-delà du scroll normal). Le
// catalogue complet, le formulaire de contact et le footer utilitaire
// (liens légaux) restent juste après, inchangés.
export default function AdoptSection() {
  const whatsappUrl = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Bonjour, j'aimerais commander un lapin.")}`
    : '#'

  return (
    <div id="page5">
      <div id="page5-heading-1">Commandez</div>
      <div id="page5-bottom-heading">wthomasss06@gmail.com</div>

      <div id="page5-label-2">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>

      <div id="page5-footer">
        <div id="footer-left">
          <div id="footer-left-1">Une question sur nos lapins ?</div>
          <div id="footer-left-2">Écrivez-nous directement</div>
        </div>
        <div id="footer-middle">
          <div id="footer-middle-1">on vous</div>
          <div id="footer-middle-2">répond vite</div>
        </div>
        <div id="footer-right">
          <div id="footer-right-1">ⓒ tous droits réservés</div>
          <div id="footer-right-2">CHEZ FLORENCE</div>
        </div>
      </div>
    </div>
  )
}
