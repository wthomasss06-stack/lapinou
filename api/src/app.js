// api/src/app.js (trigger reload for CORS)
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

// ─── Middlewares globaux ──────────────────────────────────────────────────────
app.use(cors({ origin: config.frontendUrl, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Uploads statiques ────────────────────────────────────────────────────────
// Photos des lapins servies depuis /uploads/xxx.jpg
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

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
