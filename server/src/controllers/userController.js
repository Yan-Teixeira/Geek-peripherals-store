import mongoose from 'mongoose'
import User from '../models/User.js'
import Order from '../models/Order.js'
import Address from '../models/Address.js'
import CartItem from '../models/CartItem.js'
import { HttpError } from '../utils/httpError.js'
const publicUser = user => ({ id: user.id, name: user.name, email: user.email, role: user.role })
function assertId(id) { if (!mongoose.isValidObjectId(id)) throw new HttpError(404, 'Usuário não encontrado.') }
export async function list(_req, res) { const users = await User.find().sort({ createdAt: -1 }); res.json(users.map(publicUser)) }
export async function get(req, res) { assertId(req.params.id); const user = await User.findById(req.params.id); if (!user) throw new HttpError(404, 'Usuário não encontrado.'); if (req.user.id !== user.id && req.user.role !== 'admin') throw new HttpError(403, 'Você não tem acesso a este usuário.'); res.json(publicUser(user)) }
export async function update(req, res) {
  assertId(req.params.id)
  if (req.user.id !== req.params.id && req.user.role !== 'admin') throw new HttpError(403, 'Você não tem acesso a este usuário.')
  const allowed = req.user.role === 'admin' ? ['name', 'email', 'role'] : ['name', 'email']
  const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)))
  if (!Object.keys(data).length) throw new HttpError(400, 'Informe nome ou e-mail para atualizar.')
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.trim().length > 80)) throw new HttpError(400, 'Nome inválido.')
  if (data.email !== undefined) { if (typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) throw new HttpError(400, 'E-mail inválido.'); data.email = data.email.trim().toLowerCase() }
  if (data.role !== undefined && !['admin', 'user'].includes(data.role)) throw new HttpError(400, 'Perfil inválido.')
  try { const user = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!user) throw new HttpError(404, 'Usuário não encontrado.'); res.json(publicUser(user)) }
  catch (err) { if (err.code === 11000) throw new HttpError(409, 'Este e-mail já está cadastrado.'); throw err }
}
export async function remove(req, res) {
  assertId(req.params.id)
  if (req.user.id !== req.params.id && req.user.role !== 'admin') throw new HttpError(403, 'Você não tem acesso a este usuário.')
  if (req.user.id === req.params.id && req.user.role === 'admin') throw new HttpError(400, 'Não é permitido excluir o administrador da própria sessão.')
  if (await Order.exists({ clientId: req.params.id })) throw new HttpError(409, 'A conta possui pedidos vinculados e não pode ser removida.')
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) throw new HttpError(404, 'Usuário não encontrado.')
  await Promise.all([Address.deleteMany({ clientId: req.params.id }), CartItem.deleteMany({ clientId: req.params.id })])
  res.status(204).end()
}
