import 'dotenv/config'
import { createApp } from './app.js'
import { connectDatabase } from './config/db.js'

const port = Number(process.env.PORT || 3000)
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('Defina JWT_SECRET com pelo menos 32 caracteres no arquivo .env.')
try {
  await connectDatabase(process.env.MONGODB_URI)
} catch (error) {
  const authenticationFailed = error?.code === 8000 || /bad auth|authentication failed/i.test(error?.message || '')
  if (authenticationFailed) {
    console.error('O MongoDB Atlas recusou as credenciais. Confira o usuário e a senha do Database Access em server/.env.')
  } else {
    console.error('Não foi possível conectar ao MongoDB. Confira se o cluster está ativo, o IP está liberado e MONGODB_URI está correta.')
  }
  const causes = [...(error?.reason?.servers?.values?.() || [])]
    .map(server => server.error?.cause?.code || server.error?.code)
    .filter(Boolean)
  const detail = [...new Set(causes)].join(', ') || (error instanceof Error ? error.name : 'erro desconhecido')
  console.error(`Detalhe de conexão: ${detail}`)
  process.exit(1)
}
createApp().listen(port, '127.0.0.1', () => console.log(`API disponível em http://localhost:${port}`))
