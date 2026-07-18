import Navbar from '@/components/Navbar'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/Footer'
import RainbowText from '@/components/RainbowText'
import { LegalToc, LegalSectionBlock, type LegalSection } from '@/components/LegalBlocks'
import '@/components/LegalPage.css'

export const metadata = {
  title: 'Conditions Générales de Vente — Chez Florence | CGV Achat Lapin Abidjan',
  description: "Conditions générales de vente de Chez Florence. Paiement, livraison, garantie santé, retour et remboursement pour l'achat de lapins à Abidjan, Côte d'Ivoire.",
}

const SECTIONS: LegalSection[] = [
  {
    num: 1, id: 'art1', title: "Champ d'Application",
    body: [
      "Les présentes Conditions Générales de Vente (CGV) s'appliquent à toute commande de lapins vivants passée auprès de Chez Florence, élevage artisanal situé à Abidjan, Côte d'Ivoire.",
      "Elles constituent le contrat unique entre Chez Florence et le client, et prévalent sur tout autre document. Toute commande implique l'acceptation pleine et entière des présentes CGV.",
    ],
    note: { icon: 'warning', text: "L'achat de lapins vivants est soumis à des réglementations spécifiques. Le client s'engage à respecter la législation ivoirienne relative à la protection animale et à l'élevage." },
  },
  {
    num: 2, id: 'art2', title: 'Produits et Caractéristiques',
    body: ['Chez Florence propose la vente de lapins de race vivants, dans les catégories suivantes :'],
    items: ['Lapin Hollandais — poids moyen 1,2 à 1,8 kg', 'Angora Français — poids moyen 1,5 à 2,2 kg', 'Rex — poids moyen 1,8 à 2,5 kg'],
    subs: [{ title: '', body: [
      'Les caractéristiques annoncées (poids, race, sexe, couleur) sont indicatives et peuvent varier légèrement. Chaque lapin est pesé individuellement avant la vente. Le poids réel est communiqué au client lors de la confirmation de commande.',
      "Les photographies présentées sur le site sont données à titre illustratif. L'apparence exacte du lapin (nuances de pelage, marques) peut différer.",
    ] }],
  },
  {
    num: 3, id: 'art3', title: 'Prix et Paiement',
    body: ['Les prix sont exprimés en Francs CFA (FCFA) et sont fermes au moment de la commande. Ils ne comprennent pas les frais de livraison, qui sont facturés en supplément selon la zone.'],
    subs: [
      { title: '3.1 Tarifs en vigueur', table: { headers: ['Format', 'Prix TTC'], rows: [
        ["À l'unité (environ 2 kg)", '15 000 FCFA'],
        ['Le Duo (2 lapins, 1,6 kg chacun)', '25 000 FCFA'],
        ['Format Restaurateur (lot de 6)', '80 000 FCFA'],
      ] } },
      { title: '3.2 Modes de paiement acceptés', items: ['Espèces — au retrait à Azaguié Gare', 'Orange Money', 'MTN Mobile Money', 'Wave (sur demande)'] },
      { title: '3.3 Conditions de paiement', body: [
        'Pour les commandes particuliers : paiement intégral au retrait ou à la livraison.',
        'Pour les commandes restaurateur (lot de 6+) : acompte de 30 % à la réservation, solde à la livraison.',
        'Pour les réservations : acompte de 30 % exigé. Sans paiement sous 24 heures, la réservation est annulée et le lapin remis en vente.',
      ] },
    ],
  },
  {
    num: 4, id: 'art4', title: 'Commande et Réservation',
    body: ['La commande s\u2019effectue exclusivement via WhatsApp au +225 01 42 50 77 50 ou par clic sur les boutons de commande du site.'],
    subs: [
      { title: '4.1 Processus de commande', ordered: true, items: [
        'Le client choisit son format (unité, duo, lot) et éventuellement la race',
        'Le client envoie sa demande via WhatsApp',
        'Chez Florence confirme la disponibilité sous 30 minutes (horaires d\u2019ouverture)',
        'Le client valide la commande et procède au paiement (ou acompte)',
        'Chez Florence prépare la commande et confirme le retrait ou la livraison',
      ] },
      { title: '4.2 Réservation', body: [
        'Une réservation est possible avec un acompte de 30 %. Elle est valable 24 heures. Passé ce délai sans paiement de l\u2019acompte, la réservation est automatiquement annulée.',
        'Le client peut annuler sa réservation sans frais dans les 6 heures suivant la confirmation. Au-delà, l\u2019acompte n\u2019est pas remboursé.',
      ] },
    ],
  },
  {
    num: 5, id: 'art5', title: 'Livraison et Retrait',
    subs: [
      { title: '5.1 Retrait sur place', body: [
        'Le retrait des commandes s\u2019effectue à Azaguié Gare, à 30 minutes d\u2019Abidjan. L\u2019adresse exacte est communiquée par WhatsApp après confirmation de la commande.',
        'Les horaires de retrait sont du lundi au samedi, de 8h à 18h. Tout retrait en dehors de ces horaires doit être convenu préalablement.',
      ] },
      { title: '5.2 Livraison à domicile', body: [
        'Chez Florence assure la livraison dans la commune d\u2019Abidjan et ses environs immédiats (Cocody, Plateau, Marcory, Yopougon, Port-Bouët, Bingerville, Anyama).',
        'Les frais de livraison varient selon la zone :',
      ], items: ['Cocody, Plateau, Marcory : 2 000 FCFA', 'Yopougon, Port-Bouët : 3 000 FCFA', 'Bingerville, Anyama : 3 500 FCFA', 'Autres zones : sur devis'] },
      { title: '5.3 Délais de livraison', body: [
        'Retrait Azaguié Gare : le jour même si commande avant 14h, sinon le lendemain.',
        'Livraison Abidjan : sous 24 à 48 heures selon la zone et le volume de commandes.',
        'Commandes restaurateur : livraison programmée sur créneau horaire convenu.',
      ] },
      { title: '5.4 Conditions de transport', body: [
        'Les lapins voyagent dans des cages ventilées avec accès à l\u2019eau et à la nourriture. Pour les livraisons, nous utilisons des véhicules climatisés. Les lapins ne restent jamais plus de 2 heures en transport.',
        'Le client doit vérifier l\u2019état des animaux à la livraison ou au retrait. Toute réclamation doit être faite sur place. Passé le départ du lieu de livraison ou de retrait, Chez Florence ne pourra être tenu responsable des dommages subis par les animaux.',
      ], note: { icon: 'warning', text: 'En cas d\u2019absence du client au rendez-vous de livraison convenu, les frais de transport d\u2019une nouvelle livraison sont à la charge du client.' } },
    ],
  },
  {
    num: 6, id: 'art6', title: 'Garantie Santé',
    subs: [
      { title: '6.1 État sanitaire à la livraison', body: ['Tous les lapins vendus par Chez Florence sont en bonne santé apparente au moment de la vente. Ils sont vaccinés et vermifugés selon un protocole sanitaire strict. Un certificat sanitaire peut être fourni sur demande.'] },
      { title: '6.2 Garantie de 48 heures', body: ['Chez Florence offre une garantie de 48 heures à compter de la livraison ou du retrait. Si le lapin présente des signes de maladie ou décède dans ce délai, et que cela est dû à un problème préexistant à la vente, le client peut choisir entre :'], items: ['Le remplacement gratuit du lapin par un animal de même race et valeur', 'Le remboursement intégral du montant payé'] },
      { title: '6.3 Conditions de la garantie', body: ['La garantie s\u2019applique sous réserve que :'], ordered: true, items: [
        'Le client ait signalé le problème par WhatsApp dans les 48 heures suivant la livraison',
        'Le lapin ait été conservé dans des conditions d\u2019élevage correctes (abri, alimentation, eau)',
        'Le décès ou la maladie ne soit pas dû à une négligence, maltraitance ou erreur d\u2019élevage du client',
      ], note: { icon: 'tip', text: 'Pour activer la garantie, contactez-nous immédiatement sur WhatsApp au +225 01 42 50 77 50 avec des photos et une description des symptômes.' } },
    ],
  },
  {
    num: 7, id: 'art7', title: 'Droit de Rétractation',
    subs: [
      { title: '7.1 Rétractation avant livraison', body: ['Le client peut annuler sa commande sans frais tant que la commande n\u2019a pas été préparée ou expédiée. Pour les commandes avec acompte, l\u2019acompte est remboursé intégralement.'] },
      { title: '7.2 Rétractation après livraison', body: [
        'Conformément à la législation ivoirienne et compte tenu de la nature vivante des produits, le droit de rétractation après livraison est limité. Le client dispose d\u2019un délai de 24 heures après réception pour signaler une non-conformité majeure (race, poids, état de santé).',
        'Passé ce délai, aucun retour ni remboursement ne pourra être exigé, sauf application de la garantie santé (Article 6).',
      ] },
      { title: '7.3 Retour des animaux', body: ['En cas de rétractation validée, le retour du lapin s\u2019effectue aux frais de Chez Florence si la non-conformité est avérée. Si le retour est motivé par un changement d\u2019avis du client, les frais de transport sont à sa charge.'] },
    ],
  },
  {
    num: 8, id: 'art8', title: 'Responsabilité',
    subs: [
      { title: '8.1 Responsabilité de Chez Florence', body: ['Chez Florence s\u2019engage à fournir des lapins sains, conformes à la description, et à assurer un service de qualité. Sa responsabilité ne saurait être engagée pour :'], items: [
        'Les dommages résultant d\u2019une négligence, d\u2019une erreur d\u2019élevage ou d\u2019une maltraitance du client après la livraison',
        'Les pertes économiques indirectes (perte de revenus, manque à gagner, etc.)',
        'Les cas de force majeure (intempéries, accidents de transport indépendants de notre volonté, etc.)',
      ] },
      { title: '8.2 Obligations du client', body: ['Le client s\u2019engage à :'], items: [
        'Fournir des informations exactes (adresse, contact)',
        'Respecter les conditions de paiement convenues',
        'Être présent au rendez-vous de livraison ou de retrait',
        'Conserver les animaux dans des conditions d\u2019hygiène et de bien-être appropriées',
      ] },
      { title: '8.3 Limitation de responsabilité', body: ['Le montant total de la responsabilité de Chez Florence, en cas de manquement avéré, est limité au montant total de la commande concernée.'] },
    ],
  },
  {
    num: 9, id: 'art9', title: 'Propriété Intellectuelle',
    body: [
      "L'ensemble des éléments du site chezflorence.ci (textes, images, photographies, logos, design, code) est la propriété exclusive de Chez Florence ou de ses partenaires. Toute reproduction, représentation, modification, publication, adaptation ou exploitation, totale ou partielle, est strictement interdite sans autorisation écrite préalable.",
      'Les photographies de lapins présentées sur le site sont protégées. Toute utilisation à des fins commerciales ou promotionnelles par des tiers est interdite.',
      'Les marques, logos et signes distinctifs figurant sur le site sont des marques déposées. Toute reproduction ou utilisation non autorisée constitue une contrefaçon sanctionnée par la législation ivoirienne.',
    ],
  },
  {
    num: 10, id: 'art10', title: 'Litiges et Droit Applicable',
    subs: [
      { title: '10.1 Droit applicable', body: ['Les présentes CGV sont régies par le droit ivoirien. En cas de litige, les parties s\u2019engagent à rechercher une solution amiable avant toute action judiciaire.'] },
      { title: '10.2 Médiation', body: ['En cas de désaccord, le client peut contacter Chez Florence par WhatsApp ou email pour tenter de résoudre le différend à l\u2019amiable. Chez Florence s\u2019engage à répondre sous 72 heures ouvrées.'] },
      { title: '10.3 Juridiction compétente', body: ['À défaut de résolution amiable, tout litige relatif à la formation, l\u2019exécution ou l\u2019interprétation des présentes CGV sera soumis aux juridictions compétentes du tribunal d\u2019Abidjan, Côte d\u2019Ivoire.'] },
      { title: '10.4 Modification des CGV', body: ['Chez Florence se réserve le droit de modifier les présentes CGV à tout moment. Les modifications seront publiées sur cette page avec la date de mise à jour. Les commandes passées avant la modification restent soumises aux CGV en vigueur au moment de la commande.'] },
    ],
    note: { icon: 'mail', text: 'Pour toute question relative aux présentes conditions, contactez-nous sur WhatsApp au +225 01 42 50 77 50 ou par email à wthomasss06@gmail.com.' },
  },
]

export default function ConditionsPage() {
  return (
    <div className="legal-page">
      <Navbar />
      <CustomCursor />
      <main>
        <div className="breadcrumb"><a href="/">Accueil</a> / <span>Conditions Générales</span></div>
        <section className="page-hero">
          <div className="eyebrow">Cadre Juridique</div>
          <h1 className="page-title">Conditions Générales de Vente</h1>
          <RainbowText
            text="Les présentes conditions régissent toute commande de lapins effectuée auprès de Chez Florence. En passant commande, vous acceptez l'intégralité de ces conditions."
            variant="white"
            className="page-sub"
          />
          <p className="last-update">En vigueur depuis le 12 juillet 2026</p>
        </section>
        <div className="legal-content">
          <LegalToc sections={SECTIONS} />
          {SECTIONS.map((s) => <LegalSectionBlock section={s} key={s.id} />)}
        </div>
      </main>
      <Footer />
    </div>
  )
}
