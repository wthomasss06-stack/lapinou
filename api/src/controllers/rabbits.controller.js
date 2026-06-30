// api/src/controllers/rabbits.controller.js

const svc = require('../services/rabbits.service')

// GET /api/rabbits
async function list(req, res, next) {
  try {
    const { breed, gender, status, search } = req.query
    const rabbits = await svc.findAll({ breed, gender, status, search })
    res.json({ results: rabbits, count: rabbits.length })
  } catch (err) { next(err) }
}

// GET /api/rabbits/:slug
async function detail(req, res, next) {
  try {
    const rabbit = await svc.findBySlug(req.params.slug)
    if (!rabbit) return res.status(404).json({ error: 'Lapin introuvable' })
    res.json(rabbit)
  } catch (err) { next(err) }
}

// POST /api/rabbits  (admin)
async function create(req, res, next) {
  try {
    const rabbit = await svc.create(req.body)
    res.status(201).json(rabbit)
  } catch (err) { next(err) }
}

// PATCH /api/rabbits/:id  (admin)
async function update(req, res, next) {
  try {
    const rabbit = await svc.update(req.params.id, req.body)
    res.json(rabbit)
  } catch (err) { next(err) }
}

// DELETE /api/rabbits/:id  (admin)
async function remove(req, res, next) {
  try {
    await svc.remove(req.params.id)
    res.status(204).send()
  } catch (err) { next(err) }
}

// GET /api/rabbits/admin/stock-summary  (admin)
async function stockSummary(req, res, next) {
  try {
    const summary = await svc.getStockSummary()
    res.json(summary)
  } catch (err) { next(err) }
}

module.exports = { list, detail, create, update, remove, stockSummary }
