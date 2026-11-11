import mongoose from 'mongoose'
const addressSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  label: { type: String, trim: true, maxlength: 50, default: null },
  street: { type: String, required: true, trim: true, maxlength: 120 },
  number: { type: String, required: true, trim: true, maxlength: 20 },
  complement: { type: String, trim: true, maxlength: 120, default: null },
  district: { type: String, required: true, trim: true, maxlength: 80 },
  city: { type: String, required: true, trim: true, maxlength: 80 },
  state: { type: String, required: true, trim: true, maxlength: 2, uppercase: true },
  postalCode: { type: String, required: true, trim: true, maxlength: 9 },
}, { collection: 'enderecos', timestamps: false })
export default mongoose.model('Address', addressSchema)
