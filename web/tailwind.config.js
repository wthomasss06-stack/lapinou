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
        // ─── CHEZ FLORENCE — palette stricte, héritée d'app/globals.css ──
        // Ces noms historiques sont conservés pour ne pas casser les classes
        // déjà utilisées dans les composants (bg-caramel/10, text-sage, etc.).
        // Chaque couleur pointe désormais sur les variables --xxx-rgb définies
        // dans app/globals.css (triplets séparés par des virgules, comme
        // partout ailleurs dans le projet — CtaSection, MapView, SharePanel…
        // utilisent déjà rgba(var(--x-rgb), alpha) sous cette forme) via le
        // motif Tailwind `<alpha-value>` : les modificateurs d'opacité
        // (bg-caramel/10, border-brand-border/50…) continuent de fonctionner
        // exactement comme avant, ET tout suit désormais la nouvelle palette
        // crème/brun/orange sans re-sync manuel — changer une valeur dans
        // globals.css suffit.
        caramel:    'rgba(var(--accent-orange-rgb), <alpha-value>)',      // = accent-orange
        terracotta: 'rgba(var(--accent-orange-dark-rgb), <alpha-value>)', // = accent-orange-dark
        sage:       'rgba(var(--accent-orange-rgb), <alpha-value>)',      // = accent-orange (déjà fusionné avec caramel avant ce refactor)
        cream:      'rgba(var(--muted-warm-rgb), <alpha-value>)',        // = muted-warm
        blush:      'rgba(var(--muted-warm-rgb), <alpha-value>)',        // = muted-warm
        espresso:   'rgba(var(--bg-dark-rgb), <alpha-value>)',           // = bg-dark

        // Alias "brand-*" conservés pour compatibilité avec les anciens composants
        'brand-green':  'rgba(var(--accent-orange-rgb), <alpha-value>)', // = accent-orange
        'brand-dark':   'rgba(var(--bg-dark-rgb), <alpha-value>)',       // = bg-dark
        'brand-darker': 'rgba(var(--bg-dark-rgb), <alpha-value>)',       // = bg-dark (surfaces "enfoncées" : inputs, image placeholders)
        'brand-card':   'rgba(var(--card-rgb), <alpha-value>)',          // = card (surfaces "élevées" : cartes, panneaux)
        'brand-border': 'rgba(var(--border-rgb), <alpha-value>)',        // = border (blanc, opacité pilotée par le modificateur Tailwind)
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        label: ['var(--font-label)'],
        pixel: ['var(--font-pixel)'],
      },
    },
  },
  plugins: [],
}
