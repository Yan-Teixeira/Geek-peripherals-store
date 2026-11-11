import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { HttpError } from '../utils/httpError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 }
export function setSession(res, user) { res.cookie('session', jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' }), cookieOptions) }
export function clearSession(res) { res.clearCookie('session', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/' }) }
export async function optionalAuth(req, _res, next) {
  const token = req.cookies?.session
  if (token) { try { const payload = jwt.verify(token, process.env.JWT_SECRET); req.user = await User.findById(payload.sub) } catch { /* Catálogo público continua acessível sem sessão válida. */ } }
  next()
}
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.session
  if (!token) throw new HttpError(401, 'Entre na sua conta para continuar.')
  try { const payload = jwt.verify(token, process.env.JWT_SECRET); req.user = await User.findById(payload.sub); if (!req.user) throw new Error('user missing') }
  catch { throw new HttpError(401, 'Sessão inválida ou expirada.') }
  next()
})
export function requireAdmin(req, _res, next) { if (req.user?.role !== 'admin') return next(new HttpError(403, 'Acesso exclusivo para administradores.')); next() }
export function getSessionCookieOptions() { return cookieOptions }
