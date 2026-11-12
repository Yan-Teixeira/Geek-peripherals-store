import test from 'node:test'
import assert from 'node:assert/strict'
import { validateProduct } from '../src/middlewares/validate.js'
import { validate, serializeVariation } from '../src/controllers/variationController.js'
import { toApiProduct } from '../src/controllers/productController.js'

const validation = (middleware, body, method = 'PATCH') => {
  let result
  middleware({ body, method }, {}, error => { result = error })
  return result
}

test('partial updates preserve omitted fields and validate optional product fields', () => {
  assert.equal(validation(validateProduct, { brand: 'Nexus', model: 'K75', specs: { Cor: 'Preto' } }), undefined)
  assert.equal(validation(validateProduct, { oldPriceInCents: null }), undefined)
  for (const body of [{ brand: 1 }, { model: 'x'.repeat(121) }, { specs: [] }, { specs: { '$bad': 'x' } }, { specs: { Cor: 42 } }, { images: ['javascript:alert(1)'] }, { stock: -1 }, { priceInCents: 1.5 }]) {
    assert.equal(validation(validateProduct, body).status, 400)
  }
  assert.equal(validation(validateProduct, {}, 'POST').status, 400)
})

test('variation values require valid type, value, integer price and stock', () => {
  assert.equal(validation(validate, { type: 'Cor', value: 'Preto', priceInCents: 100, stock: 0 }, 'POST'), undefined)
  assert.equal(validation(validate, { stock: 3 }), undefined)
  for (const body of [{ type: 'Outro' }, { value: ' ' }, { stock: -1 }, { priceInCents: 0 }]) assert.equal(validation(validate, body).status, 400)
})

test('API product response retains brand, model, specs and variation association', () => {
  const variation = serializeVariation({ id: 'v1', productId: 'p1', type: 'Cor', value: 'Preto', priceInCents: 500, stock: 2 })
  const product = toApiProduct({ id: 'p1', name: 'Teclado', brand: 'Nexus', model: 'K75', categoryId: { _id: 'c1', name: 'Teclados' }, specs: new Map([['Cor', 'Preto']]) }, [variation])
  assert.equal(product.brand, 'Nexus')
  assert.equal(product.model, 'K75')
  assert.equal(product.categoryId, 'c1')
  assert.deepEqual(product.specs, { Cor: 'Preto' })
  assert.equal(product.variations[0].productId, 'p1')
})
