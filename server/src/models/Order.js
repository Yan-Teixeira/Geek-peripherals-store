import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  shippingAddressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', default: null },
  totalInCents: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  status: { type: String, enum: ['Aguardando Pagamento', 'Pago', 'Enviado', 'Entregue', 'Cancelado'], default: 'Aguardando Pagamento' },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'pedidos', timestamps: false })
export default mongoose.model('Order', orderSchema)
