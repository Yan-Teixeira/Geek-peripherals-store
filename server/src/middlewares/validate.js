import { HttpError } from '../utils/httpError.js'
export function objectBody(req, _res, next) { if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return next(new HttpError(400, 'Envie um objeto JSON válido.')); next() }
export function validateProduct(req, _res, next) {
  const b = req.body; const errors = {}
  if (typeof b.name !== 'string' || b.name.trim().length < 2 || b.name.length > 120) errors.name = 'Informe um nome entre 2 e 120 caracteres.'
  if (typeof b.category !== 'string' || !b.category.trim() || b.category.length > 60) errors.category = 'Informe uma categoria válida.'
  if (typeof b.description !== 'string' || !b.description.trim() || b.description.length > 3000) errors.description = 'Informe uma descrição válida.'
  if (!Number.isSafeInteger(b.priceInCents) || b.priceInCents < 1) errors.priceInCents = 'O preço deve ser um inteiro positivo em centavos.'
  if (!Number.isSafeInteger(b.stock) || b.stock < 0) errors.stock = 'O estoque deve ser um inteiro não negativo.'
  if (!Array.isArray(b.images) || b.images.length < 1 || b.images.length > 12 || b.images.some(x => typeof x !== 'string' || !x.trim() || x.length > 2048)) errors.images = 'Informe de 1 a 12 URLs de imagem válidas.'
  if (b.oldPriceInCents !== undefined && (!Number.isSafeInteger(b.oldPriceInCents) || b.oldPriceInCents < 1)) errors.oldPriceInCents = 'Preço antigo inválido.'
  if (Object.keys(errors).length) return next(new HttpError(400, 'Revise os dados do produto.', errors))
  next()
}
