import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { images } from '../data/products'

export function AboutPage() {
  return <main className="about-page container">
    <section className="about-intro">
      <div><span className="eyebrow">Conheça a Nexus</span><h1>TECNOLOGIA PARA<br/><em>O SEU PRÓXIMO NÍVEL.</em></h1>
        <p>A NEXUS//LAB nasceu de uma ideia: tornar a escolha do próximo upgrade mais simples para quem vive a cultura geek e gosta de tecnologia.</p>
        <p>Reunimos periféricos e componentes em um só lugar, com informações organizadas para você explorar possibilidades e montar um setup com a sua personalidade.</p>
        <Link className="button button--primary" to="/catalogo">Explorar catálogo <Icon name="arrow"/></Link>
      </div>
      <img src={images.setup} alt="Setup com computador e periféricos iluminados"/>
    </section>
    <section className="about-values" aria-label="O que nos inspira">
      <article className="form-panel"><Icon name="cpu" size={28}/><h2>Paixão por hardware</h2><p>Do primeiro computador ao próximo upgrade, cada escolha faz parte da experiência.</p></article>
      <article className="form-panel"><Icon name="search" size={28}/><h2>Escolhas mais claras</h2><p>Busque por categoria, compare preços e confira os detalhes de cada produto.</p></article>
      <article className="form-panel"><Icon name="user" size={28}/><h2>Uma loja para todos</h2><p>Navegação responsiva e opções de leitura, contraste e movimento para diferentes necessidades.</p></article>
    </section>
    <section className="form-panel about-project"><span className="eyebrow">Do conceito à prática</span><h2>UM PROJETO DE ARQUITETURA WEB</h2><p>Esta loja é um projeto acadêmico de e-commerce geek. O frontend utiliza React e foi desenvolvido a partir da identidade visual NEXUS//LAB. O catálogo e as compras demonstrativas permitem explorar o fluxo da loja, sem cobrança ou entrega de produtos reais.</p><Link to="/catalogo">Conheça os produtos do projeto</Link></section>
  </main>
}
