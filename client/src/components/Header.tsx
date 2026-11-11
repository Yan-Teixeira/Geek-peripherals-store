import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Icon } from './Icon'
export function Header({ cartCount, onCart, query, onSearch }: { cartCount: number; onCart: () => void; query: string; onSearch: (query: string) => void }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  return <header className="header">
    <NavLink to="/" className="brand" aria-label="Ir para o início"><span className="brand__mark"><Icon name="spark" size={18}/></span><span>NEXUS<span>//</span>LAB</span></NavLink>
    <nav className="main-nav" aria-label="Navegação principal">
      <NavLink to="/" end>Loja</NavLink>
      {user?.role === 'admin' && <NavLink to="/admin">Painel admin</NavLink>}
    </nav>
    <form className="search" role="search" onSubmit={event => { event.preventDefault(); navigate('/'); setTimeout(() => document.getElementById('products')?.scrollIntoView(), 0) }}>
      <Icon name="search" size={18}/><input value={query} onChange={event => onSearch(event.target.value)} placeholder="Buscar produto, marca ou categoria..." aria-label="Buscar produtos"/>
      <button className="search-submit" type="submit" aria-label="Pesquisar produtos"><Icon name="arrow" size={16}/></button>
    </form>
    <div className="header__actions">
      <NavLink className="icon-button user-button" to={user ? '/conta' : '/login'} aria-label={user ? 'Minha conta' : 'Entrar'}><Icon name="user"/></NavLink>
      <button className="cart-button" onClick={onCart} aria-label={`Carrinho, ${cartCount} itens`}><Icon name="cart"/><span>Carrinho</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
    </div>
  </header>
}
