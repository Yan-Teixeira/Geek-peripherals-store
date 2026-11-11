import mongoose from 'mongoose'
const productSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  brand: { type: String, trim: true, maxlength: 100, default: '' },
  model: { type: String, trim: true, maxlength: 120, default: '' },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  images: { type: [{ type: String, trim: true, maxlength: 2048 }], required: true, validate: v => v.length > 0 && v.length <= 12 },
  specs: { type: Map, of: String, default: {} },
  priceInCents: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  oldPriceInCents: { type: Number, min: 1, validate: Number.isSafeInteger },
  stock: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
  badge: { type: String, trim: true, maxlength: 40 },
  active: { type: Boolean, default: true },
}, { collection: 'produtos', timestamps: true, toJSON: { flattenMaps: true, transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; delete ret.createdAt; delete ret.updatedAt; delete ret.active; return ret } } })
productSchema.index({ name: 'text', brand: 'text', model: 'text', description: 'text' })
export default mongoose.model('Product', productSchema)
