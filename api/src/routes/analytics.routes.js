// api/src/routes/analytics.routes.js
const router = require('express').Router()
const prisma = require('../config/prisma')
const adminAuth = require('../middlewares/adminAuth.middleware')

// ─── Enregistrer l'acceptation ou le refus de cookies (Public) ───────────────────
// POST /api/analytics/consent
router.post('/consent', async (req, res, next) => {
  try {
    const { accepted } = req.body || {}

    // Récupère ou crée la ligne unique globale
    const stats = await prisma.visitStats.upsert({
      where: { id: 'global' },
      update: {
        total: { increment: 1 },
        accepted: accepted === true ? { increment: 1 } : undefined,
        declined: accepted === false ? { increment: 1 } : undefined,
      },
      create: {
        id: 'global',
        total: 1,
        accepted: accepted === true ? 1 : 0,
        declined: accepted === false ? 1 : 0,
      },
    })

    res.json({ ok: true, stats })
  } catch (err) {
    next(err)
  }
})

// ─── Obtenir les statistiques des cookies / visites (Admin) ──────────────────────
// GET /api/analytics/stats
router.get('/stats', adminAuth, async (req, res, next) => {
  try {
    const stats = await prisma.visitStats.findUnique({
      where: { id: 'global' },
    })

    // Si aucune statistique n'existe encore
    if (!stats) {
      return res.json({
        id: 'global',
        total: 0,
        accepted: 0,
        declined: 0,
      })
    }

    res.json(stats)
  } catch (err) {
    next(err)
  }
})

// ─── Obtenir les statistiques publiques de la plateforme (Public) ───────────────
// GET /api/analytics/public-stats
router.get('/public-stats', async (req, res, next) => {
  try {
    // IMPORTANT : depuis le modèle de stock par race, une fiche Rabbit
    // représente plusieurs lapins (pas un individu). Le compteur public
    // "Lapins élevés" doit donc additionner les stocks réels + les unités
    // déjà réservées/vendues, plutôt que de compter le nombre de fiches
    // (ce qui sous-évaluerait massivement le vrai volume, ex: 4 fiches
    // au lieu de 21 lapins réels).
    const [stockAgg, reservedAgg] = await Promise.all([
      prisma.rabbit.aggregate({ _sum: { stock: true } }),
      prisma.reservation.aggregate({
        _sum: { quantity: true },
        where: { status: { in: ['pending', 'confirmed'] } },
      }),
    ])
    const totalRabbits = (stockAgg._sum.stock || 0) + (reservedAgg._sum.quantity || 0)

    // Nombre de races de lapins uniques
    const breedsGroup = await prisma.rabbit.groupBy({
      by: ['breed'],
    })
    const totalBreeds = breedsGroup.length

    const totalReservations = await prisma.reservation.count()

    res.json({
      totalRabbits,
      totalBreeds,
      totalReservations,
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
