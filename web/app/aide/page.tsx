'use client'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/Footer'
import RainbowText from '@/components/RainbowText'
import './aide.css'

const CATEGORIES = ['Tout', 'Commande', 'Livraison', 'Paiement', 'Élevage'] as const

const FAQS: { category: Exclude<typeof CATEGORIES[number], 'Tout'>; q: string; a: string }[] = [
  { category: 'Commande', q: 'Comment passer commande chez Florence ?', a: "La commande se passe en 3 étapes simples : 1. Choisissez votre format (unité, duo, ou lot restaurateur) sur notre site. 2. Cliquez sur le bouton WhatsApp correspondant — un message pré-rempli s'ouvre. 3. Envoyez votre message. Nous confirmons la disponibilité sous 30 minutes. Vous pouvez aussi nous écrire directement sur WhatsApp avec la race et le format souhaité." },
  { category: 'Commande', q: 'Puis-je réserver un lapin sans payer immédiatement ?', a: 'Oui. Une réservation est possible avec un acompte de 30 % du montant total. Le solde est payable au retrait ou à la livraison. Sans acompte sous 24 heures, la réservation est automatiquement annulée.' },
  { category: 'Commande', q: 'Comment savoir si un lapin est encore disponible ?', a: 'Les stocks affichés sur le site sont mis à jour en temps réel. Un indicateur "stock faible" apparaît quand il reste moins de 5 unités. Pour une confirmation immédiate, envoyez-nous un message WhatsApp.' },
  { category: 'Commande', q: 'Puis-je choisir la race et le poids exact ?', a: 'Oui. Chaque lapin est individuellement pesé et photographié. Sur demande via WhatsApp, nous vous envoyons les photos et les poids précis des lapins disponibles pour que vous puissiez choisir.' },
  { category: 'Livraison', q: 'Où puis-je retirer ma commande ?', a: "Le retrait se fait sur place à Azaguié Gare, à 30 minutes d'Abidjan. L'adresse exacte vous est communiquée par WhatsApp après confirmation de commande. Le retrait est disponible du lundi au samedi, de 8h à 18h." },
  { category: 'Livraison', q: 'Livrez-vous à domicile à Abidjan ?', a: "Oui. Nous livrons dans toute la commune d'Abidjan et ses environs immédiats (Cocody, Plateau, Marcory, Yopougon, Port-Bouët, Bingerville, Anyama). Frais : Cocody/Plateau/Marcory 2 000 FCFA, Yopougon/Port-Bouët 3 000 FCFA, Bingerville/Anyama 3 500 FCFA, autres zones sur devis." },
  { category: 'Livraison', q: 'Quels sont les délais de livraison ?', a: 'Retrait Azaguié Gare : le jour même si commande avant 14h, sinon le lendemain. Livraison Abidjan : sous 24 à 48 heures selon la zone et le volume de commandes. Commandes restaurateur : livraison programmée sur créneau horaire convenu.' },
  { category: 'Livraison', q: 'Les lapins sont-ils transportés dans de bonnes conditions ?', a: "Absolument. Les lapins voyagent dans des cages ventilées avec accès à l'eau et à la nourriture. Pour les livraisons, nous utilisons des véhicules climatisés. Les lapins ne restent jamais plus de 2 heures en transport." },
  { category: 'Paiement', q: 'Quels modes de paiement acceptez-vous ?', a: "Nous acceptons 4 modes de paiement : espèces (au retrait à Azaguié Gare), Orange Money, MTN Mobile Money, et Wave sur demande. Le paiement se fait à la livraison ou au retrait — aucun paiement en avance complet n'est exigé." },
  { category: 'Paiement', q: 'Proposez-vous un paiement échelonné ?', a: 'Pour les commandes restaurateur (lot de 6+), un paiement en 2 fois est possible : 50 % à la commande, 50 % à la livraison. Pour les particuliers, le paiement se fait en une seule fois.' },
  { category: 'Paiement', q: 'Y a-t-il une garantie remboursement ?', a: 'Oui. Si un lapin livré ne correspond pas à la description (poids, race, état de santé), nous procédons au remboursement intégral sous 48 heures ou à un remplacement gratuit. La réclamation doit être faite lors de la livraison ou du retrait.' },
  { category: 'Élevage', q: 'Quelle race de lapin choisir pour débuter ?', a: "Pour un débutant, nous recommandons le lapin Hollandais : rustique, facile à élever, bon reproducteur. Le Rex est idéal pour la viande (croissance rapide, bon rendement). L'Angora convient mieux pour la laine et comme animal de compagnie." },
  { category: 'Élevage', q: 'Quel enclos faut-il pour élever des lapins ?', a: "Un lapin adulte nécessite minimum 0,5 m². Pour un couple reproducteur, prévoyez 1,5 m² avec séparation des cages. L'enclos doit être à l'abri du vent et de la pluie, bien ventilé, protégé des prédateurs, avec une zone d'ombre permanente. Plans d'enclos gratuits sur demande WhatsApp." },
  { category: 'Élevage', q: 'Quelle alimentation pour mes lapins ?', a: "L'alimentation de base : foin à volonté (fibre essentielle), granulés (100-150g/jour par adulte), légumes verts (carotte, épinard, betterave), eau fraîche renouvelée quotidiennement. À éviter : laitue, haricots crus, pain, aliments salés ou sucrés. Nous vendons des aliments complets — demandez-nous sur WhatsApp." },
  { category: 'Élevage', q: 'À quel âge un lapin peut-il se reproduire ?', a: 'Femelle : 5-6 mois (poids minimum 3 kg). Mâle : 6-7 mois. Gestation : 30-32 jours. Portée moyenne : 6-8 lapereaux. Sevrage : 6-8 semaines. Nous proposons un kit démarrage élevage (1 mâle + 3 femelles + conseils) à 120 000 FCFA.' },
  { category: 'Élevage', q: 'Comment reconnaître un lapin malade ?', a: "Signes d'alerte à surveiller : refus de manger ou de boire, poil hérissé ou sale, écoulement nasal ou oculaire, diarrhée, léthargie. En cas de doute, isolez l'animal et contactez un vétérinaire. Nous proposons un suivi sanitaire gratuit pour nos clients éleveurs." },
]

export default function AidePage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Tout')
  const [openKey, setOpenKey] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.filter((f) => {
      const matchesCategory = category === 'Tout' || f.category === category
      const matchesQuery = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof FAQS>()
    for (const item of filtered) {
      if (!map.has(item.category)) map.set(item.category, [])
      map.get(item.category)!.push(item)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <div className="aide-page">
      <Navbar />
      <CustomCursor />
      <main>
        <section className="page-hero">
          <div className="eyebrow">Centre d&apos;Aide</div>
          <h1 className="page-title">Comment Pouvons-Nous Vous Aider ?</h1>
          <RainbowText
            text="Trouvez rapidement les réponses à vos questions sur l'achat, la livraison et l'élevage de lapins à Abidjan."
            variant="white"
            className="page-sub"
          />

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="faq-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cat-pill${category === cat ? ' active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="faq-section">
          {grouped.length === 0 ? (
            <p className="no-results">Aucune question ne correspond à votre recherche.</p>
          ) : (
            grouped.map(([cat, items]) => (
              <div className="faq-category" key={cat}>
                <h2 className="cat-title">{cat}</h2>
                {items.map((item) => {
                  const key = `${item.category}-${item.q}`
                  const isOpen = openKey === key
                  return (
                    <div className="faq-item" key={key}>
                      <button
                        type="button"
                        className={`faq-question${isOpen ? ' active' : ''}`}
                        onClick={() => setOpenKey(isOpen ? null : key)}
                        aria-expanded={isOpen}
                      >
                        {item.q}
                        <span className="faq-icon">{isOpen ? '\u2212' : '+'}</span>
                      </button>
                      <div className={`faq-answer${isOpen ? ' open' : ''}`}>{item.a}</div>
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
