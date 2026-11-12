import Product from '../models/Product.js'
import Category from '../models/Category.js'
import OrderItem from '../models/OrderItem.js'
import CartItem from '../models/CartItem.js'
import Variation from '../models/Variation.js'
import { HttpError } from '../utils/httpError.js'

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
async function findOrCreateCategory(name) {
  const clean = name.trim()
  const slug = slugify(clean)
  let category = await Category.findOne({ slug })
  if (!category) {
    try { category = await Category.create({ name: clean, slug }) }
    catch (error) { if (error.code !== 11000) throw error; category = await Category.findOne({ slug }) }
  }
  return category
}
export function toApiProduct(product) {
  return {
    id: product.id,
    viewsCount: product.viewsCount || 0,
    isWeeklyOffer: product.isWeeklyOffer === true,
    name: product.name,
    category: product.categoryId?.name || '',
    description: product.description,
    priceInCents: product.priceInCents,
    ...(product.oldPriceInCents ? { oldPriceInCents: product.oldPriceInCents } : {}),
    stock: product.stock,
    images: product.images,
    ...(product.badge ? { badge: product.badge } : {}),
    specs: product.specs instanceof Map ? Object.fromEntries(product.specs) : (product.specs || {}),
  }
}
const populateCategory = query => query.populate('categoryId', 'name slug')

export async function list(req, res) {
  const filter = req.user?.role === 'admin' ? {} : { active: true }
  if (req.query.category) {
    const categoryName = String(req.query.category).slice(0, 60)
    const category = await Category.findOne({ $or: [{ slug: slugify(categoryName) }, { name: new RegExp(`^${categoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }] })
    if (!category) return res.json([])
    filter.categoryId = category._id
  }
  if (req.query.q) filter.$text = { $search: String(req.query.q).slice(0, 100) }
  const products = await populateCategory(Product.find(filter).sort({ createdAt: -1 }))
  res.json(products.map(toApiProduct))
}
export async function get(req, res) {
  const product = await populateCategory(Product.findOne({ _id: req.params.id, active: true }))
  if (!product) throw new HttpError(404, 'Produto não encontrado.')
  res.json(toApiProduct(product))
}
export async function create(req, res) {
  const category = await findOrCreateCategory(req.body.category)
  const product = await Product.create({
    name: req.body.name.trim(), categoryId: category._id,
    brand: typeof req.body.brand === 'string' ? req.body.brand.trim() : '',
    model: typeof req.body.model === 'string' ? req.body.model.trim() : '',
    description: req.body.description.trim(), priceInCents: req.body.priceInCents,
    oldPriceInCents: req.body.oldPriceInCents, stock: req.body.stock,
    isWeeklyOffer: req.body.isWeeklyOffer === true,
    images: req.body.images, badge: req.body.badge, specs: req.body.specs || {},
  })
  await product.populate('categoryId', 'name slug')
  res.status(201).json(toApiProduct(product))
}
export async function update(req, res) {
  const product = await Product.findById(req.params.id)
  if (!product) throw new HttpError(404, 'Produto não encontrado.')
  const data = req.body
  if (data.category !== undefined) product.categoryId = (await findOrCreateCategory(data.category))._id
  for (const key of ['name', 'description', 'priceInCents', 'oldPriceInCents', 'stock', 'images', 'badge', 'specs', 'active', 'brand', 'model', 'isWeeklyOffer']) {
    if (data[key] !== undefined) product[key] = data[key]
  }
  await product.save()
  await product.populate('categoryId', 'name slug')
  res.json(toApiProduct(product))
}
export async function remove(req, res) {
  const product = await Product.findById(req.params.id)
  if (!product) throw new HttpError(404, 'Produto não encontrado.')
  const referenced = await Promise.all([
    OrderItem.exists({ productId: product._id }),
    CartItem.exists({ productId: product._id }),
    Variation.exists({ productId: product._id }),
  ])
  if (referenced.some(Boolean)) { product.active = false; await product.save() }
  else await product.deleteOne()
  res.status(204).end()
}
