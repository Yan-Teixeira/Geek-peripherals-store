import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories as productCategories, filterProducts } from '../catalog'
import { images } from '../data/products'
import { api } from '../services/api'
import { ErrorNotice, Loading } from '../components/Feedback'
import { errorMessage } from '../utils'
import type { HomeSections, Product } from '../types'
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
  const [availability, setAvailability] = useState('all')
  const [priceOpen, setPriceOpen] = useState(true)
  const [sort, setSort] = useState('featured')
  const categories = ['Todos', ...new Set([...productCategories, ...products.map(p => p.category)])]
  const invalidRange = min !== '' && max !== '' && Number(min) > Number(max)
  const visible = invalidRange ? [] : filterProducts(products, { query, category, min: min === '' ? undefined : Math.round(Number(min) * 100), max: max === '' ? undefined : Math.round(Number(max) * 100), inStock: availability === "available", sort }).filter(product => availability !== "sold-out" || product.stock === 0)
  const [home, setHome] = useState<HomeSections | null>(null)
  const [homeError, setHomeError] = useState('')
  const [homeLoading, setHomeLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    if (catalogOnly) return
    let active = true
    setHomeLoading(true); setHomeError('')
    api.home().then(data => { if (active) setHome(data) }).catch(error => { if (active) setHomeError(errorMessage(error)) }).finally(() => { if (active) setHomeLoading(false) })
    return () => { active = false }
  }, [catalogOnly, products, retry])
  const sections: [string, Product[]][] = home ? [['Destaques para seu setup', home.featured], ['Ofertas da semana', home.weeklyOffers]] : []
  if (home && home.distinctSoldProducts >= 2 && home.bestsellers.length >= 2) sections.push(['Os mais vendidos', home.bestsellers])
  function reset() { setCategory('Todos'); setMin(''); setMax(''); setAvailability('all'); setSort('featured'); onClearSearch() }


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
                  ?.scrollIntoView({ behavior: "auto" })
              }
            >
              Explorar produtos <Icon name="arrow" />
            </Button>
            <Button variant="secondary" onClick={() => { setCategory("PCs montados"); document.getElementById("products")?.scrollIntoView({behavior: "auto"}) }}>
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
      {!catalogOnly ? <div className="store-showcase" id="products">
        {homeLoading && <Loading/>}
        {homeError && <ErrorNotice message={homeError} retry={() => setRetry(value => value + 1)}/>}
        {!homeLoading && !homeError && sections.map(([title, list]) => <section className="catalog container showcase-section" key={title}>
          <div className="section-heading"><div><span className="eyebrow">Curadoria Nexus</span><h2>{title.toUpperCase()}</h2></div><Button variant="ghost" onClick={() => navigate('/catalogo')}>Ver catálogo completo <Icon name="arrow"/></Button></div>
          <>{!list.length && <p className="notice">{title === 'Ofertas da semana' ? 'Novas ofertas em breve. Explore nosso catálogo.' : 'Nenhum produto disponível no momento.'}</p>}<div className="product-grid">{list.map(product => <ProductCard key={product.id} product={product} onProduct={() => onProduct(product.id)} onAdd={() => onAdd(product.id)}/>)}</div></>
        </section>)}
      </div> : <section className="catalog container" id="products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Curadoria Nexus</span>
            {catalogOnly ? <h1>CATÁLOGO COMPLETO</h1> : <h2>ENCONTRE SEU PRÓXIMO UPGRADE</h2>}
          </div>

        </div>
        <div className="catalog-toolbar"><select aria-label="Ordenar produtos" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Mais relevantes</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome A–Z</option></select></div>
        <section className="price-filter"><button type="button" className="price-toggle" aria-expanded={priceOpen} aria-controls="price-fields" onClick={() => setPriceOpen(open => !open)}>Faixa de preço <span className={priceOpen ? 'is-open' : ''}><Icon name="chevron"/></span></button><div id="price-fields" className={`price-collapse ${priceOpen ? 'is-open' : ''}`} inert={!priceOpen}><div><div className="catalog-controls"><label>Preço mínimo (R$)<input type="number" min="0" step="0.01" value={min} onChange={e => setMin(e.target.value)}/></label><label>Preço máximo (R$)<input type="number" min="0" step="0.01" value={max} onChange={e => setMax(e.target.value)}/></label></div></div></div></section>
        <div className="catalog-layout"><aside className="catalog-sidebar" aria-label="Filtros do catálogo"><fieldset><legend>Categorias</legend>{categories.map(item => <label key={item}><input type="radio" name="category" checked={category === item} onChange={() => setCategory(item)}/>{item}</label>)}</fieldset><fieldset><legend>Disponibilidade</legend>{[['all', 'Todos'], ['available', 'Disponível'], ['sold-out', 'Esgotado']].map(([value, label]) => <label key={value}><input type="radio" name="availability" checked={availability === value} onChange={() => setAvailability(value)}/>{label}</label>)}</fieldset><button type="button" className="clear-filters" onClick={reset}>Limpar filtros</button></aside><div className="catalog-products">
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
        </div></div>
      </section>}
    </main>
  )
}

