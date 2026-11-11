import { seedProducts } from '../data/products'
import type { CartItem, CheckoutDetails, Dashboard, Order, Product, ProductInput, User } from '../types'
import { validateCheckout } from '../checkout'
import { ApiError } from './http'

// Somente demonstração local. Não representa autenticação ou autorização seguras.
let products: Product[] = structuredClone(seedProducts)
let orders: Order[] = []
let session: User | null = null
const accounts = [
  { user: { id: 'admin-demo', name: 'Admin Nexus', email: 'admin@nexus.demo', role: 'admin' } as User, password: 'Nexus123!' },
  { user: { id: 'user-demo', name: 'Cliente Nexus', email: 'cliente@nexus.demo', role: 'user' } as User, password: 'Nexus123!' },
]
const delay = () => new Promise(resolve => setTimeout(resolve, 250))
function requireUser() { if (!session) throw new ApiError('Entre na sua conta para continuar.', 401); return session }
function requireAdmin() { if (requireUser().role !== 'admin') throw new ApiError('Acesso exclusivo para administradores.', 403) }
function validateProduct(data: ProductInput) {
  if (!data.name.trim() || !data.category.trim() || !Number.isSafeInteger(data.priceInCents) || data.priceInCents <= 0 || !Number.isSafeInteger(data.stock) || data.stock < 0 || !data.images.length) throw new Error('Preencha os dados do produto com preço e estoque válidos.')
}

export const demo = {
  async products() { await delay(); return structuredClone(products) },
  async me() { await delay(); return session },
  async login(email: string, password: string) {
    await delay()
    const account = accounts.find(a => a.user.email === email.trim().toLowerCase() && a.password === password)
    if (!account) throw new ApiError('E-mail ou senha incorretos.', 401)
    session = { ...account.user }; return session
  },
  async register(name: string, email: string, password: string) {
    await delay()
    email = email.trim().toLowerCase()
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) throw new Error('Informe nome, e-mail válido e senha de pelo menos 8 caracteres.')
    if (accounts.some(a => a.user.email === email)) throw new ApiError('Este e-mail já está cadastrado.', 409)
    const user: User = { id: crypto.randomUUID(), name: name.trim(), email, role: 'user' }
    accounts.push({ user, password }); return user
  },
  async logout() { await delay(); session = null },
  async saveProduct(data: ProductInput, id?: string) {
    await delay(); requireAdmin(); validateProduct(data)
    const product = { ...data, id: id || crypto.randomUUID() }
    if (id && !products.some(p => p.id === id)) throw new ApiError('Produto não encontrado.', 404)
    products = id ? products.map(p => p.id === id ? product : p) : [...products, product]
    return structuredClone(product)
  },
  async deleteProduct(id: string) { await delay(); requireAdmin(); products = products.filter(p => p.id !== id) },
  async createOrder(items: CartItem[], checkout: CheckoutDetails) {
    await delay(); const user = requireUser()
    const validation = validateCheckout(checkout)
    if (validation) throw new Error(validation)
    if (!items.length) throw new Error('O carrinho está vazio.')
    let totalInCents = 0
    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > product.stock) throw new Error('Estoque indisponível. Revise o carrinho.')
      totalInCents += product.priceInCents * item.quantity
    }
    for (const item of items) products.find(p => p.id === item.productId)!.stock -= item.quantity
    const order: Order = { id: crypto.randomUUID(), userId: user.id, items: structuredClone(items), totalInCents, status: 'Aguardando pagamento (simulado)', createdAt: new Date().toISOString(), checkout: structuredClone(checkout) }
    orders.push(order); return structuredClone(order)
  },
  async orders() { await delay(); const user = requireUser(); return structuredClone(orders.filter(o => o.userId === user.id)) },
  async dashboard(): Promise<Dashboard> {
    await delay(); requireAdmin()
    const totalInCents = orders.reduce((sum, order) => sum + order.totalInCents, 0)
    return { totalInCents, orderCount: orders.length, averageInCents: orders.length ? Math.round(totalInCents / orders.length) : 0, lowStockCount: products.filter(p => p.stock < 10).length }
  },
}
