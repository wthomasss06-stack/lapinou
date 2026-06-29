// api/src/controllers/reservations.controller.js

const svc = require('../services/reservations.service')

// POST /api/rabbits/:slug/reserve  — soumis depuis la page détail
async function reserve(req, res, next) {
  try {
    const { rabbitId } = req.params   // id passé par la route après lookup slug
    const result = await svc.createReservation(rabbitId, req.body)
    res.status(201).json({
      message:     'Réservation enregistrée',
      reservation: { id: result.reservation.id, status: result.reservation.status },
    })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message })
    next(err)
  }
}

// GET /api/admin/reservations  (admin)
async function list(req, res, next) {
  try {
    const { status, rabbitId } = req.query
    const reservations = await svc.findAll({ status, rabbitId })
    res.json({ results: reservations, count: reservations.length })
  } catch (err) { next(err) }
}

// PATCH /api/admin/reservations/:id/confirm  (admin)
async function confirm(req, res, next) {
  try {
    const r = await svc.confirmReservation(req.params.id, req.body.note)
    res.json(r)
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message })
    next(err)
  }
}

// PATCH /api/admin/reservations/:id/cancel  (admin)
async function cancel(req, res, next) {
  try {
    const r = await svc.cancelReservation(req.params.id)
    res.json(r)
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message })
    next(err)
  }
}

// PATCH /api/admin/reservations/:id/sold  (admin)
async function sold(req, res, next) {
  try {
    const r = await svc.markAsSold(req.params.id)
    res.json(r)
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message })
    next(err)
  }
}

module.exports = { reserve, list, confirm, cancel, sold }
