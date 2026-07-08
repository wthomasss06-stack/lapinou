import { MessageCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: "Conditions d'utilisation | CHEZ FLORENCE",
  description: "Conditions d'utilisation du site CHEZ FLORENCE — réservation, stock, livraison et paiement.",
}

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

const sections = [
  {
    title: '1. Objet',
    body: "Le site CHEZ FLORENCE permet de consulter les races de lapins disponibles à la vente, de réserver une quantité de lapins parmi le stock affiché, et d'être mis en relation avec le vendeur via WhatsApp pour finaliser la transaction. CHEZ FLORENCE est exploité par AKATech, basé à Abidjan, Côte d'Ivoire.",
  },
  {
    title: '2. Fonctionnement des réservations',
    body: "Chaque fiche présentée correspond à une race ou une portée disponible en plusieurs exemplaires (stock). En cliquant sur \"Réserver\", vous indiquez la quantité souhaitée ; cette quantité est immédiatement déduite du stock affiché afin d'éviter les doubles réservations. La réservation n'engage le paiement qu'après confirmation directe avec le vendeur.",
  },
  {
    title: '3. Disponibilité du stock',
    body: "Les quantités affichées reflètent le stock réel au moment de la consultation, mais peuvent évoluer rapidement en cas de forte demande. Une fiche dont le stock atteint zéro est automatiquement marquée \"Stock épuisé\" et n'est plus réservable jusqu'à réapprovisionnement.",
  },
  {
    title: '4. Prix et paiement',
    body: "Les prix affichés sont en Francs CFA (FCFA) et s'entendent à l'unité, hors frais de livraison éventuels. Les modalités de paiement (espèces, mobile money) sont convenues directement avec le vendeur lors de l'échange WhatsApp suivant la réservation.",
  },
  {
    title: '5. Livraison',
    body: "CHEZ FLORENCE propose une livraison locale en Côte d'Ivoire selon trois zones de frais : Abidjan, Azaguié et alentours, et le reste du territoire. La zone et le frais correspondant sont calculés automatiquement à partir de la position transmise lors de la réservation, sous réserve d'acceptation de la géolocalisation par le client.",
  },
  {
    title: '6. Annulation',
    body: "Une réservation peut être annulée par le vendeur en cas d'indisponibilité finale du lapin ; la quantité réservée est alors restituée au stock. Le client souhaitant annuler une réservation est invité à contacter le vendeur directement via WhatsApp.",
  },
  {
    title: '7. Santé des animaux',
    body: "Les lapins proposés font l'objet d'un suivi vétérinaire avant leur mise en vente. Certaines fiches précisent des prestations incluses (vaccination, kit de toilettage) dans leur note de prix.",
  },
  {
    title: '8. Modification des présentes conditions',
    body: "Ces conditions peuvent être mises à jour à tout moment afin de refléter l'évolution du service. La version en vigueur est celle publiée sur cette page à la date de votre visite.",
  },
]

export default function ConditionsPage() {
  const whatsappUrl = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Bonjour, j'ai une question sur les conditions d'utilisation.")}`
    : null

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">Informations légales</p>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 break-words">
              Conditions <span className="text-gradient">d'utilisation</span>
            </h1>
            <p className="text-white/40 text-xs">Dernière mise à jour : juin 2026</p>
          </div>

          <div className="space-y-4">
            {sections.map((s, i) => (
              <section
                key={s.title}
                className="glass rounded-2xl p-6 animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
              >
                <h2 className="font-display font-bold text-white text-base mb-2">{s.title}</h2>
                <p className="text-white/50 text-sm leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>

          {whatsappUrl && (
            <div
              className="mt-10 glass rounded-2xl p-6 text-center animate-fade-in-up"
              style={{ animationDelay: '0.45s' }}
            >
              <p className="text-white/60 text-sm mb-4">Une question sur ces conditions ? Écrivez-nous directement.</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
              >
                <MessageCircle size={16} />
                Écrire sur WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
