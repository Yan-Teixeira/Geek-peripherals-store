import test from 'node:test'
import assert from 'node:assert/strict'
import { validateAddress, validateCheckout, validatePayment } from '../src/checkout.ts'
const address = { recipient: 'Cliente Teste', postalCode: '69000-000', street: 'Rua de Teste', number: '10', complement: '', neighborhood: 'Centro', city: 'Manaus', state: 'AM' }
test('exige endereço completo, CEP e UF válidos', () => {
  assert.equal(validateAddress(address), '')
  assert.equal(validateAddress({ ...address, postalCode: '69000000' }), '')
  for (const field of ['recipient','street','number','neighborhood','city'] as const) assert.ok(validateAddress({ ...address, [field]: ' ' }))
  assert.ok(validateAddress({ ...address, postalCode: '123' }))
  assert.ok(validateAddress({ ...address, state: 'ZZ' }))
})
test('permite parcelas apenas para cartão', () => {
  assert.equal(validatePayment({ method: 'card', installments: 10 }), '')
  assert.equal(validatePayment({ method: 'pix', installments: 1 }), '')
  assert.equal(validatePayment({ method: 'boleto', installments: 1 }), '')
  assert.ok(validatePayment({ method: 'pix', installments: 2 }))
  assert.ok(validatePayment({ method: 'card', installments: 11 }))
})
test('valida ambos os dados antes de registrar pedido', () => {
  assert.equal(validateCheckout({ address, payment: { method: 'pix', installments: 1 } }), '')
  assert.ok(validateCheckout({ address: { ...address, recipient: '' }, payment: { method: 'pix', installments: 1 } }))
})
