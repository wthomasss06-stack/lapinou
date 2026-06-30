// api/src/routes/rabbits.routes.js
const router = require('express').Router()
const ctrl   = require('../controllers/rabbits.controller')
const resvCtrl = require('../controllers/reservations.controller')
const prisma   = require('../config/prisma')
const adminAuth = require('../middlewares/adminAuth.middleware')
const upload    = require('../middlewares/upload.middleware')
const { reservationRules, validate } = require('../validations/reservation.schema')
const cloudinarySvc = require('../services/cloudinary.service')

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/',        ctrl.list)

// IMPORTANT : déclarée AVANT /:slug pour ne pas être interceptée par la route générique
router.get('/admin/stock-summary', adminAuth, ctrl.stockSummary)

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
// POST /api/rabbits/:id/images  → upload jusqu'à 8 photos vers Cloudinary
router.post('/:id/images', adminAuth, upload.array('images', 8), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: 'Aucun fichier reçu' })

    if (!cloudinarySvc.isConfigured) {
      return res.status(503).json({ error: 'Cloudinary non configuré côté serveur (variables CLOUDINARY_* manquantes)' })
    }

    // Compte les photos existantes pour calculer la position
    const existingCount = await prisma.rabbitPhoto.count({ where: { rabbitId: req.params.id } })

    // Upload vers Cloudinary (en mémoire → cloud, jamais sur disque local)
    const uploaded = await cloudinarySvc.uploadMany(req.files)

    const photos = await Promise.all(
      uploaded.map((u, i) =>
        prisma.rabbitPhoto.create({
          data: {
            rabbitId: req.params.id,
            url: u.url,
            publicId: u.publicId,
            position: existingCount + i,
          },
        })
      )
    )

    res.status(201).json({ photos })
  } catch (err) { next(err) }
})

// DELETE /api/rabbits/:id/images/:photoId  → supprimer une photo (Cloudinary + DB)
router.delete('/:id/images/:photoId', adminAuth, async (req, res, next) => {
  try {
    const photo = await prisma.rabbitPhoto.findUnique({ where: { id: parseInt(req.params.photoId, 10) } })
    if (!photo) return res.status(404).json({ error: 'Photo introuvable' })

    // Supprime sur Cloudinary — utilise publicId si dispo, sinon tente de le déduire de l'URL
    const publicId = photo.publicId || cloudinarySvc.publicIdFromUrl(photo.url)
    await cloudinarySvc.deleteByPublicId(publicId)

    await prisma.rabbitPhoto.delete({ where: { id: req.params.photoId } })
    res.status(204).send()
  } catch (err) { next(err) }
})

module.exports = router
