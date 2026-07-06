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
        // ─── CHEZ FLORENCE — palette stricte à 6 couleurs ─────────────────
        // Ces noms historiques sont conservés pour ne pas casser les classes
        // déjà utilisées dans les composants (bg-caramel/10, text-sage, etc.),
        // mais chaque valeur pointe désormais sur l'une des 6 couleurs
        // officielles définies dans app/globals.css — aucune couleur hors
        // palette n'est produite au final.
        caramel:    '#B8834A', // = green (accent principal)
        terracotta: '#C2693D', // = lime (accent secondaire)
        sage:       '#B8834A', // = green (anciennement vert sauge distinct)
        cream:      '#A89678', // = muted (anciennement fond clair chaud)
        blush:      '#A89678', // = muted (anciennement surfaces claires)
        espresso:   '#2A2118', // = dark

        // Alias "brand-*" conservés pour compatibilité avec les anciens composants
        'brand-green':  '#B8834A', // = green
        'brand-dark':   '#2A2118', // = dark
        'brand-darker': '#050505', // = border
        'brand-card':   '#3A2F22', // = card
        'brand-border': '#050505', // = border
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        label: ['var(--font-label)'],
      },
    },
  },
  plugins: [],
}
