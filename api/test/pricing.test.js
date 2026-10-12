// api/test/pricing.test.js — lancer avec : npm test
// Couvre le calcul du prix au kilo (chemin financier critique) et son
// branchement dans rabbits.service (création / mise à jour admin).
const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')

// ─── Stub Prisma : aucun accès DB, on capture ce qui serait écrit ───────────
const calls = []
const fakePrisma = {
  rabbit: {
    create: async (args) => { calls.push({ op: 'create', ...args }); return { id: 'r1', ...args.data } },
    update: async (args) => { calls.push({ op: 'update', ...args }); return { id: args.where.id, ...args.data } },
  },
}
const prismaPath = require.resolve(path.join('..', 'src', 'config', 'prisma'))
require.cache[prismaPath] = { id: prismaPath, filename: prismaPath, loaded: true, exports: fakePrisma }

delete process.env.PRICE_PER_KG // on teste le tarif par défaut : 6 000 FCFA/kg
const pricing = require('../src/lib/pricing')
const svc = require('../src/services/rabbits.service')

test.beforeEach(() => { calls.length = 0 })

// ─── lib/pricing ────────────────────────────────────────────────────────────
test('tarif par défaut : 6 000 FCFA / kg', () => {
  assert.equal(pricing.PRICE_PER_KG, 6000)
})

test('prix = poids × 6 000 FCFA', () => {
  assert.equal(pricing.priceForWeight(1.5), 9000)
  assert.equal(pricing.priceForWeight(2), 12000)
  assert.equal(pricing.priceForWeight(9), 54000)
})

test('PRICE_PER_KG surchargeable par variable d\'environnement, valeurs invalides ignorées', () => {
  assert.equal(pricing.resolvePricePerKg('6500'), 6500)
  for (const bad of ['', 'abc', '0', '-5', undefined]) {
    assert.equal(pricing.resolvePricePerKg(bad), 6000)
  }
})

test('bornes du simulateur 1 → 3 kg, sans artefact flottant', () => {
  assert.equal(pricing.priceForWeight(1), 6000)
  assert.equal(pricing.priceForWeight(3), 18000)
  assert.equal(pricing.priceForWeight(1.1), 6600)
  assert.equal(pricing.priceForWeight(2.3), 13800)
  for (let tenth = 10; tenth <= 30; tenth++) {
    const price = pricing.priceForWeight(tenth / 10)
    assert.ok(Number.isInteger(price), `prix entier pour ${tenth / 10} kg`)
    assert.equal(price, tenth * 600)
  }
})

test('parseWeightKg : virgule, point, vide, invalide, hors bornes', () => {
  assert.equal(pricing.parseWeightKg('1,5'), 1.5)
  assert.equal(pricing.parseWeightKg('1.5'), 1.5)
  assert.equal(pricing.parseWeightKg(2), 2)
  assert.equal(pricing.parseWeightKg(''), null)
  assert.equal(pricing.parseWeightKg(null), null)
  assert.equal(pricing.parseWeightKg(undefined), null)
  for (const bad of ['abc', 0, -1, 16, NaN]) {
    assert.throws(() => pricing.parseWeightKg(bad), (err) => err.status === 400, `rejette ${String(bad)}`)
  }
})

test('applyWeightPricing : le poids écrase le prix envoyé par le client', () => {
  const out = pricing.applyWeightPricing({ weight: '1,5', price: 1 })
  assert.equal(out.weight, 1.5)
  assert.equal(out.price, 9000)
})

test('applyWeightPricing : sans clé weight (PATCH partiel) rien ne bouge', () => {
  const data = { name: 'Rex', price: 9000 }
  assert.deepEqual(pricing.applyWeightPricing(data), data)
})

test('applyWeightPricing : poids vidé → prix manuel conservé', () => {
  const out = pricing.applyWeightPricing({ weight: '', price: 9000 })
  assert.equal(out.weight, null)
  assert.equal(out.price, 9000)
})

// ─── rabbits.service ────────────────────────────────────────────────────────
test('create : poids saisi → prix déduit côté serveur (prix client ignoré)', async () => {
  await svc.create({ name: 'Rex', slug: 'rex-1', breed: 'Rex', color: 'Gris', gender: 'male', weight: 2, price: 1, stock: 4 })
  assert.equal(calls[0].data.price, 12000)
  assert.equal(calls[0].data.weight, 2)
  assert.equal(calls[0].data.status, 'available')
})

test('create : sans poids, le prix manuel est utilisé', async () => {
  await svc.create({ name: 'Rex', slug: 'rex-2', breed: 'Rex', color: 'Gris', gender: 'male', price: '9000', stock: 1 })
  assert.equal(calls[0].data.price, 9000)
})

test('create : ni poids ni prix → erreur 400 claire', async () => {
  await assert.rejects(
    svc.create({ name: 'Rex', slug: 'rex-3', breed: 'Rex', color: 'Gris', gender: 'male', stock: 1 }),
    (err) => err.status === 400 && /poids/i.test(err.message)
  )
  assert.equal(calls.length, 0)
})

test('create : poids invalide → erreur 400, rien n\'est écrit', async () => {
  await assert.rejects(
    svc.create({ name: 'Rex', slug: 'rex-4', breed: 'Rex', color: 'Gris', gender: 'male', weight: 'beaucoup', stock: 1 }),
    (err) => err.status === 400
  )
  assert.equal(calls.length, 0)
})

test('update : nouveau poids → prix recalculé', async () => {
  await svc.update('r1', { weight: 1.5, price: 99999 })
  assert.equal(calls[0].data.price, 9000)
})

test('update : modification sans poids → le prix n\'est pas touché', async () => {
  await svc.update('r1', { description: 'plus doux' })
  assert.equal('price' in calls[0].data, false)
})
