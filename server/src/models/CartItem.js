import mongoose from 'mongoose'
const cartItemSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  variationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variation', default: null },
}, { collection: 'carrinho_itens', timestamps: false })
cartItemSchema.index({ clientId: 1, productId: 1, variationId: 1 }, { unique: true })
export default mongoose.model('CartItem', cartItemSchema)
