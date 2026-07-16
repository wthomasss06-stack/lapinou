'use client'

import { useState, useMemo } from 'react'
import { formatWhatsappDisplay } from '@/lib/whatsapp'

const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP || '').replace(/\D/g, '')
const WHATSAPP_DISPLAY = formatWhatsappDisplay(process.env.NEXT_PUBLIC_WHATSAPP || '')

type FaqItem = {
  question: string
  answerHtml: string
}

type FaqCategory = {
  id: 'commande' | 'livraison' | 'paiement' | 'elevage'
  title: string
  items: FaqItem[]
}

const CATEGORIES: FaqCategory[] = [
  {
    id: 'commande',
    title: 'Commande',
    items: [
      {
        question: 'Comment passer commande chez Florence ?',
        answerHtml: `La commande se passe en 3 étapes simples :<br /><br />
          1. <strong>Choisissez</strong> votre format (unité, duo, ou lot restaurateur) sur notre site.<br />
          2. <strong>Cliquez</strong> sur le bouton WhatsApp correspondant — un message pré-rempli s'ouvre.<br />
          3. <strong>Envoyez</strong> votre message. Nous confirmons la disponibilité sous 30 minutes.<br /><br />
          Vous pouvez aussi nous écrire directement sur WhatsApp au <strong>${WHATSAPP_DISPLAY}</strong> avec la race et le format souhaité.`,
      },
      {
        question: 'Puis-je réserver un lapin sans payer immédiatement ?',
        answerHtml: `Oui. Une réservation est possible avec un acompte de <strong>30 %</strong> du montant total. Le solde est payable au retrait ou à la livraison. Sans acompte sous 24 heures, la réservation est automatiquement annulée.`,
      },
      {
        question: 'Comment savoir si un lapin est encore disponible ?',
        answerHtml: `Les stocks affichés sur le site sont mis à jour en temps réel. Un indicateur <span style="color:var(--accent-orange);font-weight:700;">"stock faible"</span> apparaît quand il reste moins de 5 unités. Pour une confirmation immédiate, envoyez-nous un message WhatsApp.`,
      },
      {
        question: 'Puis-je choisir la race et le poids exact ?',
        answerHtml: `Oui. Chaque lapin est individuellement pesé et photographié. Sur demande via WhatsApp, nous vous envoyons les photos et les poids précis des lapins disponibles pour que vous puissiez choisir.`,
      },
    ],
  },
  {
    id: 'livraison',
    title: 'Livraison & Retrait',
    items: [
      {
        question: 'Où puis-je retirer ma commande ?',
        answerHtml: `Le retrait se fait sur place à <strong>Azaguié Gare</strong>, à 30 minutes d'Abidjan. L'adresse exacte vous est communiquée par WhatsApp après confirmation de commande. Le retrait est disponible du lundi au samedi, de 8h à 18h.`,
      },
      {
        question: 'Livrez-vous à domicile à Abidjan ?',
        answerHtml: `Oui. Nous livrons dans toute la commune d'Abidjan et ses environs immédiats (Cocody, Plateau, Marcory, Yopougon, Port-Bouët, Bingerville).<br /><br />
          <strong>Frais de livraison :</strong><br />
          • Cocody, Plateau, Marcory : 2 000 FCFA<br />
          • Yopougon, Port-Bouët : 3 000 FCFA<br />
          • Bingerville, Anyama : 3 500 FCFA<br />
          • Autres zones : sur devis`,
      },
      {
        question: 'Quels sont les délais de livraison ?',
        answerHtml: `• <strong>Retrait Azaguié Gare :</strong> le jour même si commande avant 14h, sinon le lendemain.<br />
          • <strong>Livraison Abidjan :</strong> sous 24 à 48 heures selon la zone et le volume de commandes.<br />
          • <strong>Commandes restaurateur :</strong> livraison programmée sur créneau horaire convenu.`,
      },
      {
        question: 'Les lapins sont-ils transportés dans de bonnes conditions ?',
        answerHtml: `Absolument. Les lapins voyagent dans des <strong>cages ventilées</strong> avec accès à l'eau et à la nourriture. Pour les livraisons, nous utilisons des véhicules climatisés. Les lapins ne restent jamais plus de 2 heures en transport.`,
      },
    ],
  },
  {
    id: 'paiement',
    title: 'Paiement',
    items: [
      {
        question: 'Quels modes de paiement acceptez-vous ?',
        answerHtml: `Nous acceptons 4 modes de paiement :<br /><br />
          1. <strong>Espèces</strong> — au retrait à Azaguié Gare<br />
          2. <strong>Orange Money</strong> — au ${WHATSAPP_DISPLAY}<br />
          3. <strong>MTN Mobile Money</strong> — au même numéro<br />
          4. <strong>Wave</strong> — sur demande<br /><br />
          Le paiement se fait <strong>à la livraison ou au retrait</strong>. Aucun paiement en avance complet n'est exigé.`,
      },
      {
        question: 'Proposez-vous un paiement échelonné ?',
        answerHtml: `Pour les commandes <strong>restaurateur</strong> (lot de 6+), un paiement en 2 fois est possible : 50 % à la commande, 50 % à la livraison. Pour les particuliers, le paiement se fait en une seule fois.`,
      },
      {
        question: 'Y a-t-il une garantie remboursement ?',
        answerHtml: `Oui. Si un lapin livré ne correspond pas à la description (poids, race, état de santé), nous procédons au <strong>remboursement intégral sous 48 heures</strong> ou à un remplacement gratuit. La réclamation doit être faite lors de la livraison ou du retrait.`,
      },
    ],
  },
  {
    id: 'elevage',
    title: 'Élevage & Conseils',
    items: [
      {
        question: 'Quelle race de lapin choisir pour débuter ?',
        answerHtml: `Pour un débutant, nous recommandons le <strong>lapin Hollandais</strong> : rustique, facile à élever, bon reproducteur. Le <strong>Rex</strong> est idéal pour la viande (croissance rapide, bon rendement). L'<strong>Angora</strong> convient mieux pour la laine et comme animal de compagnie.`,
      },
      {
        question: 'Quel enclos faut-il pour élever des lapins ?',
        answerHtml: `Un lapin adulte nécessite minimum <strong>0,5 m²</strong>. Pour un couple reproducteur, prévoyez 1,5 m² avec séparation des cages. L'enclos doit être :<br />
          • À l'abri du vent et de la pluie<br />
          • Bien ventilé (pas d'humidité)<br />
          • Protégé des prédateurs (chiens, chats, serpents)<br />
          • Avec une zone d'ombre permanente<br /><br />
          Nous proposons des <strong>plans d'enclos gratuits</strong> sur demande WhatsApp.`,
      },
      {
        question: 'Quelle alimentation pour mes lapins ?',
        answerHtml: `L'alimentation de base comprend :<br /><br />
          • <strong>Foin</strong> (à volonté) — fibre essentielle<br />
          • <strong>Granulés</strong> (100-150g/jour par adulte)<br />
          • <strong>Légumes verts</strong> (carotte, épinard, betterave)<br />
          • <strong>Eau fraîche</strong> (renouvelée quotidiennement)<br /><br />
          <strong>À éviter :</strong> laitue, haricots crus, pain, aliments salés ou sucrés. Nous vendons des <strong>aliments complets pour lapins</strong> — demandez-nous sur WhatsApp.`,
      },
      {
        question: 'À quel âge un lapin peut-il se reproduire ?',
        answerHtml: `• <strong>Femelle :</strong> 5-6 mois (poids minimum 3 kg)<br />
          • <strong>Mâle :</strong> 6-7 mois<br />
          • <strong>Gestation :</strong> 30-32 jours<br />
          • <strong>Portée moyenne :</strong> 6-8 lapereaux<br />
          • <strong>Sevrage :</strong> 6-8 semaines<br /><br />
          Nous proposons un <strong>kit démarrage élevage</strong> (1 mâle + 3 femelles + conseils) à 120 000 FCFA.`,
      },
      {
        question: 'Comment reconnaître un lapin malade ?',
        answerHtml: `Signes d'alerte à surveiller :<br />
          • Refus de manger ou de boire<br />
          • Poil hérissé ou sale<br />
          • Écoulement nasal ou oculaire<br />
          • Diarrhée (fientes molles)<br />
          • Lethargie (lapin immobile)<br /><br />
          En cas de doute, <strong>isolez l'animal</strong> et contactez un vétérinaire. Nous proposons un <strong>suivi sanitaire gratuit</strong> pour nos clients éleveurs.`,
      },
    ],
  },
]

export default function ClientAide() {
  const [activeCat, setActiveCat] = useState<'all' | FaqCategory['id']>('all')
  const [search, setSearch] = useState('')
  const [openItems, setOpenItems] = useState<Record<string, number | null>>({})

  const term = search.trim().toLowerCase()
  const isSearching = term.length > 0

  const toggleItem = (catId: string, index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [catId]: prev[catId] === index ? null : index,
    }))
  }

  const visibleCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => isSearching || activeCat === 'all' || activeCat === cat.id)
  }, [activeCat, isSearching])

  return (
    <>
      <div className="noise-overlay" />

      <header>
        <a href="/" className="logo-area">
          <div className="logo-blob" />
          <span>Chez Florence</span>
        </a>
        <div className="nav-links">
          <a href="/#tarifs" className="nav-btn">Tarifs</a>
          <a href="/#lapins" className="nav-btn">Nos Lapins</a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="nav-btn orange">WhatsApp</a>
        </div>
      </header>

      <main>
        <div className="breadcrumb">
          <a href="/">Accueil</a> / <span>Aide &amp; Questions</span>
        </div>

        <section className="page-hero">
          <div className="eyebrow">Centre d&apos;Aide</div>
          <h1 className="page-title">Comment Pouvons-Nous Vous Aider ?</h1>
          <p className="page-sub">Trouvez rapidement les réponses à vos questions sur l&apos;achat, la livraison et l&apos;élevage de lapins à Abidjan.</p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="faq-categories">
            <button className={`cat-pill ${activeCat === 'all' ? 'active' : ''}`} onClick={() => setActiveCat('all')}>Tout</button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`cat-pill ${activeCat === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCat(cat.id)}
              >
                {cat.title === 'Livraison & Retrait' ? 'Livraison' : cat.title === 'Élevage & Conseils' ? 'Élevage' : cat.title}
              </button>
            ))}
          </div>
        </section>

        <section className="faq-section">
          {visibleCategories.map((cat) => {
            const filteredItems = cat.items
              .map((item, index) => ({ item, index }))
              .filter(({ item }) =>
                !isSearching ||
                (item.question + ' ' + item.answerHtml).toLowerCase().includes(term)
              )

            if (isSearching && filteredItems.length === 0) return null

            return (
              <div className="faq-category" key={cat.id}>
                <div className="cat-title">{cat.title}</div>
                {filteredItems.map(({ item, index }) => {
                  const isOpen = openItems[cat.id] === index
                  return (
                    <div className="faq-item" key={index}>
                      <div
                        className={`faq-question ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleItem(cat.id, index)}
                      >
                        {item.question}
                      </div>
                      <div
                        className={`faq-answer ${isOpen ? 'open' : ''}`}
                        dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </section>

        <section className="cta-section">
          <div className="cta-title">Toujours Une Question ?</div>
          <p className="cta-sub">Notre équipe répond sous 30 minutes sur WhatsApp, 7j/7.</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="cta-btn">Nous Écrire sur WhatsApp</a>
        </section>
      </main>

      <footer>
        <p>
          © 2026 Chez Florence — <a href="/">Retour à l&apos;accueil</a> —{' '}
          <a href="/confidentialite">Confidentialité</a> — <a href="/conditions">Conditions</a>
        </p>
      </footer>

      <style jsx global>{`
        :root {
            --bg-light: #f3f0ea;
            --bg-dark: #0c0906;
            --text-dark: #171310;
            --text-light: #f3f0ea;
            --accent-orange: #e8622c;
            --font-main: 'Syne', sans-serif;
            --font-pixel: 'Silkscreen', sans-serif;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0; padding: 0;
            background-color: var(--bg-light);
            color: var(--text-dark);
            font-family: var(--font-main);
            overflow-x: hidden;
            line-height: 1.6;
        }
      `}</style>
      <style jsx>{`
        .noise-overlay {
            position: fixed; top: -50%; left: -50%; width: 200%; height: 200%;
            background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
            opacity: 0.05; pointer-events: none; z-index: 9999;
            animation: noise 0.2s infinite; mix-blend-mode: difference;
        }
        @keyframes noise { 0% { transform: translate(0, 0); } 50% { transform: translate(-5%, 5%); } 100% { transform: translate(0, 0); } }

        header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 24px 50px; position: fixed; top: 0; width: 100%; z-index: 100;
            background: rgba(243, 240, 234, 0.85); backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .logo-area { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.1rem; text-transform: uppercase; text-decoration: none; color: var(--text-dark); }
        .logo-blob {
            width: 32px; height: 24px; background: var(--accent-orange);
            border-radius: 40% 60% 60% 40% / 50% 30% 70% 50%;
            animation: blobby 6s infinite ease-in-out;
        }
        @keyframes blobby {
            0%, 100% { border-radius: 40% 60% 60% 40% / 50% 30% 70% 50%; }
            50% { border-radius: 60% 40% 40% 60% / 30% 60% 40% 70%; }
        }
        .nav-links { display: flex; gap: 8px; }
        .nav-btn {
            padding: 10px 22px; border-radius: 24px; border: none;
            font-family: var(--font-main); font-size: 0.85rem; font-weight: 600;
            text-decoration: none; color: var(--text-dark); transition: 0.3s;
        }
        .nav-btn.orange { background-color: var(--accent-orange); color: var(--bg-dark); }
        .nav-btn:hover { background: rgba(0,0,0,0.06); }
        .nav-btn.orange:hover { opacity: 0.85; }

        .page-hero { padding: 140px 50px 60px; max-width: 900px; margin: 0 auto; text-align: center; }
        .eyebrow { font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; opacity: 0.5; margin-bottom: 16px; color: var(--accent-orange); }
        .page-title { font-family: var(--font-pixel); font-size: 3.5vw; font-weight: 700; text-transform: uppercase; line-height: 0.95; letter-spacing: -2px; margin-bottom: 20px; }
        .page-sub { font-size: 1.15rem; color: #776f63; max-width: 560px; margin: 0 auto 40px; }

        .search-box { max-width: 500px; margin: 0 auto 60px; position: relative; }
        .search-box input {
            width: 100%; padding: 16px 24px 16px 50px;
            border: 2px solid rgba(0,0,0,0.1); border-radius: 16px;
            font-family: var(--font-main); font-size: 1rem;
            background: white; outline: none; transition: 0.3s;
        }
        .search-box input:focus { border-color: var(--accent-orange); }
        .search-box::before {
            content: '🔍'; position: absolute; left: 18px; top: 50%;
            transform: translateY(-50%); font-size: 1.1rem;
        }

        .faq-categories { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 50px; }
        .cat-pill {
            padding: 10px 22px; border-radius: 30px; border: 1px solid rgba(0,0,0,0.15);
            background: white; font-family: var(--font-main);
            font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.3s;
        }
        .cat-pill:hover, .cat-pill.active { background: var(--accent-orange); color: white; border-color: var(--accent-orange); }

        .faq-section { max-width: 800px; margin: 0 auto; padding: 0 24px 100px; }
        .faq-category { margin-bottom: 50px; }
        .cat-title { font-family: var(--font-pixel); font-size: 1.3rem; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 2px solid var(--accent-orange); display: inline-block; }
        .faq-item { border-bottom: 1px solid rgba(0,0,0,0.08); padding: 24px 0; }
        .faq-question { font-weight: 700; font-size: 1.05rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.3s; }
        .faq-question:hover { color: var(--accent-orange); }
        .faq-question::after { content: '+'; font-family: var(--font-pixel); color: var(--accent-orange); font-size: 1.2rem; transition: 0.3s; }
        .faq-question.active::after { content: '−'; }
        .faq-answer { font-size: 0.95rem; line-height: 1.7; color: #776f63; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease; }
        .faq-answer.open { max-height: 400px; padding-top: 16px; }

        .cta-section { background: var(--bg-dark); color: var(--text-light); padding: 80px 50px; text-align: center; }
        .cta-title { font-family: var(--font-pixel); font-size: 2.5rem; margin-bottom: 16px; text-transform: uppercase; }
        .cta-sub { opacity: 0.6; margin-bottom: 30px; }
        .cta-btn {
            display: inline-block; padding: 16px 40px; background: var(--accent-orange); color: var(--bg-dark);
            text-decoration: none; font-weight: 800; text-transform: uppercase; border-radius: 12px;
            font-size: 0.9rem; letter-spacing: 1px; transition: 0.3s;
        }
        .cta-btn:hover { transform: translateY(-3px); }

        footer { padding: 40px 50px; text-align: center; border-top: 1px solid rgba(0,0,0,0.08); font-size: 0.85rem; color: #999; }
        footer :global(a) { color: var(--text-dark); text-decoration: none; font-weight: 600; }
        footer :global(a:hover) { color: var(--accent-orange); }

        .breadcrumb { max-width: 900px; margin: 0 auto; padding: 0 24px 20px; font-size: 0.8rem; color: #999; }
        .breadcrumb :global(a) { color: var(--accent-orange); text-decoration: none; }
        .breadcrumb :global(a:hover) { text-decoration: underline; }

        @media (max-width: 768px) {
            header { padding: 16px 20px; }
            .nav-links { display: none; }
            .page-hero { padding: 120px 20px 40px; }
            .page-title { font-size: 8vw; }
            .faq-section { padding: 0 20px 60px; }
            .cta-section { padding: 60px 20px; }
            .cta-title { font-size: 1.6rem; }
        }
      `}</style>
    </>
  )
}
