export interface Product {
  id: string
  name: string
  category: string
  description: string
  priceInCents: number
  oldPriceInCents?: number
  stock: number
  images: string[]
  badge?: string
  specs?: Record<string, string>
}
export type ProductInput = Omit<Product, 'id'>
export interface User { id: string; name: string; email: string; role: 'admin' | 'user' }
export interface CartItem { productId: string; quantity: number }
export interface Order { id: string; userId: string; items: CartItem[]; totalInCents: number; status: string; createdAt: string }
export interface Dashboard { totalInCents: number; orderCount: number; averageInCents: number; lowStockCount: number }
