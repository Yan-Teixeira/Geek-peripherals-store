import { request } from './http'
import type { CartItem, Dashboard, Order, Product, ProductInput, User } from '../types'

// Não faz fallback silencioso: falhas de backend continuam visíveis no modo API.
export const isDemo = import.meta.env.VITE_DEMO_MODE !== 'false'
const demoModule = isDemo ? import('./demo').then(module => module.demo) : null
const body = (value: unknown) => JSON.stringify(value)
export const api = {
  products: async (): Promise<Product[]> => demoModule ? (await demoModule).products() : request('/products'),
  me: async (): Promise<User | null> => demoModule ? (await demoModule).me() : request('/auth/me'),
  login: async (email: string, password: string): Promise<User> => demoModule ? (await demoModule).login(email, password) : request('/auth/login', { method: 'POST', body: body({ email, password }) }),
  register: async (name: string, email: string, password: string): Promise<User> => demoModule ? (await demoModule).register(name, email, password) : request('/auth/register', { method: 'POST', body: body({ name, email, password }) }),
  logout: async (): Promise<void> => demoModule ? (await demoModule).logout() : request('/auth/logout', { method: 'POST' }),
  saveProduct: async (data: ProductInput, id?: string): Promise<Product> => demoModule ? (await demoModule).saveProduct(data, id) : request(id ? `/products/${encodeURIComponent(id)}` : '/products', { method: id ? 'PATCH' : 'POST', body: body(data) }),
  deleteProduct: async (id: string): Promise<void> => demoModule ? (await demoModule).deleteProduct(id) : request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createOrder: async (items: CartItem[]): Promise<Order> => demoModule ? (await demoModule).createOrder(items) : request('/orders', { method: 'POST', body: body({ items }) }),
  orders: async (): Promise<Order[]> => demoModule ? (await demoModule).orders() : request('/orders'),
  dashboard: async (): Promise<Dashboard> => demoModule ? (await demoModule).dashboard() : request('/dashboard'),
}
