// api/src/services/cloudinary.service.js
// Stockage des photos de lapins sur Cloudinary — mêmes clés que Nexura
// Remplace le stockage disque local (incompatible avec les filesystems
// éphémères type Render, qui sont réinitialisés à chaque redéploiement)

const cloudinary = require('cloudinary').v2
const config = require('../config/env')

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key:    config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
})

const FOLDER = 'lapinou/rabbits'

// ─── Upload d'un buffer image (depuis multer memoryStorage) ──────────────────
function uploadBuffer(buffer, originalname) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: 'image',
        // Optimisation automatique — même esprit que les transformations Nexura
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (err, result) => {
        if (err) return reject(err)
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}

// ─── Upload de plusieurs fichiers en parallèle ────────────────────────────────
async function uploadMany(files) {
  const results = await Promise.all(
    files.map(file => uploadBuffer(file.buffer, file.originalname))
  )
  // url + public_id (nécessaire pour la suppression ultérieure)
  return results.map(r => ({ url: r.secure_url, publicId: r.public_id }))
}

// ─── Suppression par public_id ────────────────────────────────────────────────
async function deleteByPublicId(publicId) {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error('[cloudinary] Échec suppression:', publicId, err.message)
  }
}

// ─── Extrait le public_id Cloudinary depuis une URL secure_url ───────────────
// Utile pour les anciennes lignes en base qui n'ont que l'URL stockée.
function publicIdFromUrl(url) {
  if (!url || !url.includes('res.cloudinary.com')) return null
  const match = url.match(/\/lapinou\/rabbits\/([^./]+)/)
  return match ? `lapinou/rabbits/${match[1]}` : null
}

module.exports = { uploadMany, deleteByPublicId, publicIdFromUrl, isConfigured: !!(config.cloudinaryCloudName && config.cloudinaryApiKey && config.cloudinaryApiSecret) }
