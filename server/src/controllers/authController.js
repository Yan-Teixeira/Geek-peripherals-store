import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { HttpError } from '../utils/httpError.js'
import { setSession, clearSession } from '../middlewares/auth.js'

const publicUser = user => ({ id: user.id, name: user.name, email: user.email, role: user.role })
const validEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export async function register(req, res) {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = req.body.password
  const errors = {}
  if (name.length < 2 || name.length > 80) errors.name = 'Informe um nome entre 2 e 80 caracteres.'
  if (email.length > 254 || !validEmail(email)) errors.email = 'Informe um e-mail válido.'
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) errors.password = 'A senha deve ter entre 8 e 72 caracteres.'
  if (Object.keys(errors).length) throw new HttpError(400, 'Revise os dados do cadastro.', errors)
  const passwordHash = await bcrypt.hash(password, 12)
  try {
    const user = await User.create({ name, email, passwordHash })
    setSession(res, user); res.status(201).json(publicUser(user))
  } catch (err) { if (err.code === 11000) throw new HttpError(409, 'Este e-mail já está cadastrado.'); throw err }
}
export async function login(req, res) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = req.body.password
  if (!validEmail(email) || typeof password !== 'string' || !password) throw new HttpError(400, 'Informe e-mail e senha válidos.')
  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new HttpError(401, 'E-mail ou senha incorretos.')
  setSession(res, user); res.json(publicUser(user))
}
export function me(req, res) { res.json(publicUser(req.user)) }
export function logout(_req, res) { clearSession(res); res.status(204).end() }
