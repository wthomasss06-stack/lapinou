'use client'

// No. 06 — En Mouvement. Le blob (scale 0.12→1 + border-radius organique→0%)
// est pinné et scrubé, et la vidéo joue/pause selon la visibilité de la
// section — tout ceci est géré depuis lib/useGsapLenis.ts (cible #sec-blob,
// .blob-mask, #blob-video), exactement comme dans index.html.
export default function BlobSection() {
  return (
    <section id="sec-blob" className="fx-section">
      <div className="eyebrow" data-no="No. 06">(En Mouvement)</div>
      <div className="blob-mask">
        <video
          id="blob-video"
          muted
          loop
          playsInline
          preload="metadata"
          src="/IMAGES/Snapchat-1680052335_001.webm"
        />
      </div>
    </section>
  )
}
