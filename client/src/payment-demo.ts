export interface DemoCard { number: string; holder: string; expiry: string; cvv: string }
export const emptyCard: DemoCard = { number: '', holder: '', expiry: '', cvv: '' }
export const formatCardNumber = (value: string) => value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
export const formatExpiry = (value: string) => value.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2')
export function validateDemoCard(card: DemoCard, now = new Date()) {
  if (card.number.replace(/\s/g, '') !== '4111111111111111') return 'Use o cartão fictício 4111 1111 1111 1111 para testar. Não informe um cartão real.'
  if (card.holder.trim().length < 3) return 'Informe o nome fictício impresso no cartão.'
  const match = /^(\d{2})\/(\d{2})$/.exec(card.expiry)
  if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) return 'Informe uma validade no formato MM/AA.'
  if (2000 + Number(match[2]) < now.getFullYear() || (2000 + Number(match[2]) === now.getFullYear() && Number(match[1]) < now.getMonth() + 1)) return 'O cartão de teste está vencido. Use uma validade futura.'
  if (!/^\d{3}$/.test(card.cvv)) return 'Informe os 3 dígitos do CVV fictício.'
  return ''
}
export const PIX_LIFETIME_MS = 30 * 60 * 1000
export interface DemoPix { id: string; expiresAt: number; amountInCents: number; cartKey: string }
export function renewDemoPix(current: DemoPix | null, amountInCents: number, cartKey: string, now: number, makeId: () => string): DemoPix {
  if (current && current.expiresAt > now && current.amountInCents === amountInCents && current.cartKey === cartKey) return current
  return { id: makeId(), expiresAt: now + PIX_LIFETIME_MS, amountInCents, cartKey }
}
export function demoPixPayload(pix: DemoPix) {
  return JSON.stringify({ type: 'NEXUS_DEMO_NAO_PAGAVEL', id: pix.id, amountInCents: pix.amountInCents, expiresAt: pix.expiresAt })
}
