import Product from '../models/Product.js'
import Order from '../models/Order.js'
import OrderItem from '../models/OrderItem.js'
import { toApiProduct } from './productController.js'
import { HttpError } from '../utils/httpError.js'

export const confirmedStatuses = ['Pago', 'Enviado', 'Entregue']
export async function home(_req, res) {
  const [featured, weeklyOffers, sales] = await Promise.all([
    Product.find({ active: true }).sort({ viewsCount: -1, _id: 1 }).limit(4).populate('categoryId', 'name'),
    Product.find({ active: true, isWeeklyOffer: true }).sort({ updatedAt: -1, _id: 1 }).limit(4).populate('categoryId', 'name'),
    OrderItem.aggregate([
      { $lookup: { from: Order.collection.name, localField: 'orderId', foreignField: '_id', as: 'order' } },
      { $unwind: '$order' },
      { $match: { 'order.status': { $in: confirmedStatuses } } },
      { $group: { _id: '$productId', unitsSold: { $sum: '$quantity' } } },
      { $lookup: { from: Product.collection.name, localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $match: { 'product.active': true } },
      { $sort: { unitsSold: -1, _id: 1 } },
      { $facet: { total: [{ $count: 'count' }], top: [{ $limit: 4 }, { $project: { _id: 1, unitsSold: 1 } }] } },
    ]),
  ])
  const distinctSoldProducts = sales[0]?.total[0]?.count || 0
  const top = sales[0]?.top || []
  const soldProducts = distinctSoldProducts >= 2
    ? await Product.find({ _id: { $in: top.map(row => row._id) }, active: true }).populate('categoryId', 'name') : []
  const byId = new Map(soldProducts.map(product => [product.id, product]))
  res.set('Cache-Control', 'no-store').json({
    featured: featured.map(toApiProduct), weeklyOffers: weeklyOffers.map(toApiProduct),
    distinctSoldProducts,
    bestsellers: top.flatMap(row => { const product = byId.get(row._id.toString()); return product ? [{ ...toApiProduct(product), unitsSold: row.unitsSold }] : [] }),
  })
}

// POST separado: carregar imagens, listar catálogo e consultar GET não contam visitas.
export async function recordView(req, res) {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, active: true }, { $inc: { viewsCount: 1 } }, { new: true },
  )
  if (!product) throw new HttpError(404, 'Produto não encontrado.')
  res.json({ viewsCount: product.viewsCount })
}
export async function weeklyOffer(req, res) {
  if (typeof req.body.isWeeklyOffer !== 'boolean') throw new HttpError(400, 'Informe isWeeklyOffer como booleano.')
  const product = await Product.findByIdAndUpdate(req.params.id, { $set: { isWeeklyOffer: req.body.isWeeklyOffer } }, { new: true, runValidators: true }).populate('categoryId', 'name')
  if (!product) throw new HttpError(404, 'Produto não encontrado.')
  res.json(toApiProduct(product))
}
