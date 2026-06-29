// api/src/services/reservations.service.js
// Pattern Nexura Transaction — transition atomique réservation + statut lapin

const prisma  = require('../config/prisma')
const emailSvc = require('./email.service')

// ─── Créer une réservation ────────────────────────────────────────────────────
// Transaction Prisma : réservation + passage lapin en "reserved" en un seul block
async function createReservation(rabbitId, data) {
  return prisma.$transaction(async (tx) => {
    // 1. Vérifier disponibilité (lock sur le row)
    const rabbit = await tx.rabbit.findUnique({ where: { id: rabbitId } })
    if (!rabbit)                         throw { status: 404, message: 'Lapin introuvable' }
    if (rabbit.status !== 'available')   throw { status: 409, message: 'Ce lapin n\'est plus disponible' }

    // 2. Créer la réservation
    const reservation = await tx.reservation.create({
      data: {
        rabbitId,
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone,
        message:   data.message || null,
        status:    'pending',
        latitude:  data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
      },
    })

    // 3. Passer le lapin en "reserved" — même logique que Nexura statut_reserve
    await tx.rabbit.update({
      where: { id: rabbitId },
      data:  { status: 'reserved' },
    })

    // 4. Emails (hors transaction — non bloquant)
    emailSvc.sendReservationEmails(reservation, rabbit).catch(console.error)

    return { reservation, rabbit }
  })
}

// ─── Annuler une réservation (admin) ─────────────────────────────────────────
// Repasse le lapin en "available" si aucune autre résa pending
async function cancelReservation(reservationId) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where:   { id: reservationId },
      include: { rabbit: true },
    })
    if (!reservation) throw { status: 404, message: 'Réservation introuvable' }

    // Annuler la réservation
    await tx.reservation.update({
      where: { id: reservationId },
      data:  { status: 'cancelled' },
    })

    // Compter les réservations encore actives sur ce lapin
    const remaining = await tx.reservation.count({
      where: {
        rabbitId: reservation.rabbitId,
        status:   { in: ['pending', 'confirmed'] },
        id:       { not: reservationId },
      },
    })

    // Si plus aucune → remettre disponible
    if (remaining === 0) {
      await tx.rabbit.update({
        where: { id: reservation.rabbitId },
        data:  { status: 'available' },
      })
    }

    return reservation
  })
}

// ─── Confirmer (admin) ────────────────────────────────────────────────────────
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
// Confirme la vente définitive — lapin passe en "sold"
async function markAsSold(reservationId) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where: { id: reservationId },
    })
    if (!reservation) throw { status: 404, message: 'Réservation introuvable' }

    await tx.reservation.update({
      where: { id: reservationId },
      data:  { status: 'confirmed' },
    })

    await tx.rabbit.update({
      where: { id: reservation.rabbitId },
      data:  { status: 'sold' },
    })

    return reservation
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
