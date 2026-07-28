// api/scripts/upload-images-to-cloudinary.js
// Upload tout le contenu de web/public/IMAGES/ vers Cloudinary, en conservant
// exactement la même arborescence (donc les mêmes public_id que les chemins
// locaux utilisés jusqu'ici) — rien à mapper à la main, le nom de fichier
// suffit. C'est l'exact miroir de ce que web/lib/cloudinary.js attend.
//
// Lance depuis le dossier api/ :
//   node scripts/upload-images-to-cloudinary.js
//
// Pré-requis : CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
// dans le .env à la racine du projet (déjà présentes — mêmes clés que pour
// les photos de lapins. Tu peux garder la clé "Racine" actuelle, ou la
// remplacer par la nouvelle clé "chez Florence" créée dans le dashboard
// Cloudinary si tu préfères séparer — les deux fonctionnent, même cloud).
//
// Sûr à relancer plusieurs fois : les public_id sont déterministes (basés
// sur le nom de fichier), donc un second passage écrase/rafraîchit les mêmes
// assets au lieu d'en créer des doublons.

const path = require('path')
const fs = require('fs')

function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    content.split(/\r?\n/).forEach(line => {
      line = line.trim()
      if (!line || line.startsWith('#')) return
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        let val = match[2].trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1)
        }
        process.env[key] = val
      }
    })
  }
}

const envProdPath = path.resolve(__dirname, '../../.env.production')
const envDevPath = path.resolve(__dirname, '../../.env')

if (fs.existsSync(envProdPath)) {
  loadEnvFile(envProdPath)
} else if (fs.existsSync(envDevPath)) {
  loadEnvFile(envDevPath)
}

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Variables CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET manquantes.")
  console.error("   Vérifie ton .env à la racine du projet (rabbit-shop/.env).")
  process.exit(1)
}

const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Doit rester identique à BASE_FOLDER dans web/lib/cloudinary.js.
const BASE_FOLDER = 'chez-florence/IMAGES'
const SOURCE_DIR = path.resolve(__dirname, '../../web/public/IMAGES')
const VIDEO_EXT = new Set(['.webm', '.mp4', '.mov'])

function walk(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      files = files.concat(walk(full, rel))
    } else if (!entry.name.startsWith('.')) {
      files.push({ full, rel })
    }
  }
  return files
}

async function uploadOne({ full, rel }) {
  const ext = path.extname(rel).toLowerCase()
  const withoutExt = rel.slice(0, -ext.length)
  const publicId = `${BASE_FOLDER}/${withoutExt}`
  const isVideo = VIDEO_EXT.has(ext)

  const options = {
    public_id: publicId,
    resource_type: isVideo ? 'video' : 'image',
    overwrite: true,
    invalidate: true,
  }

  // Pré-génère une version optimisée en arrière-plan pour les vidéos —
  // évite l'erreur "too large to process synchronously" au tout premier
  // visiteur si un des .webm est un peu lourd.
  if (isVideo) {
    options.eager = [{ fetch_format: 'auto', quality: 'auto' }]
    options.eager_async = true
  }

  return cloudinary.uploader.upload(full, options)
}

async function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Dossier introuvable : ${SOURCE_DIR}`)
    console.error("   Ce script doit être lancé depuis TON projet réel (celui qui contient")
    console.error("   web/public/IMAGES avec les vrais fichiers) — pas depuis un zip livré par Claude.")
    process.exit(1)
  }

  const files = walk(SOURCE_DIR)
  if (files.length === 0) {
    console.error(`❌ Aucun fichier trouvé dans ${SOURCE_DIR}`)
    process.exit(1)
  }

  console.log(`📁 ${files.length} fichier(s) trouvé(s) dans web/public/IMAGES`)
  console.log(`☁️  Cloud : ${process.env.CLOUDINARY_CLOUD_NAME} — dossier cible : ${BASE_FOLDER}\n`)

  let ok = 0
  let fail = 0

  for (const file of files) {
    try {
      await uploadOne(file)
      console.log(`  ✓ ${file.rel}`)
      ok++
    } catch (err) {
      console.error(`  ✗ ${file.rel} — ${err.message}`)
      fail++
    }
  }

  console.log(`\n${fail === 0 ? '✅' : '⚠️ '} Terminé : ${ok} envoyé(s), ${fail} échec(s).`)
  if (fail > 0) process.exitCode = 1
}

main()
