import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Accessibility } from './components/Accessibility'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { CartDrawer } from './components/CartDrawer'
import { ErrorNotice, Loading } from './components/Feedback'
import { useAuth } from './contexts/AuthContext'
import { useCart } from './contexts/CartContext'
import { useCatalog } from './contexts/CatalogContext'
import { Store } from './pages/Store'
import { ProductPage } from './pages/ProductPage'
import { AuthPage } from './pages/AuthPage'
import { AccountPage } from './pages/AccountPage'
import { AdminPage } from './pages/AdminPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { AboutPage } from './pages/AboutPage'
import { isDemo } from './services/api'
import { errorMessage } from './utils'

function Protected({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const { user, loading, error } = useAuth()
  const location = useLocation()
  if (loading) return <Loading/>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace/>
  if (error) return <ErrorNotice message={error}/>
  if (admin && user.role !== 'admin') return <main className="container feedback"><h1>Acesso restrito</h1><p>Esta área é exclusiva para administradores.</p><Link to="/">Voltar à loja</Link></main>
  return children
}
export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const { items, add } = useCart()
  const { products, loading, error: catalogError, refresh } = useCatalog()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0); setError('') }, [pathname])
  return <div className="app">
    <a className="skip-link" href="#content">Pular para o conteúdo</a>
    <Header cartCount={items.reduce((sum, item) => sum + item.quantity, 0)} query={query} onSearch={setQuery} onCart={() => setCartOpen(true)}/>
    {isDemo && <div className="demo-banner">Demonstração acadêmica · dados fictícios e temporários · nenhuma compra real <Link to="/login">Acessar contas de teste</Link></div>}
    {error && <ErrorNotice message={error}/>}
    <div id="content" tabIndex={-1}><Routes>
      <Route path="/" element={<>{catalogError && <ErrorNotice message={catalogError} retry={() => void refresh()}/>} {loading ? <Loading/> : <Store onClearSearch={() => setQuery('')} products={products} query={query} onProduct={id => navigate(`/produtos/${id}`)} onAdd={id => { try { add(id); setError(''); setCartOpen(true) } catch (error) { setError(errorMessage(error)) } }}/>}</>}/>
      <Route path="/catalogo" element={<>{catalogError && <ErrorNotice message={catalogError} retry={() => void refresh()}/>} {loading ? <Loading/> : <Store catalogOnly onClearSearch={() => setQuery('')} products={products} query={query} onProduct={id => navigate(`/produtos/${id}`)} onAdd={id => { try { add(id); setError(''); setCartOpen(true) } catch (error) { setError(errorMessage(error)) } }}/>}</>}/>
      <Route path="/produtos/:id" element={<ProductPage onAdded={() => setCartOpen(true)}/>}/>
      <Route path="/login" element={<AuthPage key="login"/>}/>
      <Route path="/cadastro" element={<AuthPage key="register" register/>}/>
      <Route path="/conta" element={<Protected><AccountPage/></Protected>}/>
      <Route path="/sobre" element={<AboutPage/>}/>
      <Route path="/checkout" element={<Navigate to="/pagamento" replace/>}/>
      <Route path="/pagamento" element={<Protected><CheckoutPage/></Protected>}/>
      <Route path="/admin" element={<Protected admin><AdminPage/></Protected>}/>
      <Route path="*" element={<main className="container feedback"><h1>Página não encontrada</h1><Link to="/">Voltar à loja</Link></main>}/>
    </Routes></div>
    <Accessibility/>
    {cartOpen && <CartDrawer onClose={() => setCartOpen(false)}/>}
    <Footer/>
  </div>
}
