import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCatalog } from '../contexts/CatalogContext'
import { useCart } from '../contexts/CartContext'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { ErrorNotice, Loading } from '../components/Feedback'
import type { Product } from '../types'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { money, errorMessage } from '../utils'
export function ProductPage({ onAdded }: { onAdded: () => void }) {
  const { id } = useParams()
  const { products, loading, error, refresh } = useCatalog()
  if (loading) return <Loading/>
  if (error) return <ErrorNotice message={error} retry={() => void refresh()}/>
  const product = products.find(p => p.id === id)
  if (!product) return <main className="container feedback"><h1>Produto não encontrado</h1><Link to="/">Voltar à loja</Link></main>
  return <ProductDetail key={id} product={product} onAdded={onAdded}/>
}
function ProductDetail({ product, onAdded }: { product: Product; onAdded: () => void }) {
  const [activeImage, setActiveImage] = useState(product.images[0])
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const { add } = useCart()
  const { user } = useAuth()
  const recorded = useRef('')
  useEffect(() => {
    if (!user) return
    const visit = `${user.id}:${product.id}`
    if (recorded.current === visit) return
    recorded.current = visit
    void api.recordView(product.id).catch(() => { /* Uma falha de contagem não bloqueia a compra. */ })
  }, [product.id, user?.id])
  return <main className="product-page container">
    <Link to="/" className="back-link"><Icon name="arrow"/> Voltar para a loja</Link>
    <div className="product-detail">
      <section className="gallery" aria-label="Galeria do produto">
        <div className="gallery__main"><img src={activeImage} alt={product.name}/>{product.badge && <span className="badge">{product.badge}</span>}</div>
        <div className="gallery__thumbs">{product.images.map((image, index) => <button key={`${image}-${index}`} className={activeImage === image ? 'active' : ''} aria-label={`Ver imagem ${index + 1}`} aria-pressed={activeImage === image} onClick={() => setActiveImage(image)}><img src={image} alt={`Vista ${index + 1} de ${product.name}`}/></button>)}</div>
      </section>
      <section className="product-info">
        <span className="eyebrow">Nexus Gear · {product.category}</span><h1>{product.name.toUpperCase()}</h1>
        <p className="product-copy">{product.description}</p>
        {product.id === '1' && <div className="feature-pills"><span><Icon name="keyboard"/> Layout ABNT2</span><span><Icon name="spark"/> RGB por tecla</span><span><Icon name="cpu"/> 1ms resposta</span></div>}
        <div className="buy-box">
          <div className="buy-box__price">{product.oldPriceInCents && <small>De {money(product.oldPriceInCents)} por</small>}<strong>{money(product.priceInCents)}</strong><span>ou 10x de {money(Math.round(product.priceInCents / 10))} sem juros</span></div>
          <div className="stock"><i/>{product.stock > 0 ? `${product.stock} unidades em estoque` : 'Produto esgotado'}</div>
          <div className="buy-actions"><div className="quantity"><button aria-label="Diminuir quantidade" disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)}><Icon name="minus" size={16}/></button><span aria-live="polite">{quantity}</span><button aria-label="Aumentar quantidade" disabled={quantity >= product.stock} onClick={() => setQuantity(q => q + 1)}><Icon name="plus" size={16}/></button></div>
            <Button disabled={product.stock === 0} className="buy-button" onClick={() => { try { add(product.id, quantity); setError(''); onAdded() } catch (error) { setError(errorMessage(error)) } }}><Icon name="cart"/> Adicionar ao carrinho</Button></div>
          {error && <ErrorNotice message={error}/>}
        </div>
        {!!Object.keys(product.specs || {}).length && <div className="specs"><h3>ESPECIFICAÇÕES TÉCNICAS</h3><dl>{Object.entries(product.specs || {}).map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></div>}
      </section>
    </div>
  </main>
}
