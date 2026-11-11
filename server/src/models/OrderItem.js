import mongoose from 'mongoose'
const orderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productModel: { type: String, required: true, default: '' },
  variationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variation', default: null },
  image: { type: String, default: '' },
  unitPriceInCents: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  quantity: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
}, { collection: 'pedido_itens', timestamps: false })
export default mongoose.model('OrderItem', orderItemSchema)
