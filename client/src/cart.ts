import type { CartItem } from './types.ts'
export function parseCart(value: string | null): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(value || '[]')
    if (!Array.isArray(parsed)) return []
    const seen = new Set<string>()
    return parsed.filter((item): item is CartItem => {
      if (!item || typeof item.productId !== 'string' || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 999 || seen.has(item.productId)) return false
      seen.add(item.productId); return true
    })
  } catch { return [] }
}
export function addCartItem(items: CartItem[], productId: string, quantity: number, stock: number): CartItem[] {
  const current = items.find(item => item.productId === productId)?.quantity || 0
  if (!Number.isSafeInteger(quantity) || quantity < 1 || current + quantity > stock) throw new Error('Quantidade indisponível em estoque.')
  return current ? items.map(item => item.productId === productId ? { ...item, quantity: current + quantity } : item) : [...items, { productId, quantity }]
}
