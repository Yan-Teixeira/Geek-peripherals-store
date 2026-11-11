import mongoose from 'mongoose'
import Order from '../models/Order.js'
import OrderItem from '../models/OrderItem.js'
import Product from '../models/Product.js'
import { HttpError } from '../utils/httpError.js'

function serializeOrder(order, items) {
  return {
    id: order.id,
    userId: order.clientId.toString(),
    items: items.map(item => ({
      productId: item.productId.toString(), name: item.productName, model: item.productModel,
      image: item.image, variationId: item.variationId?.toString() || null,
      unitPriceInCents: item.unitPriceInCents, quantity: item.quantity,
    })),
    totalInCents: order.totalInCents, status: order.status,
    createdAt: order.createdAt.toISOString(),
  }
}
async function serializeMany(orders) {
  const ids = orders.map(order => order._id)
  const items = await OrderItem.find({ orderId: { $in: ids } }).sort({ _id: 1 })
  const byOrder = new Map()
  for (const item of items) { const key = item.orderId.toString(); byOrder.set(key, [...(byOrder.get(key) || []), item]) }
  return orders.map(order => serializeOrder(order, byOrder.get(order.id) || []))
}

export async function create(req, res) {
  const rawItems = req.body.items
  if (!Array.isArray(rawItems) || rawItems.length < 1 || rawItems.length > 50) throw new HttpError(400, 'O pedido precisa conter de 1 a 50 itens.')
  const quantities = new Map()
  for (const item of rawItems) {
    if (!item || typeof item.productId !== 'string' || !mongoose.isValidObjectId(item.productId) || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) throw new HttpError(400, 'Produto ou quantidade inválidos.')
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity)
  }
  const session = await mongoose.startSession()
  let orderId
  try {
    await session.withTransaction(async () => {
      const products = await Product.find({ _id: { $in: [...quantities.keys()] }, active: true }).session(session)
      if (products.length !== quantities.size) throw new HttpError(400, 'Um ou mais produtos não estão disponíveis.')
      let totalInCents = 0
      const snapshots = []
      for (const product of products) {
        const quantity = quantities.get(product.id)
        const changed = await Product.updateOne({ _id: product._id, active: true, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }, { session })
        if (changed.modifiedCount !== 1) throw new HttpError(409, `Estoque indisponível para ${product.name}.`)
        totalInCents += product.priceInCents * quantity
        snapshots.push({ productId: product._id, productName: product.name, productModel: product.model || '', image: product.images[0] || '', unitPriceInCents: product.priceInCents, quantity })
      }
      if (!Number.isSafeInteger(totalInCents)) throw new HttpError(400, 'O valor do pedido excede o limite permitido.')
      const [order] = await Order.create([{ clientId: req.user._id, totalInCents, status: 'Aguardando Pagamento' }], { session })
      orderId = order._id
      await OrderItem.insertMany(snapshots.map(item => ({ ...item, orderId })), { session })
    })
  } finally { await session.endSession() }
  const order = await Order.findById(orderId)
  const items = await OrderItem.find({ orderId })
  res.status(201).json(serializeOrder(order, items))
}

export async function list(req, res) {
  const filter = req.user.role === 'admin' && req.query.all === 'true' ? {} : { clientId: req.user._id }
  const orders = await Order.find(filter).sort({ createdAt: -1 })
  res.json(await serializeMany(orders))
}
export async function get(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) throw new HttpError(404, 'Pedido não encontrado.')
  const order = await Order.findById(req.params.id)
  if (!order) throw new HttpError(404, 'Pedido não encontrado.')
  if (order.clientId.toString() !== req.user.id && req.user.role !== 'admin') throw new HttpError(403, 'Você não tem acesso a este pedido.')
  res.json(serializeOrder(order, await OrderItem.find({ orderId: order._id })))
}
export async function updateStatus(req, res) {
  const allowed = ['Aguardando Pagamento', 'Pago', 'Enviado', 'Entregue', 'Cancelado']
  if (!allowed.includes(req.body.status)) throw new HttpError(400, 'Status inválido.')
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true })
  if (!order) throw new HttpError(404, 'Pedido não encontrado.')
  res.json(serializeOrder(order, await OrderItem.find({ orderId: order._id })))
}
export async function remove(req, res) {
  const order = await Order.findById(req.params.id)
  if (!order) throw new HttpError(404, 'Pedido não encontrado.')
  await OrderItem.deleteMany({ orderId: order._id })
  await order.deleteOne()
  res.status(204).end()
}
