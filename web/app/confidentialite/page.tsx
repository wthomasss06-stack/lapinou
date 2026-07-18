import Navbar from '@/components/Navbar'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/Footer'
import RainbowText from '@/components/RainbowText'
import { LegalSectionBlock, type LegalSection } from '@/components/LegalBlocks'
import '@/components/LegalPage.css'

export const metadata = {
  title: 'Politique de Confidentialité — Chez Florence',
  description: "Politique de confidentialité de Chez Florence : données collectées, durée de conservation, cookies et vos droits.",
}

const SECTIONS: LegalSection[] = [
  {
    title: '1. Qui Sommes-Nous ?',
    body: [
      "Chez Florence est un élevage artisanal de lapins basé à Abidjan, Côte d'Ivoire. Nous vendons des lapins de race (Hollandais, Angora, Rex) à des particuliers, restaurateurs et éleveurs.",
      'Responsable du traitement : Chez Florence, Abidjan, Côte d\u2019Ivoire.',
      'Contact DPO : wthomasss06@gmail.com ou WhatsApp +225 01 42 50 77 50.',
    ],
  },
  {
    title: '2. Données Collectées',
    body: ['Nous collectons uniquement les données nécessaires à votre commande :'],
    items: [
      'Identité — nom et prénom (pour la livraison)',
      'Contact — numéro WhatsApp, email (optionnel)',
      'Adresse — zone de livraison ou point de retrait',
      'Commande — race, quantité, format choisi',
      'Paiement — historique des transactions (Mobile Money)',
    ],
    note: { icon: 'warning', text: 'Nous ne collectons jamais : numéro de carte bancaire, données biométriques, localisation GPS précise, ou informations sur vos proches.' },
  },
  {
    title: '3. Finalités du Traitement',
    body: ['Vos données sont utilisées pour :'],
    items: [
      'Traiter votre commande — confirmation, préparation, livraison',
      'Vous contacter — via WhatsApp ou email sur votre commande',
      'Assurer le suivi après-vente — conseils d\u2019élevage, garantie',
      'Améliorer nos services — analyse anonymisée des préférences clients',
      'Obligations légales — facturation, comptabilité',
    ],
  },
  {
    title: '4. Base Légale du Traitement',
    body: ['Conformément à la législation ivoirienne et aux standards internationaux, nous traitons vos données sur les bases suivantes :'],
    items: [
      'Exécution du contrat — votre commande constitue un contrat de vente',
      'Consentement — pour l\u2019envoi d\u2019offres promotionnelles (désinscription possible à tout moment)',
      'Obligation légale — conservation comptable',
      'Intérêt légitime — amélioration de nos services',
    ],
  },
  {
    title: '5. Durée de Conservation',
    subs: [{
      title: '',
      table: {
        headers: ['Type de donnée', 'Durée'],
        rows: [
          ['Données de commande', '3 ans après dernière commande'],
          ['Conversations WhatsApp', '1 an (puis archivage anonymisé)'],
          ['Factures', '10 ans (obligation légale)'],
          ['Données marketing', 'Jusqu\u2019à désinscription'],
        ],
      },
    }],
  },
  {
    title: '6. Partage des Données',
    body: ['Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :'],
    items: [
      'Prestataires de livraison — uniquement nom, téléphone et adresse de livraison',
      'Opérateurs Mobile Money — pour le traitement du paiement',
      'Autorités compétentes — en cas de réquisition légale',
    ],
    subs: [{ title: '', body: ['Tous nos prestataires sont soumis à des clauses de confidentialité strictes.'] }],
  },
  {
    title: '7. Sécurité des Données',
    body: ['Nous mettons en œuvre les mesures suivantes :'],
    items: [
      'Conversations WhatsApp chiffrées de bout en bout (par Meta)',
      'Accès aux données restreint (seul le responsable traite les commandes)',
      'Smartphone professionnel dédié avec authentification biométrique',
      'Pas de stockage cloud — données conservées localement',
      'Mise à jour régulière des applications de sécurité',
    ],
  },
  {
    title: '8. Vos Droits',
    body: ['Conformément à la législation, vous disposez des droits suivants :'],
    items: [
      'Droit d\u2019accès — obtenir une copie de vos données',
      'Droit de rectification — corriger des informations inexactes',
      'Droit à l\u2019effacement — demander la suppression de vos données',
      'Droit d\u2019opposition — refuser les communications marketing',
      'Droit à la portabilité — récupérer vos données dans un format lisible',
    ],
    note: { icon: 'mail', text: 'Pour exercer vos droits, contactez-nous par email à wthomasss06@gmail.com ou par WhatsApp. Nous répondons sous 72 heures.' },
  },
  {
    title: '9. Cookies & Traçage',
    body: ['Notre site utilise :'],
    items: [
      'Aucun cookie tiers (pas de Google Analytics, pas de Facebook Pixel)',
      'Cookies techniques — mémorisation du thème clair/sombre (durée : session)',
      'Liens WhatsApp — redirigent vers l\u2019application WhatsApp (traitement par Meta)',
    ],
    subs: [{ title: '', body: ['Aucun profilage publicitaire n\u2019est réalisé.'] }],
  },
  {
    title: '10. Modifications',
    body: ['Cette politique peut être mise à jour. Les modifications seront publiées sur cette page avec la date de mise à jour. En cas de changement substantiel, nous vous en informerons par WhatsApp ou email.'],
  },
]

export default function ConfidentialitePage() {
  return (
    <div className="legal-page">
      <Navbar />
      <CustomCursor />
      <main>
        <div className="breadcrumb"><a href="/">Accueil</a> / <span>Confidentialité</span></div>
        <section className="page-hero">
          <div className="eyebrow">Protection de vos données</div>
          <h1 className="page-title">Politique de Confidentialité</h1>
          <RainbowText
            text="Chez Florence s'engage à protéger vos informations personnelles. Transparence, sécurité et contrôle : voici comment nous traitons vos données."
            variant="white"
            className="page-sub"
          />
          <p className="last-update">Dernière mise à jour : 12 juillet 2026</p>
        </section>
        <div className="legal-content">
          {SECTIONS.map((s) => <LegalSectionBlock section={s} key={s.title} />)}

          <div className="contact-highlight">
            <h3>Une Question Sur Vos Données ?</h3>
            <p>Contactez notre responsable de la protection des données :</p>
            <p style={{ marginTop: '12px' }}>
              <a href="mailto:wthomasss06@gmail.com">wthomasss06@gmail.com</a>
              <br />
              <a href="https://wa.me/2250142507750" target="_blank" rel="noopener noreferrer">+225 01 42 50 77 50</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
