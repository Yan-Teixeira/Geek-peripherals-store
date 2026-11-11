import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Product } from '../types'
import { api } from '../services/api'
import { errorMessage } from '../utils'
const CatalogContext = createContext<{ products: Product[]; loading: boolean; error: string; refresh: () => Promise<void> } | null>(null)
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const refresh = useCallback(async () => {
    setLoading(true); setError('')
    try { setProducts(await api.products()) } catch (error) { setError(errorMessage(error)) } finally { setLoading(false) }
  }, [])
  useEffect(() => { void refresh() }, [refresh])
  return <CatalogContext.Provider value={{ products, loading, error, refresh }}>{children}</CatalogContext.Provider>
}
export function useCatalog() { const context = useContext(CatalogContext); if (!context) throw new Error('CatalogProvider ausente'); return context }
