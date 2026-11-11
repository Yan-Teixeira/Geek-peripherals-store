import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import api from './routes/api.js'
import { HttpError } from './utils/httpError.js'

export function createApp() {
  const app = express()
  const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(value => value.trim().replace(/\/+$/, ''))
    .filter(Boolean)
  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) return callback(null, true)
      return callback(new Error('A origem do frontend não está autorizada em CLIENT_ORIGIN.'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }))
  app.use(express.json({ limit: '32kb' }))
  app.use(cookieParser())
  app.get('/health', (_req, res) => res.json({ status: 'ok' }))
  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false }))
  app.use('/api', api)
  app.use((_req, _res, next) => next(new HttpError(404, 'Rota não encontrada.')))
  app.use((err, _req, res, _next) => {
    if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ message: 'JSON inválido.' })
    if (err.name === 'ValidationError') return res.status(400).json({ message: 'Revise os dados enviados.' })
    if (err.name === 'CastError') return res.status(404).json({ message: 'Recurso não encontrado.' })
    const status = err.status || 500
    if (status >= 500) console.error(err)
    res.status(status).json({ message: status >= 500 ? 'Erro interno do servidor.' : err.message, ...(err.fieldErrors ? { fieldErrors: err.fieldErrors } : {}) })
  })
  return app
}
