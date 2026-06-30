// api/src/config/env.js
// Chargé une fois au démarrage — même pattern que Nexura backend/.env
//
// IMPORTANT : .env et .env.production sont dans .gitignore et ne sont JAMAIS
// déployés sur Render. En production, les variables viennent uniquement du
// dashboard Render (Environment). dotenv.config() ne écrase jamais une variable
// déjà présente dans process.env, donc charger un .env local ici est juste un
// confort pour le développement — ça n'a aucun effet en prod si le fichier
// n'existe pas (échec silencieux, sans planter le serveur).
const path = require('path')
const fs = require('fs')

const rootDir = path.resolve(__dirname, '../../../')
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
const envPath = path.join(rootDir, envFile)

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath })
} else {
  // Pas grave en prod (Render fournit les vraies variables via son dashboard).
  // En dev, ça veut dire que le .env est manquant — on laisse le check `required`
  // plus bas lever une erreur claire si DATABASE_URL est vide.
}

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,

  // Resend — mêmes clés que Nexura backend/.env
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.FROM_EMAIL || 'onboarding@resend.dev',
  adminEmail: process.env.ADMIN_EMAIL,

  // Cloudinary — mêmes clés que Nexura
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  // WhatsApp vendeur — même clé que Nexura (WAVE_NUMBER_NEXURA)
  whatsappNumber: process.env.WAVE_NUMBER_NEXURA,

  // Mot de passe admin — protège /api/rabbits (POST/PATCH/DELETE) et /api/admin/*
  adminPassword: process.env.ADMIN_PASSWORD,

  // CORS — en prod mettre l'URL Next.js
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3003',

  // Uploads locaux
  uploadsDir: process.env.UPLOADS_DIR || './uploads',
}

// Vérifications minimales
const required = ['databaseUrl']
for (const key of required) {
  if (!config[key]) throw new Error(`Env manquante : ${key}`)
}

module.exports = config
