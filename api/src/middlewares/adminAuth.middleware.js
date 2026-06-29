// api/src/middlewares/adminAuth.middleware.js
// Protection simple par mot de passe pour les routes admin.
// Le mot de passe est envoyé dans le header : Authorization: Bearer <mot_de_passe>

const config = require('../config/env')

function adminAuth(req, res, next) {
  if (!config.adminPassword) {
    // Pas de mot de passe configuré → on bloque par défaut en prod,
    // on laisse passer en dev avec un avertissement.
    if (config.nodeEnv === 'production') {
      return res.status(503).json({ error: 'Accès admin non configuré (ADMIN_PASSWORD manquant)' })
    }
    console.warn('[adminAuth] ADMIN_PASSWORD non défini — accès admin ouvert en développement')
    return next()
  }

  const header = req.headers.authorization || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token || token !== config.adminPassword) {
    return res.status(401).json({ error: 'Mot de passe admin invalide ou manquant' })
  }

  next()
}

module.exports = adminAuth
