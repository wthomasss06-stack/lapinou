import RainbowText from './RainbowText'

// Port direct de <section class="mission-section" id="histoire"> (index.html).
// Le marquee "Disponible · Retrait Rapide..." qui vivait ici (position
// absolute, chevauchait le texte) est maintenant la Ligne 1 de
// <TrustMarquee /> juste après le Hero — en flux normal, plus de bug de
// chevauchement possible.
export default function MissionSection() {
  return (
    <section className="mission-section" id="histoire">
      <div className="mission-layout">
        <div>
          <div className="eyebrow">No. 02 — Notre Histoire</div>
          <div className="mission-text-huge reveal-text">
            Nous élevons
            <br />
            avec
            <br />
            <span style={{ color: 'var(--rust)' }}>soin.</span>
          </div>
        </div>
        <div className="mission-description">
          <RainbowText
            text="Nous élevons et sélectionnons nos lapins avec soin — pesée précise, bonne santé, et un accompagnement complet du choix jusqu'à la vente. L'élevage qui vous connecte directement aux plus beaux lapins, en toute confiance, partout en Côte d'Ivoire."
            variant="white"
          />
        </div>
      </div>
    </section>
  )
}
