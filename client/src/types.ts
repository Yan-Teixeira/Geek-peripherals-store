export interface Variation { id: string; productId: string; type: "Cor" | "Tamanho" | "Capacidade"; value: string; priceInCents: number; stock: number }
export interface Product {
  id: string
  name: string
  variations?: Variation[]
  brand?: string
  model?: string
  category: string
  description: string
  priceInCents: number
  oldPriceInCents?: number
  stock: number
  images: string[]
  badge?: string
  featured?: boolean
  bestseller?: boolean
  specs?: Record<string, string>
}
export type ProductInput = Omit<Product, 'id'>
export interface User { id: string; name: string; email: string; role: 'admin' | 'user' }
export interface CartItem { productId: string; quantity: number }
export interface DeliveryAddress { recipient: string; postalCode: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string }
export interface PaymentSelection { method: 'pix' | 'card' | 'debit' | 'boleto'; installments: number }
export interface CheckoutDetails { address: DeliveryAddress; payment: PaymentSelection }
export interface Order { id: string; userId: string; items: CartItem[]; totalInCents: number; status: string; createdAt: string; checkout?: CheckoutDetails }
export interface Dashboard { totalInCents: number; orderCount: number; averageInCents: number; lowStockCount: number }
