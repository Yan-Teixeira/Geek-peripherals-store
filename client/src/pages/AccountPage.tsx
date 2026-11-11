import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import type { Order } from '../types'
import { money, errorMessage } from '../utils'
import { Button } from '../components/Button'
import { ErrorNotice, Loading } from '../components/Feedback'
export function AccountPage() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  useEffect(() => { let active = true; api.orders().then(orders => { if (active) setOrders(orders) }).catch(error => { if (active) setError(errorMessage(error)) }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [])
  return <main className="container account-page"><span className="eyebrow">{user?.role === 'admin' ? 'Administrador' : 'Cliente'}</span><h1>Olá, {user?.name}</h1><p>{user?.email}</p><div className="inline-actions">{user?.role === 'admin' && <Link className="button button--secondary" to="/admin">Painel administrativo</Link>}<Button disabled={busy} onClick={async () => { setBusy(true); try { await logout(); navigate('/login') } catch (error) { setError(errorMessage(error)) } finally { setBusy(false) } }}>{busy ? 'Saindo...' : 'Sair'}</Button></div>
    <h2>Seus pedidos</h2>{error && <ErrorNotice message={error}/>} {loading ? <Loading/> : !orders.length ? <p className="notice">Você ainda não realizou pedidos.</p> : <div className="orders">{orders.map(order => <article className="form-panel" key={order.id}><span className="eyebrow">{order.status}</span><h3>Pedido {order.id.slice(0, 8)}</h3><p>{new Date(order.createdAt).toLocaleString('pt-BR')}</p><strong>{money(order.totalInCents)}</strong><p>{order.items.reduce((sum, item) => sum + item.quantity, 0)} itens</p></article>)}</div>}
  </main>
}
