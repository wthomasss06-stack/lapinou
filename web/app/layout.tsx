import type { Metadata, Viewport } from 'next'
import { Syne, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import CookieBanner from '@/components/CookieBanner'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lapinou.vercel.app'),
  title: 'Lapinou — Vente de Lapins à Abidjan',
  description: 'Découvrez et réservez nos lapins de race élevés à Abidjan, Côte d\'Ivoire.',
  keywords: ['lapin', 'vente lapin', 'élevage', 'Abidjan', 'Côte d\'Ivoire', 'lapinou'],
  manifest: '/manifest.json',
  applicationName: 'Lapinou',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Lapinou',
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
    title: 'Lapinou — Vente de Lapins à Abidjan',
    description: 'Découvrez et réservez nos lapins de race élevés à Abidjan, Côte d\'Ivoire.',
    type: 'website',
    images: ['/icon-512.png'],
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
    <html lang="fr" className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-brand-dark text-white font-body antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#3A2F22',
              color: '#fff',
              border: '1px solid #4A3D2C',
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
