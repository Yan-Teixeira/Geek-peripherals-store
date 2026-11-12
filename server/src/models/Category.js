import mongoose from 'mongoose'
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: null, maxlength: 500 },
}, { collection: 'categorias', timestamps: false })
export default mongoose.model('Category', categorySchema)
