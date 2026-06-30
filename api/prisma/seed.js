// api/prisma/seed.js — copie synchrone de prisma/seed.js pour Render
// Lance avec : npx prisma db seed
//
// Modèle "fiche de race en stock" : chaque entrée représente une race/portée
// disponible en plusieurs exemplaires (stock), pas un individu unique nommé.

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// URLs publiques Unsplash pour les photos (fonctionnent en prod sans upload local)
const rabbits = [
  {
    slug: 'belier-nain-fauve',
    name: 'Bélier nain Fauve',
    breed: 'Bélier nain',
    color: 'Fauve',
    gender: 'mixed',
    birthDate: new Date('2025-03-15'),
    weight: 1.2,
    description: "Portée de béliers nains très doux et câlins. Ils adorent être portés et s'entendent très bien avec les enfants. Vaccinés et vermifugés.",
    price: 8000,
    priceNote: 'Vaccination incluse',
    stock: 6,
    photos: [
      { url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80', position: 0, isMain: true },
      { url: 'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=800&q=80', position: 1, isMain: false },
    ]
  },
  {
    slug: 'rex-gris-ardoise',
    name: 'Rex Gris ardoise',
    breed: 'Rex',
    color: 'Gris ardoise',
    gender: 'male',
    birthDate: new Date('2025-01-20'),
    weight: 2.1,
    description: 'Lapins Rex au pelage incroyablement doux. Curieux et joueurs, ils aiment explorer leur environnement. Parfaits pour une famille.',
    price: 10000,
    priceNote: null,
    stock: 3,
    photos: [
      { url: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=800&q=80', position: 0, isMain: true },
    ]
  },
  {
    slug: 'angora-blanc-creme',
    name: 'Angora français Blanc crème',
    breed: 'Angora français',
    color: 'Blanc crème',
    gender: 'female',
    birthDate: new Date('2025-04-01'),
    weight: 1.8,
    description: 'Angoras français avec une fourrure magnifique. Nécessitent un brossage régulier mais sont très affectueux.',
    price: 9000,
    priceNote: 'Kit toilettage offert',
    stock: 4,
    photos: [
      { url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80', position: 0, isMain: true },
      { url: 'https://images.unsplash.com/photo-1516598540642-e8f40a09d939?w=800&q=80', position: 1, isMain: false },
    ]
  },
  {
    slug: 'hollandais-noir-blanc',
    name: 'Hollandais Noir et blanc',
    breed: 'Hollandais',
    color: 'Noir et blanc',
    gender: 'mixed',
    birthDate: new Date('2025-02-10'),
    weight: 1.5,
    description: "Petits hollandais bicolores pleins d'énergie. Ils adorent jouer avec des jouets et apprennent vite les tours.",
    price: 8500,
    priceNote: null,
    stock: 8,
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
        status: rabbit.stock > 0 ? 'available' : 'sold',
        photos: {
          create: photos,
        },
      },
    })
    console.log(`  ✓ ${rabbit.name} (stock: ${rabbit.stock})`)
  }

  console.log('✅ Seed terminé')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
