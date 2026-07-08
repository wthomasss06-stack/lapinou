'use client'

// No. 04 — Portrait. L'iris (clip-path circle 0% → 150%) est pinné et
// scrubé au scroll par lib/useGsapLenis.ts (ScrollTrigger sur #sec-iris,
// desktop uniquement — la version mobile déroule normalement en CSS).
export default function IrisSection() {
  return (
    <section id="sec-iris" className="fx-section">
      <div className="eyebrow" data-no="No. 04">(Portrait)</div>
      <h2 className="iris-word">CHEZ FLORENCE</h2>
      <div className="takeover-layer iris-mask">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/IMAGES/Snapchat-533353503.webp" loading="lazy" alt="Portrait de lapin" />
      </div>
    </section>
  )
}
