// api/scripts/generate-prisma-client.js
//
// Filet de sécurité : génère TOUJOURS le client Prisma avec le bon schema,
// peu importe la build command réellement exécutée par l'hébergeur.
//
// Pourquoi ce script existe :
// Avant, le choix du schema (sqlite vs postgresql) dépendait uniquement du
// flag --schema= passé à la main dans le buildCommand de render.yaml. Si ce
// flag était oublié, mal copié, ou si Render relançait juste "npm install"
// (ex: redeploy manuel depuis le dashboard, clear cache, etc.), Prisma
// retombait sur un client généré avec le schema sqlite par défaut alors que
// DATABASE_URL pointait vers Postgres (Neon) → crash au runtime :
//   "the URL must start with the protocol `file:`"
//
// Ce script supprime cette ambiguïté : il regarde NODE_ENV et choisit le
// schema en conséquence, à chaque "npm install", sans dépendre d'un flag
// externe qu'on pourrait oublier.

const { execSync } = require('child_process')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'
const schema = isProd ? 'prisma/schema.production.prisma' : 'prisma/schema.prisma'

console.log(`[postinstall] NODE_ENV=${process.env.NODE_ENV || '(non défini)'} → génération du client Prisma avec ${schema}`)

try {
  execSync(`npx prisma generate --schema=${schema}`, {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
  })
} catch (err) {
  console.error('[postinstall] Échec de la génération du client Prisma.')
  process.exit(1)
}
