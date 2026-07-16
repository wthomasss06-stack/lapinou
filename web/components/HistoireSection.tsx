// Notre Histoire — port fidèle de chez-florence-landing.html. Fusionnée
// avec Garanties dans l'ancienne mouture (GarantiesSection.tsx) ; séparée
// ici en 2 sections distinctes pour matcher exactement le nouveau design.
//
// id="a-propos" reste présent (div vide, ancre) : /app/about/page.tsx
// redirige vers /#a-propos et ne doit pas être cassé par ce refactor.
export default function HistoireSection() {
  return (
    <section className="mission-section" id="histoire" data-theme="dark">
      <div id="a-propos" />

      <div className="mission-layout">
        <div>
          <div className="eyebrow">No. 02 — Notre Histoire</div>
          <div className="mission-text-huge reveal-text">
            Nous élevons
            <br />
            avec
            <br />
            <span style={{ color: 'var(--accent-orange)' }}>soin.</span>
          </div>
        </div>
        <div className="mission-description">
          <p className="reveal-text">
            Nous élevons et sélectionnons nos lapins avec soin — pesée
            précise, bonne santé, et un accompagnement complet du choix
            jusqu&apos;à la vente. L&apos;élevage qui vous connecte
            directement aux plus beaux lapins, en toute confiance, partout
            en Côte d&apos;Ivoire.
          </p>
        </div>
      </div>

      <div className="marquee-container">
        <div className="marquee-inner">
          <span>
            DISPONIBLE · RETRAIT RAPIDE · QUALITÉ CONTRÔLÉE · PRÊT À LA VENTE
            · EN STOCK · ENVIRON 2 KG · LAPIN FRAIS · SÉLECTIONNÉ · PESÉ AVEC
            SOIN ·
          </span>
          <span>
            DISPONIBLE · RETRAIT RAPIDE · QUALITÉ CONTRÔLÉE · PRÊT À LA VENTE
            · EN STOCK · ENVIRON 2 KG · LAPIN FRAIS · SÉLECTIONNÉ · PESÉ AVEC
            SOIN ·
          </span>
        </div>
      </div>
    </section>
  )
}
