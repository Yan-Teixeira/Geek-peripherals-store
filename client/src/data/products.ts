import type { Product } from '../types'
export const images = {
  keyboard:
    "https://images.unsplash.com/photo-1626958390943-a70309376444?auto=format&fit=crop&w=1200&q=85",
  keyboardOrange:
    "https://images.unsplash.com/photo-1626958390898-162d3577f293?auto=format&fit=crop&w=1200&q=85",
  keyboardDesk:
    "https://images.unsplash.com/photo-1598662779094-110c2bad80b5?auto=format&fit=crop&w=1200&q=85",
  setup:
    "https://images.unsplash.com/photo-1696710257827-75e2e5954059?auto=format&fit=crop&w=1600&q=85",
  pc: "https://images.unsplash.com/photo-1626218174358-7769486c4b79?auto=format&fit=crop&w=1200&q=85",
  gpu: "https://images.unsplash.com/photo-1632749042303-7f7a18ed6ff0?auto=format&fit=crop&w=1200&q=85",
  tower:
    "https://images.unsplash.com/photo-1573053986275-840ffc7cc685?auto=format&fit=crop&w=1200&q=85",
}

const originalProducts = [
  {
    id: 1,
    title: "Teclado Mecânico K75 Pro",
    category: "Teclados",
    price: 649.9,
    oldPrice: 729.9,
    image: images.keyboard,
    badge: "Mais vendido",
  },
  {
    id: 2,
    title: "PC Artemis RTX 4070 Super",
    category: "PCs montados",
    price: 8799.9,
    oldPrice: 9299.9,
    image: images.pc,
    badge: "Novo",
  },
  {
    id: 3,
    title: "GeForce RTX 4070 Ti 12GB",
    category: "Placas de vídeo",
    price: 5399.9,
    oldPrice: 5799.9,
    image: images.gpu,
    badge: "-8%",
  },
  {
    id: 4,
    title: "Fonte Nexus 850W 80 Plus Gold",
    category: "Componentes",
    price: 749.9,
    oldPrice: 829.9,
    image: images.tower,
    badge: "Frete grátis",
  },
]


export const seedProducts: Product[] = originalProducts.map((p, i): Product => ({
  id: String(p.id), name: p.title, category: p.category, priceInCents: Math.round(p.price * 100),
  oldPriceInCents: Math.round(p.oldPrice * 100), images: i === 0 ? [images.keyboard, images.keyboardOrange, images.keyboardDesk, images.setup] : [p.image],
  badge: p.badge, stock: [42, 8, 18, 0][i],
  description: i === 0 ? 'Precisão absoluta em cada comando. Construção premium em alumínio, switches hot-swap e iluminação RGB por tecla.' : 'Hardware selecionado pela curadoria Nexus para o seu próximo upgrade.',
  specs: i === 0 ? {Switches: 'Nexus Linear Red · Hot-swap', Conectividade: 'USB-C removível · 1.8m', Estrutura: 'Alumínio anodizado', Compatibilidade: 'Windows · macOS · Linux'} : {},
}))
