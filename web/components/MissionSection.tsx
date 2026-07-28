import Image from 'next/image'
import RainbowText from './RainbowText'

// Port direct de <section class="mission-section" id="histoire"> (index.html),
// converti en 2 colonnes : texte à gauche, photo à droite.
export default function MissionSection() {
  return (
    <section className="mission-section" id="histoire" data-theme="maroon">
      <div className="mission-layout">
        <div className="mission-text-col">
          <div className="eyebrow"> Notre Histoire</div>
          <div className="mission-text-huge elastic-title">
            Nous élevons
            <br />
            avec
            <br />
            <span style={{ color: 'var(--rust)' }}>soin.</span>
          </div>
          <div className="mission-description">
            <RainbowText
              text="Chez Florence est un élevage familial installé à Azaguié Gare, à trente minutes d'Abidjan. Nous élevons et sélectionnons nos lapins de race — Hollandais, Rex, Angora Français — avec la même attention à chaque portée : pesée précise, suivi de santé, accompagnement du choix jusqu'à la remise. Particuliers, restaurateurs ou éleveurs PME repartent avec un lapin dont on connaît l'histoire depuis le premier jour. Retrait sur place à Azaguié Gare ou livraison à Abidjan, Agboville et Adzopé — toujours par WhatsApp, toujours avec la même exigence."
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
