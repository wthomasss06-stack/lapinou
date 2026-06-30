// api/src/config/prisma.js
// Instance unique Prisma — pattern Nexura backend/apps/core/config/prisma.ts

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
})

// Diagnostic clair au démarrage : on affiche le provider réellement actif (déduit
// de l'URL, pas du schema source) pour repérer immédiatement un mismatch
// dev/prod dans les logs, plutôt que d'attendre un crash sur la première requête.
const dbUrl = process.env.DATABASE_URL || ''
const provider = dbUrl.startsWith('file:') ? 'sqlite' : dbUrl.startsWith('postgres') ? 'postgresql' : 'inconnu'
console.log(`[prisma] Provider détecté : ${provider} (NODE_ENV=${process.env.NODE_ENV || 'development'})`)
if (process.env.NODE_ENV === 'production' && provider !== 'postgresql') {
  console.warn('[prisma] ⚠️  NODE_ENV=production mais DATABASE_URL ne ressemble pas à une URL PostgreSQL. Vérifie la variable sur Render.')
}

module.exports = prisma
