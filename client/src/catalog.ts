import type { Product } from './types.ts'

export const categories = ['Teclados', 'Mouses', 'Headsets', 'Monitores', 'Memória RAM', 'Gabinetes', 'SSDs', 'Processadores', 'Placas-mãe', 'Placas de vídeo', 'Fontes', 'Refrigeração', 'PCs montados', 'Componentes']
export const normalizeSearch = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
const aliases: Record<string, string> = { ram: 'memoria', gabinete: 'gabinetes', gabinte: 'gabinetes', ssd: 'ssds', cooler: 'refrigeracao', gpu: 'video', cpu: 'processadores', mouse: 'mouses', fonte: 'fontes' }
export interface CatalogFilters { query: string; category: string; min?: number; max?: number; inStock: boolean; sort: string }
export function filterProducts(products: Product[], filters: CatalogFilters) {
  const terms = normalizeSearch(filters.query).split(/\s+/).filter(Boolean).map(term => aliases[term] || term)
  const result = products.filter(product => {
    const text = normalizeSearch(`${product.name} ${product.brand || ""} ${product.model || ""} ${product.category} ${product.description} ${Object.values(product.specs || {}).join(' ')}`)
    return terms.every(term => text.includes(term)) &&
      (!filters.category || filters.category === 'Todos' || product.category === filters.category) &&
      (filters.min === undefined || product.priceInCents >= filters.min) &&
      (filters.max === undefined || product.priceInCents <= filters.max) &&
      (!filters.inStock || product.stock > 0)
  })
  if (filters.sort === 'price-asc') result.sort((a, b) => a.priceInCents - b.priceInCents)
  if (filters.sort === 'price-desc') result.sort((a, b) => b.priceInCents - a.priceInCents)
  if (filters.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  return result
}
