import 'dotenv/config'
import { createApp } from './app.js'
import { connectDatabase } from './config/db.js'

const port = Number(process.env.PORT || 3000)
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('Defina JWT_SECRET com pelo menos 32 caracteres no arquivo .env.')
await connectDatabase(process.env.MONGODB_URI)
createApp().listen(port, '127.0.0.1', () => console.log(`API disponível em http://localhost:${port}`))
