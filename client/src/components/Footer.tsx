import { Link } from 'react-router-dom'
import { Icon } from './Icon'
export function Footer() {
  return <footer className="store-footer"><div className="container">
    <div className="footer-grid">
      <section className="footer-brand"><Link to="/" className="brand" aria-label="Nexus Lab início"><span className="brand__mark"><Icon name="spark" size={18}/></span><span>NEXUS<span>//</span>LAB</span></Link><p>Seu setup. Seu domínio.<br/>Hardware e periféricos para o seu próximo upgrade.</p><span className="eyebrow">Tecnologia · Performance · Cultura geek</span></section>
      <nav aria-label="Explore a loja"><h2>Explore</h2><Link to="/">Destaques da loja</Link><Link to="/catalogo">Catálogo completo</Link><Link to="/sobre">Sobre a Nexus</Link></nav>
      <nav aria-label="Sua conta"><h2>Sua experiência</h2><Link to="/conta">Minha conta e pedidos</Link><Link to="/login">Entrar</Link><Link to="/cadastro">Criar conta</Link><Link to="/pagamento">Finalizar pedido</Link></nav>
      <section><h2>Formas de pagamento</h2><div className="footer-payments"><span>Pix</span><span>Crédito</span><span>Débito</span><span>Boleto</span></div><p>Modalidades disponíveis para simulação neste projeto acadêmico.</p><p>Use o botão de acessibilidade para ajustar texto, contraste e movimento.</p></section>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} NEXUS//LAB</span><p>Projeto acadêmico de Arquitetura Web. Sem pagamentos ou entregas reais.</p><a href="#content">Voltar ao conteúdo ↑</a></div>
  </div></footer>
}
