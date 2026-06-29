/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Lapinou — palette chaude/organique ───────────────────────────
        caramel:    '#B8834A', // accent principal — demandé par le client
        terracotta: '#C2693D', // accent secondaire (alertes, "réservé")
        sage:       '#7C8B6F', // vert doux (succès, "disponible")
        cream:      '#FBF4E8', // fond clair chaud
        blush:      '#EFE2D2', // surfaces / cartes
        espresso:   '#2A2118', // texte / fond foncé

        // Alias "brand-*" conservés pour compatibilité avec les anciens composants
        'brand-green':  '#B8834A',
        'brand-dark':   '#2A2118',
        'brand-darker': '#1E1812',
        'brand-card':   '#3A2F22',
        'brand-border': '#4A3D2C',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
}
