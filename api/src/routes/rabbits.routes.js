// api/src/routes/rabbits.routes.js
const router = require('express').Router()
const ctrl   = require('../controllers/rabbits.controller')
const resvCtrl = require('../controllers/reservations.controller')
const prisma   = require('../config/prisma')
const adminAuth = require('../middlewares/adminAuth.middleware')
const upload    = require('../middlewares/upload.middleware')
const { reservationRules, validate } = require('../validations/reservation.schema')
const path = require('path')
const fs   = require('fs')

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/',        ctrl.list)
router.get('/:slug',   ctrl.detail)

// POST /api/rabbits/:slug/reserve
// On résout le slug → id avant de passer au controller
router.post('/:slug/reserve', reservationRules, validate, async (req, res, next) => {
  try {
    const rabbit = await prisma.rabbit.findUnique({
      where: { slug: req.params.slug },
      select: { id: true, status: true },
    })
    if (!rabbit) return res.status(404).json({ error: 'Lapin introuvable' })

    req.params.rabbitId = rabbit.id
    resvCtrl.reserve(req, res, next)
  } catch (err) { next(err) }
})

// ─── Admin (protégées par mot de passe — header Authorization: Bearer xxx) ───
router.post('/',        adminAuth, ctrl.create)
router.patch('/:id',   adminAuth, ctrl.update)
router.delete('/:id',  adminAuth, ctrl.remove)

// ─── Upload photos (admin) ────────────────────────────────────────────────────
// POST /api/rabbits/:id/images  → upload jusqu'à 8 photos
router.post('/:id/images', adminAuth, upload.array('images', 8), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: 'Aucun fichier reçu' })

    // Compte les photos existantes pour calculer la position
    const existingCount = await prisma.rabbitPhoto.count({ where: { rabbitId: req.params.id } })

    const photos = await Promise.all(
      req.files.map((file, i) =>
        prisma.rabbitPhoto.create({
          data: {
            rabbitId: req.params.id,
            url: `/uploads/${file.filename}`,
            position: existingCount + i,
          },
        })
      )
    )

    res.status(201).json({ photos })
  } catch (err) { next(err) }
})

// DELETE /api/rabbits/:id/images/:photoId  → supprimer une photo
router.delete('/:id/images/:photoId', adminAuth, async (req, res, next) => {
  try {
    const photo = await prisma.rabbitPhoto.findUnique({ where: { id: req.params.photoId } })
    if (!photo) return res.status(404).json({ error: 'Photo introuvable' })

    // Supprime le fichier physique
    const UPLOADS_DIR = require('path').resolve(__dirname, '../../../uploads')
    const filename = path.basename(photo.url)
    const filePath = path.join(UPLOADS_DIR, filename)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    await prisma.rabbitPhoto.delete({ where: { id: req.params.photoId } })
    res.status(204).send()
  } catch (err) { next(err) }
})

module.exports = router
