import type { Metadata, Viewport } from 'next'
import { Syne, Space_Grotesk, JetBrains_Mono, Silkscreen } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import CookieBanner from '@/components/CookieBanner'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, jsonLdScript, getOrganizationJsonLd, getWebsiteJsonLd } from '@/lib/seo'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
})

// Accent "pixel" réservé aux moments d'affichage géants (titre du Hero,
// gros lettrage). Ne remplace PAS --font-display (Syne, utilisé partout
// ailleurs — nav, boutons, titres de section) : un accent ponctuel,
// pas un changement de typo sitewide.
const silkscreen = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pixel',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

const TITLE = 'CHEZ FLORENCE — Vente de Lapins de Race à Abidjan'
const DESCRIPTION = SITE_DESCRIPTION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s | CHEZ FLORENCE' },
  description: DESCRIPTION,
  keywords: [
    'lapin', 'vente lapin Abidjan', 'prix lapin Côte d\'Ivoire', 'élevage lapin',
    'lapin Hollandais', 'lapin Rex', 'lapin Angora', 'Azaguié', 'Abidjan',
    'Côte d\'Ivoire', 'chez florence', 'acheter lapin vivant',
  ],
  manifest: '/manifest.json',
  applicationName: 'CHEZ FLORENCE',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CHEZ FLORENCE',
  },
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'fr_FR',
    images: [{ url: '/IMAGES/vente-lapins-affiche.jpg', width: 1376, height: 768, alt: 'Chez Florence — Vente de lapins à Azaguié, Côte d\'Ivoire' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/IMAGES/vente-lapins-affiche.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2A2118',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${silkscreen.variable}`}>
      <body className="bg-brand-dark text-white font-body antialiased">
        {/* JSON-LD sitewide — lu par Google (rich results) et par les
            answer engines (ChatGPT, Perplexity, Gemini) pour l'AEO/GEO.
            Une seule fois pour tout le site, pas par page. */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdScript(getOrganizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdScript(getWebsiteJsonLd()) }}
        />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#3A2F22',
              color: '#fff',
              border: '1px solid #050505',
            },
            success: { iconTheme: { primary: '#B8834A', secondary: '#3A2F22' } },
          }}
        />
        {children}
        <CookieBanner />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
