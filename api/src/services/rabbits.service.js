// api/src/services/rabbits.service.js
// Logique métier lapins — pattern Nexura annonces.service

const prisma = require('../config/prisma')

// Include standard pour toutes les requêtes publiques
const RABBIT_INCLUDE = {
  photos: {
    orderBy: { position: 'asc' },
  },
}

// ─── Liste publique ───────────────────────────────────────────────────────────
// Retourne tous les lapins (y compris reserved/sold) — le front grise les indispos
async function findAll({ breed, gender, status, search } = {}) {
  const where = {}
  if (breed)  where.breed  = { contains: breed }
  if (gender) where.gender = gender
  if (status) where.status = status
  if (search) {
    where.OR = [
      { name:  { contains: search } },
      { breed: { contains: search } },
      { color: { contains: search } },
    ]
  }

  return prisma.rabbit.findMany({
    where,
    include: RABBIT_INCLUDE,
    orderBy: [
      // Available en premier, ensuite reserved, puis sold
      { status: 'asc' },
      { createdAt: 'desc' },
    ],
  })
}

// ─── Détail par slug ──────────────────────────────────────────────────────────
async function findBySlug(slug) {
  return prisma.rabbit.findUnique({
    where: { slug },
    include: {
      ...RABBIT_INCLUDE,
      reservations: {
        where: { status: { in: ['pending', 'confirmed'] } },
        select: { id: true, status: true, createdAt: true }, // pas d'infos perso
      },
    },
  })
}

// ─── Détail par id (admin) ────────────────────────────────────────────────────
async function findById(id) {
  return prisma.rabbit.findUnique({
    where: { id },
    include: {
      ...RABBIT_INCLUDE,
      reservations: { orderBy: { createdAt: 'desc' } },
    },
  })
}

// ─── Création (admin) ─────────────────────────────────────────────────────────
async function create(data) {
  return prisma.rabbit.create({ data, include: RABBIT_INCLUDE })
}

// ─── Mise à jour (admin) ──────────────────────────────────────────────────────
async function update(id, data) {
  return prisma.rabbit.update({
    where: { id },
    data,
    include: RABBIT_INCLUDE,
  })
}

// ─── Changement de statut ─────────────────────────────────────────────────────
// Utilisé par la réservation et l'admin
async function setStatus(id, status) {
  return prisma.rabbit.update({
    where: { id },
    data: { status },
  })
}

// ─── Suppression (admin) ──────────────────────────────────────────────────────
async function remove(id) {
  return prisma.rabbit.delete({ where: { id } })
}

module.exports = { findAll, findBySlug, findById, create, update, setStatus, remove }
