import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories as productCategories, filterProducts } from '../catalog'
import { images } from '../data/products'
import type { Product } from '../types'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { ProductCard } from '../components/ProductCard'
export function Store({
  onProduct,
  onAdd, products, query, onClearSearch, catalogOnly = false,
}: {
  onProduct: (id: string) => void
  onAdd: (id: string) => void
  products: Product[]
  query: string
  onClearSearch: () => void
  catalogOnly?: boolean
}) {
  const [category, setCategory] = useState("Todos")
  const navigate = useNavigate()
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [inStock, setInStock] = useState(false)
  const [sort, setSort] = useState('featured')
  const categories = ['Todos', ...new Set([...productCategories, ...products.map(p => p.category)])]
  const invalidRange = min !== '' && max !== '' && Number(min) > Number(max)
  const visible = invalidRange ? [] : filterProducts(products, { query, category, min: min === '' ? undefined : Math.round(Number(min) * 100), max: max === '' ? undefined : Math.round(Number(max) * 100), inStock, sort })
  const showcase = filterProducts(products, { query: '', category: 'Todos', inStock: false, sort: 'featured' })
  const featured = showcase.filter(product => product.featured).slice(0, 4)
  const promotions = showcase.filter(product => product.oldPriceInCents && product.oldPriceInCents > product.priceInCents).slice(0, 4)
  const bestsellers = showcase.filter(product => product.bestseller).slice(0, 4)
  function reset() { setCategory('Todos'); setMin(''); setMax(''); setInStock(false); setSort('featured'); onClearSearch() }


  return (
    <main className={catalogOnly ? "catalog-only" : undefined}>
      {!catalogOnly && <><section className="hero">
        <img src={images.setup} alt="Setup gamer iluminado em roxo" />
        <div className="hero__shade" />
        <div className="hero__content container">
          <span className="hero__tag">
            <i /> Performance sem concessões
          </span>
          <h1>
            SEU SETUP.
            <br />
            <em>SEU DOMÍNIO.</em>
          </h1>
          <p>
            Hardware de alta performance, curadoria de especialistas e o suporte
            de quem realmente entende.
          </p>
          <div className="hero__actions">
            <Button
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explorar produtos <Icon name="arrow" />
            </Button>
            <Button variant="secondary" onClick={() => { setCategory("PCs montados"); document.getElementById("products")?.scrollIntoView({behavior: "smooth"}) }}>
              Explorar PCs <Icon name="cpu" />
            </Button>
          </div>
        </div>
        <div className="hero__stat">
          <strong>4.9</strong>
          <span>
            ★ ★ ★ ★ ★<small>+2.800 avaliações</small>
          </span>
        </div>
      </section>

      <section className="benefits container">
        <div>
          <Icon name="box" />
          <span>
            <strong>Frete expresso</strong>
            <small>Envio para todo Brasil</small>
          </span>
        </div>
        <div>
          <Icon name="check" />
          <span>
            <strong>Garantia total</strong>
            <small>Até 3 anos de cobertura</small>
          </span>
        </div>
        <div>
          <Icon name="spark" />
          <span>
            <strong>Setup aprovado</strong>
            <small>Testado por especialistas</small>
          </span>
        </div>
      </section>

      </>}
      {!catalogOnly ? <div className="store-showcase">
        {([['Destaques para seu setup', featured], ['Ofertas da semana', promotions], ['Os mais vendidos', bestsellers]] as const).map(([title, list]) => <section className="catalog container showcase-section" key={title}>
          <div className="section-heading"><div><span className="eyebrow">Curadoria Nexus</span><h2>{title.toUpperCase()}</h2></div><Button variant="ghost" onClick={() => navigate('/catalogo')}>Ver catálogo completo <Icon name="arrow"/></Button></div>
          <div className="product-grid">{list.map(product => <ProductCard key={product.id} product={product} onProduct={() => onProduct(product.id)} onAdd={() => onAdd(product.id)}/>)}</div>
        </section>)}
      </div> : <section className="catalog container" id="products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Curadoria Nexus</span>
            {catalogOnly ? <h1>CATÁLOGO COMPLETO</h1> : <h2>ENCONTRE SEU PRÓXIMO UPGRADE</h2>}
          </div>
          <Button variant="ghost" onClick={() => { reset(); navigate("/catalogo") }}>
            Ver catálogo completo <Icon name="arrow" />
          </Button>
        </div>
        <div className="filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="catalog-controls" role="group" aria-label="Filtros de produtos">
          <label>Preço mínimo (R$)<input type="number" min="0" step="0.01" value={min} onChange={event => setMin(event.target.value)} /></label>
          <label>Preço máximo (R$)<input type="number" min="0" step="0.01" value={max} onChange={event => setMax(event.target.value)} /></label>
          <label>Ordenar por<select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Destaques</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome A–Z</option></select></label>
          <label className="stock-filter"><input type="checkbox" checked={inStock} onChange={event => setInStock(event.target.checked)} />Só em estoque</label>
          <Button variant="secondary" onClick={reset}>Limpar filtros</Button>
        </div>
        {invalidRange && <p className="notice error" role="alert">O preço mínimo não pode ser maior que o máximo.</p>}
        <p className="catalog-results" role="status">{visible.length} produtos encontrados{query && ` para “${query}”`}</p>
        {visible.length === 0 && <p role="status" className="notice">Nenhum produto encontrado. Tente outra busca ou categoria.</p>}
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProduct={() => onProduct(product.id)}
              onAdd={() => onAdd(product.id)}
            />
          ))}
        </div>
      </section>}
    </main>
  )
}

