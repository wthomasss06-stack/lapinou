import type { Metadata } from 'next'
import { Syne, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import CookieBanner from '@/components/CookieBanner'

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
  title: 'Lapinou — Vente de Lapins à Abidjan',
  description: 'Découvrez et réservez nos lapins de race élevés à Abidjan, Côte d\'Ivoire.',
  keywords: ['lapin', 'vente lapin', 'élevage', 'Abidjan', 'Côte d\'Ivoire', 'lapinou'],
  openGraph: {
    title: 'Lapinou — Vente de Lapins à Abidjan',
    description: 'Découvrez et réservez nos lapins de race élevés à Abidjan, Côte d\'Ivoire.',
    type: 'website',
  },
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
      </body>
    </html>
  )
}
