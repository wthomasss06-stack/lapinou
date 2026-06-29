// prisma/seed.js
// Lance avec : npx prisma db seed

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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
    price: 35000,
    priceNote: 'Vaccination incluse',
    status: 'available',
    photos: {
      create: [
        { url: '/uploads/noisette-1.jpg', position: 0, isMain: true },
        { url: '/uploads/noisette-2.jpg', position: 1, isMain: false },
      ],
    },
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
    price: 45000,
    priceNote: null,
    status: 'reserved', // déjà réservé → grisé dans l'UI
    photos: {
      create: [
        { url: '/uploads/grisou-1.jpg', position: 0, isMain: true },
      ],
    },
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
    price: 55000,
    priceNote: 'Kit toilettage offert',
    status: 'available',
    photos: {
      create: [
        { url: '/uploads/cannelle-1.jpg', position: 0, isMain: true },
        { url: '/uploads/cannelle-2.jpg', position: 1, isMain: false },
        { url: '/uploads/cannelle-3.jpg', position: 2, isMain: false },
      ],
    },
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
    price: 30000,
    priceNote: null,
    status: 'sold',
    photos: {
      create: [
        { url: '/uploads/loulou-1.jpg', position: 0, isMain: true },
      ],
    },
  },
]

async function main() {
  console.log('🐇 Seeding rabbit-shop…')

  for (const rabbit of rabbits) {
    await prisma.rabbit.upsert({
      where: { slug: rabbit.slug },
      update: {},
      create: rabbit,
    })
    console.log(`  ✓ ${rabbit.name} (${rabbit.status})`)
  }

  console.log('✅ Seed terminé')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
