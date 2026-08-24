import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import TarifsSection from '@/components/TarifsSection'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import { SITE_URL, jsonLdScript, getBreadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Tarifs des lapins de race — CHEZ FLORENCE à Azaguié',
  description: 'Consultez les tarifs des lapins de race CHEZ FLORENCE à Azaguié Gare : à l’unité, en duo ou en format restaurateur.',
  alternates: { canonical: '/tarifs' },
  openGraph: {
    title: 'Tarifs des lapins — CHEZ FLORENCE à Azaguié',
    description: 'Tarifs à l’unité, en duo et pour les professionnels, avec retrait à Azaguié Gare ou livraison selon la zone.',
    url: `${SITE_URL}/tarifs`,
    type: 'website',
  },
}

export default function TarifsPage() {
  const breadcrumb = getBreadcrumbJsonLd([
    { name: 'Accueil', path: '/' },
    { name: 'Tarifs', path: '/tarifs' },
  ])

  return (
    <main className="overflow-x-hidden">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      <div className="pt-20">
        <TarifsSection />
      </div>
      <section className="px-6 py-16" aria-label="Affiche de la grille tarifaire">
        <div className="max-w-3xl mx-auto">
          <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">À partager</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-6">La grille tarifaire CHEZ FLORENCE</h2>
          <Image
            src="/affiche-grille-tarifaire-chez-florence.png"
            alt="Grille tarifaire CHEZ FLORENCE : à l’unité, duo et format restaurateur à Azaguié"
            width={1664}
            height={2080}
            sizes="(max-width: 768px) 100vw, 48rem"
            className="w-full h-auto rounded-2xl border border-[rgba(243,233,218,0.18)] shadow-2xl"
          />
        </div>
      </section>
      <section className="px-6 pb-24" aria-label="Liens de commande">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">
          <Link href="/rabbits" className="glass rounded-2xl p-5 text-white hover:text-caramel transition-colors">
            <span className="block text-xs font-mono uppercase tracking-widest text-caramel mb-2">Disponibilités</span>
            Voir les lapins disponibles
          </Link>
          <Link href="/contact" className="glass rounded-2xl p-5 text-white hover:text-caramel transition-colors">
            <span className="block text-xs font-mono uppercase tracking-widest text-caramel mb-2">Réservation</span>
            Commander par WhatsApp
          </Link>
        </div>
      </section>
      <Footer />
      <CustomCursor />
    </main>
  )
}
