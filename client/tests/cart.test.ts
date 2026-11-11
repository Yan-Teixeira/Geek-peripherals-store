import test from 'node:test'
import assert from 'node:assert/strict'
import { addCartItem, parseCart } from '../src/cart.ts'

test('recupera carrinho inválido sem derrubar a interface', () => {
  assert.deepEqual(parseCart('{'), [])
  assert.deepEqual(parseCart('{"productId":"1"}'), [])
  assert.deepEqual(parseCart('[{"productId":"1","quantity":-2},{"productId":"2","quantity":2},{"productId":"2","quantity":3}]'), [{ productId: '2', quantity: 2 }])
})
test('soma quantidades do mesmo produto e mantém os outros itens', () => {
  const initial = [{ productId: '1', quantity: 2 }, { productId: '2', quantity: 1 }]
  assert.deepEqual(addCartItem(initial, '1', 3, 5), [{ productId: '1', quantity: 5 }, initial[1]])
  assert.equal(initial[0].quantity, 2)
})
test('não permite exceder estoque nem adicionar quantidades inválidas', () => {
  assert.throws(() => addCartItem([{ productId: '1', quantity: 2 }], '1', 2, 3))
  for (const quantity of [0, -1, 1.5, NaN]) assert.throws(() => addCartItem([], '1', quantity, 5))
  assert.throws(() => addCartItem([], '1', 1, 0))
})
