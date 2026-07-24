// web/app/sitemap.ts
// Convention Next.js App Router — auto-servi sur /sitemap.xml.
// /about, /contact et /rabbits sont volontairement exclus : ce sont des
// redirections vers des ancres de la home (voir leurs fichiers page.jsx),
// pas des URLs canoniques à faire indexer séparément.
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

async function getRabbitRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/rabbits`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    const rabbits = data.results || data || []

    return rabbits
      .filter((r: any) => r?.slug)
      .map((r: any) => ({
        url: `${SITE_URL}/rabbits/${r.slug}`,
        lastModified: r.updatedAt ? new Date(r.updatedAt) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))
  } catch {
    // Backend Express injoignable au moment de la génération — le sitemap
    // se limite alors aux pages statiques plutôt que de faire échouer le build.
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/aide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/conditions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/confidentialite`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  const rabbitRoutes = await getRabbitRoutes()

  return [...staticRoutes, ...rabbitRoutes]
}
