import Image from 'next/image'
import RainbowText from './RainbowText'

// Port direct de <section class="mission-section" id="histoire"> (index.html),
// converti en 2 colonnes : texte à gauche, photo à droite.
export default function MissionSection() {
  return (
    <section className="mission-section" id="histoire">
      <div className="mission-layout">
        <div className="mission-text-col">
          <div className="eyebrow">No. 02 — Notre Histoire</div>
          <div className="mission-text-huge reveal-text">
            Nous élevons
            <br />
            avec
            <br />
            <span style={{ color: 'var(--rust)' }}>soin.</span>
          </div>
          <div className="mission-description">
            <RainbowText
              text="Nous élevons et sélectionnons nos lapins avec soin — pesée précise, bonne santé, et un accompagnement complet du choix jusqu'à la vente. L'élevage qui vous connecte directement aux plus beaux lapins, en toute confiance, partout en Côte d'Ivoire."
              variant="white"
            />
          </div>
        </div>
        <div className="mission-image-col reveal-text">
          <Image
            src="/IMAGES/eleveur-soin.jpg"
            alt="Éleveur Chez Florence prenant soin d'un lapin"
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  )
}
