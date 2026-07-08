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
// Retourne toutes les fiches (y compris épuisées) — le front grise les indispo.
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
      // Available en premier ('available' < 'sold' alphabétiquement), puis sold
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
  const stock = Math.max(0, parseInt(data.stock, 10) || 0)
  const payload = { ...data, stock, status: stock > 0 ? 'available' : 'sold' }
  return prisma.rabbit.create({ data: payload, include: RABBIT_INCLUDE })
}

// ─── Mise à jour (admin) ──────────────────────────────────────────────────────
// Si le stock est modifié manuellement depuis l'admin, on resynchronise le
// statut automatiquement (sauf si l'admin a explicitement fourni un statut).
async function update(id, data) {
  const payload = { ...data }
  if (payload.stock !== undefined) {
    payload.stock = Math.max(0, parseInt(payload.stock, 10) || 0)
    if (payload.status === undefined) {
      payload.status = payload.stock > 0 ? 'available' : 'sold'
    }
  }
  return prisma.rabbit.update({
    where: { id },
    data: payload,
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
// Un lapin réservé ne peut pas être supprimé (contrainte RESTRICT sur
// Reservation.rabbitId) — Postgres remonte ça en erreur brute (pas un code
// Prisma "connu", donc pas interceptable proprement dans error.middleware).
// On vérifie donc en amont et on renvoie un message clair : l'admin doit
// changer le statut (setStatus) plutôt que supprimer une fiche avec un
// historique de réservations.
async function remove(id) {
  const reservationCount = await prisma.reservation.count({ where: { rabbitId: id } })
  if (reservationCount > 0) {
    const err = new Error(
      `Impossible de supprimer ce lapin : ${reservationCount} réservation(s) y sont liée(s). ` +
      `Marquez-le plutôt comme "Vendu" ou indisponible.`
    )
    err.status = 409
    throw err
  }
  return prisma.rabbit.delete({ where: { id } })
}

// ─── Suivi de stock (admin) ───────────────────────────────────────────────────
// Vue d'ensemble pour le dashboard : stock restant / déjà vendu, par race et
// globalement. "Vendu" = somme des quantités des réservations confirmées ou
// pending (le stock a déjà été décompté dès la réservation).
async function getStockSummary() {
  const rabbits = await prisma.rabbit.findMany({
    select: {
      id: true, name: true, breed: true, slug: true, stock: true, status: true, price: true,
      reservations: {
        where: { status: { in: ['pending', 'confirmed'] } },
        select: { quantity: true },
      },
    },
    orderBy: { breed: 'asc' },
  })

  const byRabbit = rabbits.map(r => ({
    id: r.id,
    name: r.name,
    breed: r.breed,
    slug: r.slug,
    price: r.price,
    stockRemaining: r.stock,
    sold: r.reservations.reduce((sum, res) => sum + res.quantity, 0),
    status: r.status,
  }))

  const totals = byRabbit.reduce((acc, r) => ({
    stockRemaining: acc.stockRemaining + r.stockRemaining,
    sold: acc.sold + r.sold,
  }), { stockRemaining: 0, sold: 0 })

  return { byRabbit, totals }
}

module.exports = { findAll, findBySlug, findById, create, update, setStatus, remove, getStockSummary }
