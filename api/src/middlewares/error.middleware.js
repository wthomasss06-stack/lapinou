// api/src/middlewares/error.middleware.js
// Pattern Nexura backend/apps/core/exceptions.py → Express

function errorHandler(err, req, res, _next) {
  // Erreur Prisma — code unique violation (slug/id dupliqué)
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Conflit : entrée déjà existante' })
  }
  // Erreur Prisma — enregistrement non trouvé
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Enregistrement introuvable' })
  }

  const status  = err.status  || err.statusCode || 500
  const message = err.message || 'Erreur serveur interne'

  if (status >= 500) {
    console.error('[ERROR]', err)
  }

  res.status(status).json({ error: message })
}

module.exports = errorHandler
