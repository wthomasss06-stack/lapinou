'use client'

// Bandeau CTA pinné. Le texte défile horizontalement pendant que l'on
// scrolle verticalement (containerAnimation), et chaque caractère
// (SplitText chars,words) rentre dans le cadre avec un petit chaos aléatoire
// (yPercent/rotation "random"). Logique complète dans lib/useGsapLenis.ts.
export default function HorizontalCta() {
  return (
    <section className="Horizontal">
      <div className="horizontal-inner">
        <h3 className="Horizontal__text heading-xl">
          Et si chaque lapin trouvait la bonne table???
        </h3>
      </div>
    </section>
  )
}
