import Product from '../models/Product.js'
import Variation from '../models/Variation.js'
import OrderItem from '../models/OrderItem.js'
import CartItem from '../models/CartItem.js'
import { HttpError } from '../utils/httpError.js'

export function serializeVariation(variation) {
  return { id: variation.id, productId: variation.productId.toString(), type: variation.type, value: variation.value, priceInCents: variation.priceInCents, stock: variation.stock }
}

export function validate(req, _res, next) {
  const data = req.body
  const partial = req.method === 'PATCH'
  const errors = {}
  if ((!partial || data.type !== undefined) && !['Cor', 'Tamanho', 'Capacidade'].includes(data.type)) errors.type = 'Tipo de variação inválido.'
  if ((!partial || data.value !== undefined) && (typeof data.value !== 'string' || !data.value.trim() || data.value.length > 80)) errors.value = 'Informe um valor de até 80 caracteres.'
  for (const [key, min] of [['priceInCents', 1], ['stock', 0]]) {
    if ((!partial || data[key] !== undefined) && (!Number.isSafeInteger(data[key]) || data[key] < min)) errors[key] = 'Valor inteiro inválido.'
  }
  if (Object.keys(errors).length) return next(new HttpError(400, 'Revise a variação.', errors))
  next()
}

async function requireProduct(req) {
  const product = await Product.findOne({ _id: req.params.id, ...(req.user?.role === 'admin' ? {} : { active: true }) })
  if (!product) throw new HttpError(404, 'Produto não encontrado.')
  return product
}

function values(body) {
  return Object.fromEntries(['type', 'value', 'priceInCents', 'stock'].filter(key => body[key] !== undefined).map(key => [key, body[key]]))
}

async function save(operation) {
  try { return await operation() }
  catch (error) {
    if (error.code === 11000) throw new HttpError(409, 'Já existe uma variação com esse tipo e valor neste produto.')
    throw error
  }
}

export async function list(req, res) {
  const product = await requireProduct(req)
  res.json((await Variation.find({ productId: product._id }).sort({ type: 1, value: 1 })).map(serializeVariation))
}

export async function create(req, res) {
  const product = await requireProduct(req)
  const variation = await save(() => Variation.create({ ...values(req.body), productId: product._id }))
  res.status(201).json(serializeVariation(variation))
}

export async function update(req, res) {
  const product = await requireProduct(req)
  const variation = await save(() => Variation.findOneAndUpdate({ _id: req.params.variationId, productId: product._id }, { $set: values(req.body) }, { new: true, runValidators: true }))
  if (!variation) throw new HttpError(404, 'Variação não encontrada neste produto.')
  res.json(serializeVariation(variation))
}

export async function remove(req, res) {
  const product = await requireProduct(req)
  const variation = await Variation.findOne({ _id: req.params.variationId, productId: product._id })
  if (!variation) throw new HttpError(404, 'Variação não encontrada neste produto.')
  // Preserve referências de pedidos e carrinhos existentes.
  const references = await Promise.all([OrderItem.exists({ variationId: variation._id }), CartItem.exists({ variationId: variation._id })])
  if (references.some(Boolean)) throw new HttpError(409, 'Esta variação está em uso. Ajuste o estoque para zero para indisponibilizá-la.')
  await variation.deleteOne()
  res.status(204).end()
}
