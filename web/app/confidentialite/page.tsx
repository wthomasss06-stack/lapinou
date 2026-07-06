import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Confidentialité | CHEZ FLORENCE',
  description: 'Politique de confidentialité du site CHEZ FLORENCE — données collectées, géolocalisation, cookies.',
}

const sections = [
  {
    title: '1. Données collectées',
    body: "Lors d'une réservation ou d'un message via le formulaire de contact, nous collectons votre nom, email, numéro de téléphone et le contenu de votre message. Ces informations servent uniquement à organiser la vente et la livraison de votre lapin.",
  },
  {
    title: '2. Géolocalisation',
    body: "Si vous l'autorisez, votre position GPS est utilisée pour calculer automatiquement votre zone de livraison et le frais correspondant. Cette autorisation vous est demandée explicitement au moment où elle est utile (par exemple sur la carte de localisation), jamais en arrière-plan sans action de votre part. Vous pouvez refuser sans que cela empêche la réservation — la zone de livraison sera alors convenue directement avec le vendeur.",
  },
  {
    title: '3. Cookies',
    body: "Le site utilise un nombre minimal de cookies techniques pour mémoriser votre choix de consentement et, si vous l'acceptez, des statistiques de visite anonymisées (nombre de visites, pages consultées) qui nous aident à améliorer le site. Aucun cookie publicitaire ou de tracking tiers n'est utilisé.",
  },
  {
    title: '4. Partage des données',
    body: "Vos données ne sont jamais vendues ni partagées avec des tiers à des fins commerciales. Elles sont uniquement utilisées par l'équipe CHEZ FLORENCE pour traiter votre réservation et vous contacter (email et WhatsApp).",
  },
  {
    title: '5. Conservation',
    body: "Les informations liées à une réservation sont conservées le temps nécessaire au traitement de la commande et à des fins de suivi commercial raisonnable, puis supprimées ou anonymisées.",
  },
  {
    title: '6. Vos droits',
    body: "Vous pouvez à tout moment demander l'accès, la correction ou la suppression de vos données personnelles en nous contactant via la page Contact ou directement sur WhatsApp.",
  },
  {
    title: '7. Contact',
    body: 'Pour toute question relative à vos données personnelles, écrivez-nous à wthomasss06@gmail.com ou via le formulaire de contact du site.',
  },
]

export default function ConfidentialitePage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">Informations légales</p>
          <h1 className="font-display text-4xl font-extrabold text-white mb-2">
            Politique de confidentialité
          </h1>
          <p className="text-white/35 text-xs mb-10">Dernière mise à jour : juin 2026</p>

          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-display font-bold text-white text-base mb-2">{s.title}</h2>
                <p className="text-white/50 text-sm leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
