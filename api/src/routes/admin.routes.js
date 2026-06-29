// api/src/routes/admin.routes.js
// Login admin simple — vérifie le mot de passe et renvoie un token
// (le token EST le mot de passe lui-même, pas de session côté serveur)

const router = require('express').Router()
const config = require('../config/env')

router.post('/login', (req, res) => {
  const { password } = req.body || {}

  if (!config.adminPassword) {
    return res.status(503).json({ error: 'Accès admin non configuré côté serveur' })
  }

  if (!password || password !== config.adminPassword) {
    return res.status(401).json({ error: 'Mot de passe incorrect' })
  }

  res.json({ token: config.adminPassword })
})

module.exports = router
