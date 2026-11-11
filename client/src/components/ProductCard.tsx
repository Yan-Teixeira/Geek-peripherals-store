import type { Product } from '../types'
import { money } from '../utils'
import { Icon } from './Icon'
export function ProductCard({
  product,
  onProduct,
  onAdd,
}: {
  product: Product
  onProduct: () => void
  onAdd: () => void
}) {
  return (
    <article className="product-card">
      <button className="product-card__image" onClick={onProduct}>
        <img loading="lazy" src={product.images[0]} alt={product.name} />
        {product.badge && <span className="badge">{product.badge}</span>}
        <span className="image-arrow">
          <Icon name="arrow" />
        </span>
      </button>
      <div className="product-card__body">
        <span className="eyebrow">{product.category}</span>
        <button className="product-title" onClick={onProduct}>
          {product.name}
        </button>
        <div className="price-row">
          <div>
            {product.oldPriceInCents && <small>{money(product.oldPriceInCents)}</small>}
            <strong>{money(product.priceInCents)}</strong>
          </div>
          <button
            className="add-button" disabled={product.stock === 0}
            onClick={onAdd}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Icon name="plus" />
          </button>
        </div>
      </div>
    </article>
  )
}

