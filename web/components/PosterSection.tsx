import Image from 'next/image'

// Affiche visuelle — juste après Témoignages, avant la FAQ. Coupure
// purement visuelle dans le scroll, pas de titre ni de texte.
export default function PosterSection() {
  return (
    <section id="affiche" className="poster-section">
      <div className="poster-frame reveal-text">
        <Image
          src="/IMAGES/vente-lapins-affiche.jpg"
          alt="Affiche Chez Florence — Vente de lapins, Azaguié, Côte d'Ivoire"
          width={1376}
          height={768}
          sizes="(max-width: 900px) 100vw, 78rem"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    </section>
  )
}
