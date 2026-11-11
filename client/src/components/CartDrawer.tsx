import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useCatalog } from '../contexts/CatalogContext'
import { Button } from './Button'
import { Icon } from './Icon'
import { ErrorNotice } from './Feedback'
import { money, errorMessage } from '../utils'
export function CartDrawer({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const { items, setQuantity, remove } = useCart()
  const { products } = useCatalog()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const subtotal = items.reduce((sum, item) => sum + (products.find(p => p.id === item.productId)?.priceInCents || 0) * item.quantity, 0)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    dialog.current?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; previous?.focus() }
  }, [])
  return <dialog ref={dialog} className="cart-drawer open" aria-labelledby="cart-title" onCancel={onClose} onClick={event => { if (event.target === dialog.current) { const box = dialog.current.getBoundingClientRect(); if (event.clientX < box.left) onClose() } }}>
    <div className="drawer__heading"><div><span className="eyebrow">Seu pedido</span><h2 id="cart-title">CARRINHO <b>{items.reduce((sum, item) => sum + item.quantity, 0)}</b></h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar carrinho"><Icon name="close"/></button></div>
    <div className="drawer__items">{error && <ErrorNotice message={error}/>}{!items.length ? <div className="empty-cart"><Icon name="cart" size={36}/><h3>Seu carrinho está vazio</h3><p>Explore a curadoria Nexus e encontre seu próximo upgrade.</p><Button onClick={onClose}>Continuar comprando</Button></div> : items.map(item => {
      const product = products.find(p => p.id === item.productId)
      return <article className="cart-item" key={item.productId}>{product && <img src={product.images[0]} alt={product.name}/>}<div><span>{product?.category}</span><strong>{product?.name || 'Produto indisponível'}</strong><label className="cart-quantity">Qtd. <input aria-label={`Quantidade de ${product?.name || 'produto'}`} type="number" min="1" max={product?.stock || 1} value={item.quantity} onChange={event => { try { setQuantity(item.productId, Number(event.target.value)); setError('') } catch (error) { setError(errorMessage(error)) } }}/></label><b>{money((product?.priceInCents || 0) * item.quantity)}</b>{(!product || product.stock < item.quantity) && <small className="error-text">Revise a quantidade ou remova este produto.</small>}</div><button onClick={() => remove(item.productId)} aria-label={`Remover ${product?.name || 'produto'}`}><Icon name="trash" size={18}/></button></article>
    })}</div>
    {!!items.length && <div className="drawer__checkout"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><small>Confira seu pedido antes de confirmar.</small><Button className="checkout-button" onClick={() => { onClose(); navigate('/checkout') }}>Ir para checkout <Icon name="arrow"/></Button></div>}
  </dialog>
}
