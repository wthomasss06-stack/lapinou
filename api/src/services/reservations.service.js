// api/src/services/reservations.service.js
// Pattern Nexura Transaction — transition atomique réservation + stock lapin

const prisma  = require('../config/prisma')
const emailSvc = require('./email.service')
const { computeDelivery } = require('../lib/delivery')

// ─── Créer une réservation ────────────────────────────────────────────────────
// Transaction Prisma : vérifie le stock, décompte immédiatement, crée la résa.
async function createReservation(rabbitId, data) {
  const quantity = Math.max(1, parseInt(data.quantity, 10) || 1)

  return prisma.$transaction(async (tx) => {
    // 1. Vérifier disponibilité (lock sur le row)
    const rabbit = await tx.rabbit.findUnique({ where: { id: rabbitId } })
    if (!rabbit)                       throw { status: 404, message: 'Lapin introuvable' }
    if (rabbit.status !== 'available') throw { status: 409, message: 'Cette race n\'est plus disponible' }
    if (rabbit.stock < quantity) {
      throw {
        status: 409,
        message: rabbit.stock === 0
          ? 'Stock épuisé pour cette race'
          : `Stock insuffisant : il ne reste que ${rabbit.stock} lapin(s) disponible(s)`,
      }
    }

    // 2. Résoudre la zone/le frais de livraison depuis les coordonnées GPS
    const lat = data.latitude ? parseFloat(data.latitude) : null
    const lng = data.longitude ? parseFloat(data.longitude) : null
    const { zone: deliveryZone, fee: deliveryFee } = computeDelivery(lat, lng)

    // 3. Créer la réservation
    const reservation = await tx.reservation.create({
      data: {
        rabbitId,
        quantity,
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone,
        message:   data.message || null,
        status:    'pending',
        latitude:  lat,
        longitude: lng,
        deliveryZone,
        deliveryFee: deliveryZone ? deliveryFee : null,
      },
    })

    // 4. Décompter le stock immédiatement, et passer en "sold" si épuisé
    const newStock = rabbit.stock - quantity
    await tx.rabbit.update({
      where: { id: rabbitId },
      data: {
        stock:  newStock,
        status: newStock <= 0 ? 'sold' : 'available',
      },
    })

    // 5. Emails (hors transaction — non bloquant)
    emailSvc.sendReservationEmails(reservation, rabbit).catch(console.error)

    return { reservation, rabbit }
  })
}

// ─── Annuler une réservation (admin) ─────────────────────────────────────────
// Restitue la quantité réservée au stock de la fiche
async function cancelReservation(reservationId) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where:   { id: reservationId },
      include: { rabbit: true },
    })
    if (!reservation) throw { status: 404, message: 'Réservation introuvable' }
    if (reservation.status === 'cancelled') throw { status: 409, message: 'Réservation déjà annulée' }

    // Annuler la réservation
    await tx.reservation.update({
      where: { id: reservationId },
      data:  { status: 'cancelled' },
    })

    // Restituer le stock — repasse en "available" si la fiche était épuisée
    const newStock = reservation.rabbit.stock + reservation.quantity
    await tx.rabbit.update({
      where: { id: reservation.rabbitId },
      data: {
        stock:  newStock,
        status: newStock > 0 ? 'available' : 'sold',
      },
    })

    return reservation
  })
}

// ─── Confirmer (admin) ────────────────────────────────────────────────────────
// Le stock a déjà été décompté à la création — confirmer ne fait que valider
// la commande (contact établi, rendez-vous pris), sans toucher au stock.
async function confirmReservation(reservationId, note = null) {
  return prisma.reservation.update({
    where: { id: reservationId },
    data: {
      status:      'confirmed',
      confirmedAt: new Date(),
      note,
    },
  })
}

// ─── Marquer vendu (admin) ────────────────────────────────────────────────────
// Le stock a déjà été décompté — on confirme juste la vente définitive de
// cette commande (transaction physique effectuée).
async function markAsSold(reservationId) {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } })
  if (!reservation) throw { status: 404, message: 'Réservation introuvable' }

  return prisma.reservation.update({
    where: { id: reservationId },
    data:  { status: 'confirmed', confirmedAt: reservation.confirmedAt || new Date() },
  })
}

// ─── Lister (admin) ───────────────────────────────────────────────────────────
async function findAll({ status, rabbitId } = {}) {
  const where = {}
  if (status)   where.status   = status
  if (rabbitId) where.rabbitId = rabbitId

  return prisma.reservation.findMany({
    where,
    include: { rabbit: { select: { name: true, breed: true, slug: true, price: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

module.exports = {
  createReservation,
  cancelReservation,
  confirmReservation,
  markAsSold,
  findAll,
}
