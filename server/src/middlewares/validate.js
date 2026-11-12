import { HttpError } from '../utils/httpError.js'
export function objectBody(req, _res, next) { if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return next(new HttpError(400, 'Envie um objeto JSON válido.')); next() }
export function validateProduct(req, _res, next) {
  const b = req.body; const errors = {}
  if (b.isWeeklyOffer !== undefined && typeof b.isWeeklyOffer !== 'boolean') errors.isWeeklyOffer = 'Informe verdadeiro ou falso para oferta da semana.'
  const partial = req.method === 'PATCH'
  const check = key => !partial || Object.hasOwn(b, key)
  if (check('name') && (typeof b.name !== 'string' || b.name.trim().length < 2 || b.name.length > 120)) errors.name = 'Informe um nome entre 2 e 120 caracteres.'
  if (check('category') && (typeof b.category !== 'string' || !b.category.trim() || b.category.length > 60)) errors.category = 'Informe uma categoria válida.'
  if (check('description') && (typeof b.description !== 'string' || !b.description.trim() || b.description.length > 3000)) errors.description = 'Informe uma descrição válida.'
  if (check('priceInCents') && (!Number.isSafeInteger(b.priceInCents) || b.priceInCents < 1)) errors.priceInCents = 'O preço deve ser um inteiro positivo em centavos.'
  if (check('stock') && (!Number.isSafeInteger(b.stock) || b.stock < 0)) errors.stock = 'O estoque deve ser um inteiro não negativo.'
  if (check('images') && (!Array.isArray(b.images) || b.images.length < 1 || b.images.length > 12 || b.images.some(x => typeof x !== 'string' || !x.trim() || x.length > 2048))) errors.images = 'Informe de 1 a 12 URLs de imagem válidas.'
  if (b.oldPriceInCents !== undefined && b.oldPriceInCents !== null && (!Number.isSafeInteger(b.oldPriceInCents) || b.oldPriceInCents < 1)) errors.oldPriceInCents = 'Preço antigo inválido.'
  for (const [key, max] of [['brand', 100], ['model', 120], ['badge', 40]]) {
    if (b[key] !== undefined && (typeof b[key] !== 'string' || b[key].length > max)) errors[key] = `Informe um texto de até ${max} caracteres.`
  }
  if (b.active !== undefined && typeof b.active !== 'boolean') errors.active = 'Status inválido.'
  if (b.specs !== undefined && (!b.specs || typeof b.specs !== 'object' || Array.isArray(b.specs) || Object.entries(b.specs).some(([key, value]) => !key.trim() || key.startsWith('$') || key.includes('.') || ['__proto__', 'constructor', 'prototype'].includes(key) || typeof value !== 'string'))) errors.specs = 'Informe especificações com nomes e valores em texto.'
  if (Array.isArray(b.images) && b.images.some(url => { try { return !['http:', 'https:'].includes(new URL(url).protocol) } catch { return true } })) errors.images = 'Use URLs HTTP ou HTTPS para as imagens.'
  if (Object.keys(errors).length) return next(new HttpError(400, 'Revise os dados do produto.', errors))
  next()
}
