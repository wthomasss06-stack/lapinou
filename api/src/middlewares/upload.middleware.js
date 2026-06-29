// api/src/middlewares/upload.middleware.js
const multer = require('multer')

// Stockage en mémoire (buffer) — les fichiers sont envoyés directement à
// Cloudinary sans jamais toucher le disque local (cf cloudinary.service.js).
// Important sur Render/Vercel : le filesystem est éphémère, le disque local
// ne survit pas à un redéploiement.
const storage = multer.memoryStorage()

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format non supporté. Utilisez JPEG, PNG ou WebP.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
})

module.exports = upload
