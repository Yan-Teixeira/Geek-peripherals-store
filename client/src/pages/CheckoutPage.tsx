import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useCatalog } from '../contexts/CatalogContext'
import { api, isDemo } from '../services/api'
import { Button } from '../components/Button'
import { ErrorNotice, Loading } from '../components/Feedback'
import { money, errorMessage } from '../utils'
import type { Order } from '../types'
export function CheckoutPage() {
  const { items, clear } = useCart()
  const { products, loading, error: catalogError, refresh } = useCatalog()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  if (order) return <main className="form-page container"><section className="form-panel"><span className="eyebrow">{isDemo ? 'Pedido simulado' : 'Pedido recebido'}</span><h1>Pedido confirmado!</h1><p>Protocolo: {order.id}</p><p>Total: {money(order.totalInCents)}</p><Link className="button button--primary" to="/conta">Ver meus pedidos</Link></section></main>
  if (loading) return <Loading/>
  if (catalogError) return <ErrorNotice message={catalogError} retry={() => void refresh()}/>
  const invalid = items.some(item => { const product = products.find(p => p.id === item.productId); return !product || item.quantity > product.stock })
  const total = items.reduce((sum, item) => sum + (products.find(p => p.id === item.productId)?.priceInCents || 0) * item.quantity, 0)
  return <main className="form-page container"><section className="form-panel"><span className="eyebrow">Última etapa</span><h1>REVISE SEU PEDIDO</h1><p>{isDemo ? 'Compra simulada, sem cobrança ou envio de produtos.' : 'Registro do pedido. Pagamento e cálculo de frete não estão integrados.'}</p>
    {!items.length ? <p>Seu carrinho está vazio. <Link to="/">Voltar à loja</Link></p> : <><ul className="checkout-list">{items.map(item => { const p = products.find(p => p.id === item.productId); return <li key={item.productId}><span>{item.quantity} × {p?.name || 'Produto indisponível'}</span><strong>{money((p?.priceInCents || 0) * item.quantity)}</strong></li> })}</ul><h2>Subtotal: {money(total)}</h2>{invalid && <ErrorNotice message="Há produtos indisponíveis ou sem estoque suficiente. Revise o carrinho."/>}{error && <ErrorNotice message={error}/>}<Button disabled={busy || invalid} onClick={async () => { setBusy(true); setError(''); try { const result = await api.createOrder(items); setOrder(result); clear(); await refresh() } catch (error) { setError(errorMessage(error)); await refresh() } finally { setBusy(false) } }}>{busy ? 'Confirmando...' : isDemo ? 'Confirmar pedido simulado' : 'Confirmar pedido'}</Button></>}
  </section></main>
}
