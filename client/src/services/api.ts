import { request } from './http'
import type { CartItem, CheckoutDetails, Dashboard, HomeSections, Order, Product, ProductInput, User, Variation } from '../types'

// Não faz fallback silencioso: falhas de backend continuam visíveis no modo API.
export const isDemo = import.meta.env.VITE_DEMO_MODE !== 'false'
const demoModule = isDemo ? import('./demo').then(module => module.demo) : null
const body = (value: unknown) => JSON.stringify(value)
export const api = {
  home: async (): Promise<HomeSections> => demoModule ? (await demoModule).home() : request('/home'),
  recordView: async (id: string): Promise<{ viewsCount: number }> => demoModule ? (await demoModule).recordView(id) : request(`/products/${encodeURIComponent(id)}/views`, { method: 'POST' }),
  weeklyOffer: async (id: string, isWeeklyOffer: boolean): Promise<Product> => demoModule ? (await demoModule).weeklyOffer(id, isWeeklyOffer) : request(`/products/${encodeURIComponent(id)}/weekly-offer`, { method: 'PATCH', body: body({ isWeeklyOffer }) }),
  variations: (id: string): Promise<Variation[]> => request(`/products/${encodeURIComponent(id)}/variations`),
  saveVariation: (productId: string, data: Omit<Variation, 'id' | 'productId'>, id?: string): Promise<Variation> => request(`/products/${encodeURIComponent(productId)}/variations${id ? '/' + encodeURIComponent(id) : ''}`, { method: id ? 'PATCH' : 'POST', body: body(data) }),
  deleteVariation: (productId: string, id: string): Promise<void> => request(`/products/${encodeURIComponent(productId)}/variations/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  products: async (): Promise<Product[]> => demoModule ? (await demoModule).products() : request('/products'),
  me: async (): Promise<User | null> => demoModule ? (await demoModule).me() : request('/auth/me'),
  login: async (email: string, password: string): Promise<User> => demoModule ? (await demoModule).login(email, password) : request('/auth/login', { method: 'POST', body: body({ email, password }) }),
  register: async (name: string, email: string, password: string): Promise<User> => demoModule ? (await demoModule).register(name, email, password) : request('/auth/register', { method: 'POST', body: body({ name, email, password }) }),
  logout: async (): Promise<void> => demoModule ? (await demoModule).logout() : request('/auth/logout', { method: 'POST' }),
  saveProduct: async (data: ProductInput, id?: string): Promise<Product> => demoModule ? (await demoModule).saveProduct(data, id) : request(id ? `/products/${encodeURIComponent(id)}` : '/products', { method: id ? 'PATCH' : 'POST', body: body(data) }),
  deleteProduct: async (id: string): Promise<void> => demoModule ? (await demoModule).deleteProduct(id) : request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createOrder: async (items: CartItem[], checkout: CheckoutDetails): Promise<Order> => demoModule ? (await demoModule).createOrder(items, checkout) : request('/orders', { method: 'POST', body: body({ items, ...checkout }) }),
  orders: async (): Promise<Order[]> => demoModule ? (await demoModule).orders() : request('/orders'),
  dashboard: async (): Promise<Dashboard> => demoModule ? (await demoModule).dashboard() : request('/dashboard'),
}
