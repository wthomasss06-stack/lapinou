// api/scripts/fix-prod-photos.js
// Corrige les photos en base de données Neon qui pointent vers /uploads/ local
// Lance depuis le dossier api/ : node scripts/fix-prod-photos.js

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

// Charger les variables de production en priorité (depuis la racine du projet, deux niveaux au-dessus)
const envProdPath = path.resolve(__dirname, '../../.env.production')
const envDevPath = path.resolve(__dirname, '../../.env')

if (fs.existsSync(envProdPath)) {
  loadEnvFile(envProdPath)
} else if (fs.existsSync(envDevPath)) {
  loadEnvFile(envDevPath)
}

if (!process.env.DATABASE_URL) {
  console.error("❌ Erreur : DATABASE_URL n'est pas définie. Veuillez créer un fichier .env.production ou .env à la racine.")
  process.exit(1)
}

const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()



const PHOTO_FIXES = {
  'noisette-belier-nain': [
    { position: 0, isMain: true,  url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80' },
    { position: 1, isMain: false, url: 'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=800&q=80' },
  ],
  'grisou-rex': [
    { position: 0, isMain: true,  url: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=800&q=80' },
  ],
  'cannelle-angora': [
    { position: 0, isMain: true,  url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80' },
    { position: 1, isMain: false, url: 'https://images.unsplash.com/photo-1516598540642-e8f40a09d939?w=800&q=80' },
  ],
  'loulou-hollandais': [
    { position: 0, isMain: true,  url: 'https://images.unsplash.com/photo-1573588028698-f4759befb09a?w=800&q=80' },
  ],
}

async function main() {
  console.log('🔧 Fixing production photos in Neon...')

  for (const [slug, photos] of Object.entries(PHOTO_FIXES)) {
    const rabbit = await prisma.rabbit.findUnique({ where: { slug }, include: { photos: true } })
    if (!rabbit) { console.log(`  ⚠ ${slug} not found, skipping`); continue }

    // Delete old local /uploads/ photos only
    const localPhotos = rabbit.photos.filter(p => p.url.startsWith('/uploads/'))
    if (localPhotos.length > 0) {
      await prisma.rabbitPhoto.deleteMany({ where: { id: { in: localPhotos.map(p => p.id) } } })
      console.log(`  🗑  Deleted ${localPhotos.length} local photos for ${slug}`)
    }

    // Insert correct Unsplash photos (only if not already present)
    for (const photo of photos) {
      const exists = rabbit.photos.find(p => p.url === photo.url)
      if (!exists) {
        await prisma.rabbitPhoto.create({ data: { rabbitId: rabbit.id, ...photo } })
      }
    }
    console.log(`  ✓ ${slug} photos fixed`)
  }

  console.log('✅ Toutes les photos de production sont corrigées !')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
