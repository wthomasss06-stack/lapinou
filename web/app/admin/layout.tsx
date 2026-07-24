import type { Metadata } from 'next'

// /admin est déjà disallow dans robots.ts — ce noindex explicite est une
// deuxième barrière : si un lien externe pointe un jour vers /admin, cette
// balise empêche quand même son indexation par les moteurs qui la liraient.
export const metadata: Metadata = {
  title: 'Administration — Chez Florence',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
