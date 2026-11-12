import mongoose from 'mongoose'

export async function connectDatabase(uri) {
  if (!uri) throw new Error('MONGODB_URI não configurada.')
  await mongoose.connect(uri)
  console.log('MongoDB conectado.')
}
