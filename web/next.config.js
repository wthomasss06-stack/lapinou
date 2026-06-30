/** @type {import('next').NextConfig} */
// L'ancienne version lisait manuellement /.env ou /.env.production à la racine
// du repo pour extraire WAVE_NUMBER_NEXURA. Ce fichier n'existe jamais sur Vercel
// (il est dans .gitignore, donc jamais déployé) → le parsing échouait toujours
// silencieusement et retombait sur un numéro hardcodé en dur, indépendamment de
// la vraie configuration. NEXT_PUBLIC_WHATSAPP est déjà fourni par vercel.json
// (et par web/.env.local en dev) — pas besoin de réinventer ce mécanisme.

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
