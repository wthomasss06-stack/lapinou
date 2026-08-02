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

// ─── Filigrane logo — même principe que Nexura (lib/useCloudinaryUpload.js),
// adapté à l'upload signé côté backend : au lieu de retoucher l'URL après
// coup, le filigrane est ajouté directement dans la transformation d'upload
// (le rendu final est déjà celui filigrané, pas besoin d'y repenser ailleurs).
//
// Pré-requis (une seule fois) : uploader le logo officiel Chez Florence
// (idéalement une version simple, sans fond sombre) sur Cloudinary dans
// le dossier `lapinou/watermark`. Le `public_id` attendu a été fourni par
// l'utilisateur : `lapinou/watermark/logo_qin1h9`.
// Tant que la ressource overlay existe, elle sera appliquée ; sinon le
// code réessaiera sans filigrane (retry implémenté).
const WATERMARK_PUBLIC_ID = 'lapinou/watermark/logo_qin1h9'
const WATERMARK_OVERLAY = WATERMARK_PUBLIC_ID.replace(/\//g, ':')

const WATERMARK_TRANSFORM = {
  overlay: WATERMARK_OVERLAY,
  // Augmenter la largeur et l'opacité pour une meilleure lisibilité
  width: 220,
  opacity: 45,
  // Positionner le filigrane dans le coin inférieur droit avec un offset
  gravity: 'south_east',
  x: 24,
  y: 24,
  flags: 'layer_apply',
}

// ─── Upload d'un buffer image (depuis multer memoryStorage) ──────────────────
function uploadBuffer(buffer, originalname) {
  // Try uploading with watermark; if the watermark resource is missing,
  // retry without it to avoid failing the whole upload.
  function doUpload(transformations) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: FOLDER,
          resource_type: 'image',
          transformation: transformations,
        },
        (err, result) => {
          if (err) return reject(err)
          resolve(result)
        }
      )
      stream.end(buffer)
    })
  }

  const baseTransforms = [{ quality: 'auto', fetch_format: 'auto' }]
  const withWatermark = baseTransforms.concat(WATERMARK_TRANSFORM)

  return doUpload(withWatermark).catch(async err => {
    const msg = err && err.message ? String(err.message) : ''
    if (msg.includes('Resource not found') || msg.includes('Unknown or invalid referenced image')) {
      console.warn('[cloudinary] Watermark resource missing, retrying without watermark')
      return doUpload(baseTransforms)
    }
    throw err
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
