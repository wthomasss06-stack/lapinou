// Port direct de <section id="garanties"> (index.html).
const GARANTIES = [
  { num: '01.', title: 'Santé Vérifiée', desc: 'Chaque lapin est examiné avant la vente : poids, pelage et comportement contrôlés avec soin. Aucun animal malade ne quitte notre élevage.' },
  { num: '02.', title: 'Pesée & Classement', desc: 'Chaque lapin est pesé et classé avec précision — du format simple au lot pour les restaurateurs. Pas de surprise sur le poids.' },
  { num: '03.', title: 'Suivi Après-Vente', desc: "Conseils de conservation et d'élevage disponibles après chaque achat. On reste en contact pour vous accompagner." },
  { num: '04.', title: 'Remise en Main Propre', desc: 'Retrait sur place à Azaguié Gare ou livraison encadrée, selon votre disponibilité et votre zone.' },
]

export default function GarantiesSection() {
  return (
    <section id="garanties">
      <div className="section-head">
        <div>
          <div className="eyebrow">Nos Engagements — Santé · Race · Suivi</div>
          <h2 className="section-title reveal-text">
            Nos
            <br />
            Garanties
          </h2>
        </div>
      </div>
      <div className="garanties-grid">
        {GARANTIES.map((g) => (
          <div className="garantie-item reveal-text" key={g.num}>
            <div className="garantie-num">{g.num}</div>
            <div className="garantie-title">{g.title}</div>
            <div className="garantie-desc">{g.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
