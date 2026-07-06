'use client'

// Page 3 — Nos Races. Le fond ink→paper, le texte "above-intro-1" et le
// parallax croisé des deux plates latérales (page3-img-2 / -3) sont scrubés
// au scroll depuis lib/useGsapLenis.ts (ScrollTrigger cible ces IDs).
export default function RacesSection() {
  return (
    <div id="page3">
      <div id="page3-heading-1">(Nos Races)</div>

      <div id="intro-container-1">
        <div id="behind-intro-1">
          Chaque lignée est choisie pour sa santé et la qualité de sa chair — du format simple au
          grand lot pour les professionnels.
        </div>
        <div id="above-intro-1">
          Chaque lignée est choisie pour sa santé et la qualité de sa chair — du format simple au
          grand lot pour les professionnels.
        </div>
      </div>

      <div id="page3-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/IMAGES/Snapchat-533353503~1.webp" loading="lazy" alt="Lapin d'élevage" />
        <span className="plate-mark">Plate II</span>
      </div>

      <div id="page3-img-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/IMAGES/Snapchat-73962748~1.webp" loading="lazy" alt="Lapin d'élevage" />
        <span className="plate-mark">Plate III</span>
      </div>

      <div id="page3-img-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/IMAGES/Snapchat-763078288~1.webp" loading="lazy" alt="Lapin d'élevage" />
        <span className="plate-mark">Plate IV</span>
      </div>
    </div>
  )
}
