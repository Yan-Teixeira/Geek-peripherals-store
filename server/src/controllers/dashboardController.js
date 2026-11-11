import Order from '../models/Order.js'
import Product from '../models/Product.js'
export async function getDashboard(_req, res) {
  const [summary] = await Order.aggregate([{ $match: { status: { $ne: 'Cancelado' } } }, { $group: { _id: null, totalInCents: { $sum: '$totalInCents' }, orderCount: { $sum: 1 } } }])
  const totalInCents = summary?.totalInCents || 0; const orderCount = summary?.orderCount || 0
  res.json({ totalInCents, orderCount, averageInCents: orderCount ? Math.round(totalInCents / orderCount) : 0, lowStockCount: await Product.countDocuments({ active: true, stock: { $lt: 10 } }) })
}
