// fix_prod_photos.js
// Corrige les photos en base de données Neon qui pointent vers /uploads/ local
// Lance depuis la racine du projet : node fix_prod_photos.js

process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_dLHu8xJw0Yym@ep-curly-smoke-at9x38ym.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'
const { PrismaClient } = require('./node_modules/@prisma/client')
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
