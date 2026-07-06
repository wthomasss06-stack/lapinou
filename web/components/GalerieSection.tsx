'use client'

// No. 04 — Triptyque. Trois panneaux affichent des tranches d'une même
// composition (déplacées en arrière-plan via CSS) ; au scroll, les deux
// panneaux latéraux se réduisent et disparaissent pendant que le panneau
// central prend tout l'écran (voir lib/useGsapLenis.ts, pin sur #sec-gallery,
// desktop uniquement — la version mobile affiche les 3 panneaux côte à côte).
export default function GalerieSection() {
  return (
    <section id="sec-gallery" className="fx-section">
      <div className="eyebrow" data-no="No. 04">(Triptyque)</div>
      <div className="triptych-wrapper">
        <div className="trip-panel trip-side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IMAGES/Snapchat-90679770~1.webp" loading="lazy" alt="Lapin" />
        </div>
        <div className="trip-panel trip-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IMAGES/Snapchat-1016404691~1.webp" loading="lazy" alt="Lapin" />
        </div>
        <div className="trip-panel trip-side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IMAGES/Snapchat-1244423645~1.webp" loading="lazy" alt="Lapin" />
        </div>
      </div>
    </section>
  )
}
