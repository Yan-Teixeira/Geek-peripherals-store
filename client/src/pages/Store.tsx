import { useState } from 'react'
import { images } from '../data/products'
import type { Product } from '../types'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { ProductCard } from '../components/ProductCard'
export function Store({
  onProduct,
  onAdd, products, query,
}: {
  onProduct: (id: string) => void
  onAdd: (id: string) => void
  products: Product[]
  query: string
}) {
  const [category, setCategory] = useState("Todos")
  const categories = [
    "Todos",
    "Teclados",
    "PCs montados",
    "Placas de vídeo",
    "Componentes",
  ]
  const visible = products.filter(p => (category === "Todos" || p.category === category) && `${p.name} ${p.category}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")))

  return (
    <main>
      <section className="hero">
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

      <section className="catalog container" id="products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Curadoria Nexus</span>
            <h2>DESTAQUES DA SEMANA</h2>
          </div>
          <Button variant="ghost" onClick={() => setCategory("Todos")}>
            Ver catálogo completo <Icon name="arrow" />
          </Button>
        </div>
        <div className="filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
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
      </section>
    </main>
  )
}

