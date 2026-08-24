import type { Metadata } from 'next'
import Link from 'next/link'
import AboutSection from '@/components/AboutSection'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import { SITE_URL, jsonLdScript, getBreadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'À propos de CHEZ FLORENCE — Élevage à Azaguié',
  description: "Découvrez l'histoire, les valeurs et le suivi de CHEZ FLORENCE, élevage artisanal de lapins de race à Azaguié Gare.",
  alternates: { canonical: '/a-propos' },
  openGraph: {
    title: 'À propos de CHEZ FLORENCE — Azaguié',
    description: "L'histoire et les valeurs de l'élevage CHEZ FLORENCE à Azaguié Gare.",
    url: `${SITE_URL}/a-propos`,
    type: 'website',
  },
}

export default function AProposPage() {
  const breadcrumb = getBreadcrumbJsonLd([
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/a-propos' },
  ])

  return (
    <main className="overflow-x-hidden">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      <div className="pt-20">
        <AboutSection />
      </div>
      <section className="px-6 pb-24" aria-label="Découvrir CHEZ FLORENCE">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
          <Link href="/rabbits" className="glass rounded-2xl p-5 text-white hover:text-caramel transition-colors">
            <span className="block text-xs font-mono uppercase tracking-widest text-caramel mb-2">Catalogue</span>
            Découvrir nos lapins
          </Link>
          <Link href="/tarifs" className="glass rounded-2xl p-5 text-white hover:text-caramel transition-colors">
            <span className="block text-xs font-mono uppercase tracking-widest text-caramel mb-2">Tarifs</span>
            Choisir votre format
          </Link>
          <Link href="/contact" className="glass rounded-2xl p-5 text-white hover:text-caramel transition-colors">
            <span className="block text-xs font-mono uppercase tracking-widest text-caramel mb-2">Contact</span>
            Commander sur WhatsApp
          </Link>
        </div>
      </section>
      <Footer />
      <CustomCursor />
    </main>
  )
}
