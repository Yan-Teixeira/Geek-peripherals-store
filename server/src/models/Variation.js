import mongoose from 'mongoose'
const variationSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  type: { type: String, enum: ['Cor', 'Tamanho', 'Capacidade'], required: true },
  value: { type: String, required: true, trim: true, maxlength: 80 },
  priceInCents: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  stock: { type: Number, required: true, default: 0, min: 0, validate: Number.isSafeInteger },
}, { collection: 'variacoes', timestamps: false })
variationSchema.index({ productId: 1, type: 1, value: 1 }, { unique: true })
export default mongoose.model('Variation', variationSchema)
