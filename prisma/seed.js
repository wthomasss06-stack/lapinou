// prisma/seed.js
// Lance avec : npx prisma db seed

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// URLs publiques Unsplash pour les photos (fonctionnent en prod sans upload local)
const rabbits = [
  {
    slug: 'noisette-belier-nain',
    name: 'Noisette',
    breed: 'Bélier nain',
    color: 'Fauve',
    gender: 'female',
    birthDate: new Date('2025-03-15'),
    weight: 1.2,
    description: "Noisette est une petite bélier nain très douce et câline. Elle adore être portée et s'entend très bien avec les enfants. Vaccinée et vermifugée.",
    price: 8000,
    priceNote: 'Vaccination incluse',
    status: 'available',
    photos: [
      { url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80', position: 0, isMain: true },
      { url: 'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=800&q=80', position: 1, isMain: false },
    ]
  },
  {
    slug: 'grisou-rex',
    name: 'Grisou',
    breed: 'Rex',
    color: 'Gris ardoise',
    gender: 'male',
    birthDate: new Date('2025-01-20'),
    weight: 2.1,
    description: 'Grisou est un Rex au pelage incroyablement doux. Curieux et joueur, il aime explorer son environnement. Parfait pour une famille.',
    price: 10000,
    priceNote: null,
    status: 'available',
    photos: [
      { url: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=800&q=80', position: 0, isMain: true },
    ]
  },
  {
    slug: 'cannelle-angora',
    name: 'Cannelle',
    breed: 'Angora français',
    color: 'Blanc crème',
    gender: 'female',
    birthDate: new Date('2025-04-01'),
    weight: 1.8,
    description: 'Cannelle est un Angora français avec une fourrure magnifique. Elle nécessite un brossage régulier mais est très affectueuse.',
    price: 9000,
    priceNote: 'Kit toilettage offert',
    status: 'available',
    photos: [
      { url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80', position: 0, isMain: true },
      { url: 'https://images.unsplash.com/photo-1516598540642-e8f40a09d939?w=800&q=80', position: 1, isMain: false },
    ]
  },
  {
    slug: 'loulou-hollandais',
    name: 'Loulou',
    breed: 'Hollandais',
    color: 'Noir et blanc',
    gender: 'male',
    birthDate: new Date('2025-02-10'),
    weight: 1.5,
    description: "Loulou est un petit hollandais bicolore plein d'énergie. Il adore jouer avec des jouets et apprend vite les tours.",
    price: 8500,
    priceNote: null,
    status: 'available',
    photos: [
      { url: 'https://images.unsplash.com/photo-1573588028698-f4759befb09a?w=800&q=80', position: 0, isMain: true },
    ]
  },
]

async function main() {
  console.log('🐇 Seeding rabbit-shop…')

  for (const { photos, ...rabbit } of rabbits) {
    const existing = await prisma.rabbit.findUnique({ where: { slug: rabbit.slug } })

    if (existing) {
      console.log(`  ↩ ${rabbit.name} déjà présent, skip`)
      continue
    }

    await prisma.rabbit.create({
      data: {
        ...rabbit,
        photos: {
          create: photos,
        },
      },
    })
    console.log(`  ✓ ${rabbit.name} (${rabbit.status})`)
  }

  console.log('✅ Seed terminé')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
