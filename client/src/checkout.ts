import type { CheckoutDetails, DeliveryAddress, PaymentSelection } from './types.ts'
export const states = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
export const paymentNames = { pix: 'Pix', card: 'Cartão de crédito', debit: 'Cartão de débito', boleto: 'Boleto bancário' }
export function formatPostalCode(value: string) { return value.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2') }
export function validateAddress(address: DeliveryAddress): string {
  if (!address.recipient.trim() || !address.street.trim() || !address.number.trim() || !address.neighborhood.trim() || !address.city.trim()) return 'Preencha todos os campos obrigatórios do endereço.'
  if (!/^\d{5}-?\d{3}$/.test(address.postalCode.trim())) return 'Informe um CEP com 8 números.'
  if (!states.includes(address.state)) return 'Selecione um estado válido.'
  return ''
}
export function validatePayment(payment: PaymentSelection): string {
  if (!['pix', 'card', 'debit', 'boleto'].includes(payment.method)) return 'Escolha uma forma de pagamento.'
  if (!Number.isInteger(payment.installments) || payment.installments < 1 || payment.installments > 10 || (payment.method !== 'card' && payment.installments !== 1)) return 'Selecione uma quantidade válida de parcelas.'
  return ''
}
export function validateCheckout(details: CheckoutDetails) { return validateAddress(details.address) || validatePayment(details.payment) }
