// api/src/routes/pricing.routes.js
// GET /api/pricing — tarif au kilo en vigueur (public, lecture seule).
// Utilisé par l'admin pour afficher l'aperçu du prix en direct avec le MÊME
// tarif que celui appliqué à l'enregistrement.
const router = require('express').Router()
const { getPublicPricing } = require('../lib/pricing')

router.get('/', (_req, res) => {
  res.json(getPublicPricing())
})

module.exports = router
