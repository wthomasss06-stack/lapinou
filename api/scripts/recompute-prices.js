// api/scripts/recompute-prices.js
// Recalcule le prix des fiches EXISTANTES à partir de leur poids (tarif au kilo).
//
//   npm run prices:sync            → simulation (n'écrit rien, affiche le détail)
//   npm run prices:sync -- --apply → applique réellement les nouveaux prix
//
// Les fiches sans poids ne sont jamais touchées (leur prix reste manuel).
// À lancer UNE fois après le passage au tarif unique, avec le DATABASE_URL de
// la base visée (en prod : depuis le shell Render, pas depuis ton poste).

require('../src/config/env')
const prisma = require('../src/config/prisma')
const { PRICE_PER_KG, priceForWeight } = require('../src/lib/pricing')

const apply = process.argv.includes('--apply')

async function main() {
  const rabbits = await prisma.rabbit.findMany({
    where: { weight: { not: null } },
    select: { id: true, name: true, weight: true, price: true },
    orderBy: { name: 'asc' },
  })

  console.log(`Tarif : ${PRICE_PER_KG} FCFA/kg — ${rabbits.length} fiche(s) avec poids\n`)

  let changed = 0
  for (const r of rabbits) {
    const next = priceForWeight(r.weight)
    if (next === r.price) {
      console.log(`  = ${r.name} (${r.weight} kg) : ${r.price} FCFA déjà à jour`)
      continue
    }
    changed++
    console.log(`  ${apply ? '✓' : '~'} ${r.name} (${r.weight} kg) : ${r.price} → ${next} FCFA`)
    if (apply) {
      await prisma.rabbit.update({ where: { id: r.id }, data: { price: next } })
    }
  }

  console.log(apply
    ? `\n✅ ${changed} fiche(s) mise(s) à jour.`
    : `\nSimulation terminée : ${changed} fiche(s) seraient modifiées. Relance avec --apply pour écrire.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
