// api/src/app.js
const express  = require('express')
const cors     = require('cors')
const path     = require('path')
const config   = require('./config/env')

const rabbitsRoutes      = require('./routes/rabbits.routes')
const reservationsRoutes = require('./routes/reservations.routes')
const adminRoutes        = require('./routes/admin.routes')
const contactRoutes      = require('./routes/contact.routes')
const analyticsRoutes    = require('./routes/analytics.routes')
const errorHandler       = require('./middlewares/error.middleware')

const app = express()

// ─── CORS ──────────────────────────────────────────────────────────────────────
// L'ancienne config n'autorisait QU'UNE seule origine exacte (config.frontendUrl).
// Ça casse silencieusement (erreur CORS visible seulement dans la console navigateur,
// jamais dans les logs serveur) dès qu'on teste depuis localhost en plus de la prod,
// ou que Vercel génère une URL de preview différente du domaine principal.
// On autorise maintenant : l'URL configurée, localhost (tous ports, dev), et tout
// sous-domaine *.vercel.app du projet (previews de déploiement).
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3000',
  'http://localhost:3003',
].filter(Boolean)

const vercelPreviewPattern = /^https:\/\/lapinou[a-z0-9-]*\.vercel\.app$/

app.use(cors({
  origin(origin, callback) {
    // Requêtes sans origin (curl, Postman, health checks) → toujours autorisées
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin)) {
      return callback(null, true)
    }
    console.warn(`[CORS] Origine refusée : ${origin}`)
    return callback(new Error('Non autorisé par CORS'))
  },
  credentials: true,
}))

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/rabbits',            rabbitsRoutes)
app.use('/api/admin/reservations', reservationsRoutes)
app.use('/api/admin',              adminRoutes)
app.use('/api/contact',            contactRoutes)
app.use('/api/analytics',          analyticsRoutes)

// Health check
app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }))

// ─── Error handler (doit être en dernier) ────────────────────────────────────
app.use(errorHandler)

module.exports = app
