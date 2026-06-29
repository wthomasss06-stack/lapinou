// api/src/config/env.js
// Chargé une fois au démarrage — même pattern que Nexura backend/.env

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') })

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
