import { createContext, useContext, useEffect, useState } from 'react'
import type { CartItem } from '../types'
import { useCatalog } from './CatalogContext'
import { addCartItem, parseCart } from '../cart'
const CartContext = createContext<{ items: CartItem[]; add: (id: string, quantity?: number) => void; setQuantity: (id: string, quantity: number) => void; remove: (id: string) => void; clear: () => void } | null>(null)
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { products } = useCatalog()
  const [items, setItems] = useState<CartItem[]>(() => { try { return parseCart(localStorage.getItem('nexus:cart:v1')) } catch { return [] } })
  useEffect(() => { try { localStorage.setItem('nexus:cart:v1', JSON.stringify(items)) } catch { /* Carrinho segue disponível em memória. */ } }, [items])
  function add(id: string, quantity = 1) {
    const product = products.find(p => p.id === id)
    if (!product) throw new Error('Produto indisponível.')
    setItems(addCartItem(items, id, quantity, product.stock))
  }
  function setQuantity(id: string, quantity: number) {
    const stock = products.find(p => p.id === id)?.stock || 0
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > stock) throw new Error('Quantidade indisponível em estoque.')
    setItems(current => current.map(item => item.productId === id ? { ...item, quantity } : item))
  }
  return <CartContext.Provider value={{ items, add, setQuantity, remove: id => setItems(current => current.filter(item => item.productId !== id)), clear: () => setItems([]) }}>{children}</CartContext.Provider>
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('CartProvider ausente'); return context }
