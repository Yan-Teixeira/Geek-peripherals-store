import test from 'node:test'
import assert from 'node:assert/strict'
import Product from '../src/models/Product.js'
import OrderItem from '../src/models/OrderItem.js'
import { home, recordView, weeklyOffer, confirmedStatuses } from '../src/controllers/homeController.js'
import { requireAuth, requireAdmin } from '../src/middlewares/auth.js'

function response() { return { body: null, set() { return this }, json(value) { this.body = value; return this } } }
function product(id) { return { id, name: id, categoryId: { name: 'Teclados' }, priceInCents: 100, stock: 2, images: [], specs: new Map() } }
function query(value) { return { sort() { return this }, limit() { return this }, populate() { return Promise.resolve(value) } } }

test('visita anônima e administração por cliente são negadas', async () => {
  let error
  await requireAuth({ cookies: {} }, {}, value => { error = value })
  assert.equal(error.status, 401)
  requireAdmin({ user: { role: 'user' } }, {}, value => { error = value })
  assert.equal(error.status, 403)
  let allowed = false
  requireAdmin({ user: { role: 'admin' } }, {}, () => { allowed = true })
  assert.equal(allowed, true)
})
test('visita usa incremento atômico apenas em produto ativo', async t => {
  t.mock.method(Product, 'findOneAndUpdate', async (filter, change) => {
    assert.deepEqual(filter, { _id: 'p1', active: true })
    assert.deepEqual(change, { $inc: { viewsCount: 1 } })
    return { viewsCount: 6 }
  })
  const res = response()
  await recordView({ params: { id: 'p1' } }, res)
  assert.equal(res.body.viewsCount, 6)
})
test('oferta rejeita strings em vez de convertê-las em booleanos', async () => {
  await assert.rejects(weeklyOffer({ body: { isWeeklyOffer: 'false' }, params: {} }, response()), { status: 400 })
})
test('oferta modifica somente a flag', async t => {
  t.mock.method(Product, 'findByIdAndUpdate', (id, update) => {
    assert.equal(id, 'p1'); assert.deepEqual(update, { $set: { isWeeklyOffer: false } })
    return query(product(id))
  })
  const res = response()
  await weeklyOffer({ params: { id: 'p1' }, body: { isWeeklyOffer: false, viewsCount: 999 } }, res)
  assert.equal(res.body.isWeeklyOffer, false)
})
for (const count of [0, 1, 2]) test(`home: ${count} produtos distintos vendidos`, async t => {
  let calls = 0
  t.mock.method(Product, 'find', filter => {
    calls++
    assert.equal(filter.active, true)
    if (calls === 2) assert.equal(filter.isWeeklyOffer, true)
    return query(calls === 3 ? [product('b'), product('a')] : [])
  })
  t.mock.method(OrderItem, 'aggregate', async pipeline => {
    assert.deepEqual(confirmedStatuses, ['Pago', 'Enviado', 'Entregue'])
    assert.deepEqual(pipeline[2].$match['order.status'].$in, confirmedStatuses)
    assert.deepEqual(pipeline[3].$group, { _id: '$productId', unitsSold: { $sum: '$quantity' } })
    return [{ total: count ? [{ count }] : [], top: [{ _id: 'a', unitsSold: 12 }, { _id: 'b', unitsSold: 4 }].slice(0, count) }]
  })
  const res = response()
  await home({}, res)
  assert.equal(res.body.distinctSoldProducts, count)
  assert.deepEqual(res.body.bestsellers.map(p => p.id), count >= 2 ? ['a', 'b'] : [])
  assert.equal(calls, count >= 2 ? 3 : 2)
})
