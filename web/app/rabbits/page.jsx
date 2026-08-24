import Link from 'next/link'
import LapinsFeaturedSection from '@/components/LapinsFeaturedSection'
import SearchBar from '@/components/SearchBar'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import { SITE_URL, jsonLdScript, getBreadcrumbJsonLd } from '@/lib/seo'

export const metadata = {
  title: 'Nos lapins de race — CHEZ FLORENCE à Azaguié',
  description: 'Découvrez les lapins de race disponibles chez CHEZ FLORENCE à Azaguié Gare : Hollandais, Rex et Angora Français.',
  alternates: { canonical: '/rabbits' },
  openGraph: {
    title: 'Nos lapins de race — CHEZ FLORENCE à Azaguié',
    description: 'Catalogue des lapins de race disponibles à Azaguié Gare, avec réservation par WhatsApp.',
    url: `${SITE_URL}/rabbits`,
    type: 'website',
  },
}

export default function RabbitsPage({ searchParams = {} }) {
  const filters = {}
  if (searchParams.search) filters.search = String(searchParams.search)
  if (searchParams.breed) filters.breed = String(searchParams.breed)

  const breadcrumb = getBreadcrumbJsonLd([
    { name: 'Accueil', path: '/' },
    { name: 'Nos Lapins', path: '/rabbits' },
  ])

  return (
    <main className="overflow-x-hidden">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      <section className="px-6 pt-32 pb-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">Catalogue CHEZ FLORENCE</p>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white max-w-3xl">Nos lapins de race à Azaguié</h1>
          <p className="text-white/55 max-w-2xl mt-5 leading-relaxed">Parcourez les lapins disponibles à l’élevage, consultez leur race et leur poids, puis réservez directement par WhatsApp.</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="/tarifs" className="btn-neon px-5 py-3 rounded-xl text-sm">Voir les tarifs</Link>
            <Link href="/contact" className="btn-outline px-5 py-3 rounded-xl text-sm">Nous contacter</Link>
          </div>
        </div>
      </section>
      <SearchBar />
      <LapinsFeaturedSection filters={filters} />
      <Footer />
      <CustomCursor />
    </main>
  )
}
