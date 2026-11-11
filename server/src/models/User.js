import mongoose from 'mongoose'

// Representa a tabela `clientes` do diagrama. `role` dá suporte à autorização.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'user'], default: 'user', required: true },
}, {
  collection: 'clientes', timestamps: { createdAt: 'dataCriacao', updatedAt: false },
  toJSON: { transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; delete ret.passwordHash; delete ret.dataCriacao; return ret } },
})
export default mongoose.model('User', userSchema)
