import Link from 'next/link'
import './InnerFooter.css'

// Port direct du <footer> minimal des pages secondaires (aide/conditions/
// confidentialite.html) — une seule ligne, pas le gros footer CTA de la
// home. Set de liens unifié (les 3 maquettes variaient légèrement le
// lien à exclure sur leur propre page ; simplifié ici pour un seul
// composant partagé).
export default function InnerFooter() {
  return (
    <footer className="inner-footer">
      <p>
        © 2026 Chez Florence — <Link href="/">Accueil</Link> — <Link href="/aide">Aide</Link> —{' '}
        <Link href="/confidentialite">Confidentialité</Link> — <Link href="/conditions">Conditions</Link>
      </p>
    </footer>
  )
}
