// api/src/routes/admin.routes.js
// Login admin simple — vérifie le mot de passe et renvoie un token
// (le token EST le mot de passe lui-même, pas de session côté serveur)

const router = require('express').Router()
const config = require('../config/env')
const prisma = require('../config/prisma')
const adminAuth = require('../middlewares/adminAuth.middleware')
const { ZONES } = require('../lib/delivery')

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

// ─── GET /api/admin/dashboard — données pour le dashboard (graphiques) ────────
// Query: ?days=30 (fenêtre du graphique temporel, défaut 30)
router.get('/dashboard', adminAuth, async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days, 10) || 30, 180)
    const since = new Date()
    since.setDate(since.getDate() - days)
    since.setHours(0, 0, 0, 0)

    // ── Toutes les réservations confirmées/vendues dans la fenêtre (revenu réel) ──
    const [allRabbits, allReservations, windowReservations] = await Promise.all([
      prisma.rabbit.findMany({
        select: { id: true, name: true, breed: true, price: true, status: true, createdAt: true },
      }),
      prisma.reservation.findMany({
        select: {
          id: true, status: true, deliveryZone: true, deliveryFee: true,
          createdAt: true, confirmedAt: true, rabbitId: true,
          rabbit: { select: { price: true, breed: true, name: true } },
        },
      }),
      prisma.reservation.findMany({
        where: { createdAt: { gte: since } },
        select: {
          id: true, status: true, deliveryFee: true, createdAt: true,
          rabbit: { select: { price: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    // ── KPIs globaux ──────────────────────────────────────────────────────────
    const revenueConfirmed = allReservations
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + (r.rabbit?.price || 0) + (r.deliveryFee || 0), 0)

    const pendingCount   = allReservations.filter(r => r.status === 'pending').length
    const confirmedCount = allReservations.filter(r => r.status === 'confirmed').length
    const cancelledCount = allReservations.filter(r => r.status === 'cancelled').length

    const rabbitsAvailable = allRabbits.filter(r => r.status === 'available').length
    const rabbitsReserved  = allRabbits.filter(r => r.status === 'reserved').length
    const rabbitsSold      = allRabbits.filter(r => r.status === 'sold').length

    // ── Série temporelle : réservations + revenu par jour ─────────────────────
    const dayBuckets = {}
    for (let i = 0; i < days; i++) {
      const d = new Date(since)
      d.setDate(d.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      dayBuckets[key] = { date: key, reservations: 0, revenue: 0 }
    }
    for (const r of windowReservations) {
      const key = r.createdAt.toISOString().slice(0, 10)
      if (!dayBuckets[key]) continue
      dayBuckets[key].reservations += 1
      if (r.status === 'confirmed') {
        dayBuckets[key].revenue += (r.rabbit?.price || 0) + (r.deliveryFee || 0)
      }
    }
    const timeline = Object.values(dayBuckets)

    // ── Répartition par zone de livraison ──────────────────────────────────────
    const zoneCounts = { abidjan: 0, azaguie: 0, pays_profond: 0, inconnue: 0 }
    let deliveryRevenue = 0
    for (const r of allReservations) {
      if (r.status === 'cancelled') continue
      const key = r.deliveryZone && zoneCounts.hasOwnProperty(r.deliveryZone) ? r.deliveryZone : 'inconnue'
      zoneCounts[key] += 1
      if (r.deliveryFee) deliveryRevenue += r.deliveryFee
    }
    const zoneBreakdown = Object.entries(zoneCounts).map(([zone, count]) => ({
      zone,
      label: ZONES[zone]?.label || 'Zone inconnue',
      fee: ZONES[zone]?.fee ?? null,
      count,
    }))

    // ── Top races par nombre de réservations ──────────────────────────────────
    const breedCounts = {}
    for (const r of allReservations) {
      const breed = r.rabbit?.breed || 'Autre'
      breedCounts[breed] = (breedCounts[breed] || 0) + 1
    }
    const topBreeds = Object.entries(breedCounts)
      .map(([breed, count]) => ({ breed, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    res.json({
      kpis: {
        revenueConfirmed,
        deliveryRevenue,
        pendingCount,
        confirmedCount,
        cancelledCount,
        rabbitsAvailable,
        rabbitsReserved,
        rabbitsSold,
        totalRabbits: allRabbits.length,
        totalReservations: allReservations.length,
      },
      timeline,
      zoneBreakdown,
      topBreeds,
    })
  } catch (err) { next(err) }
})

module.exports = router
