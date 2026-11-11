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
    category: "Fontes",
    price: 749.9,
    oldPrice: 829.9,
    image: images.tower,
    badge: "Frete grátis",
  },
]


const originalSeedProducts: Product[] = originalProducts.map((p, i): Product => ({
  id: String(p.id), name: p.title, category: p.category, priceInCents: Math.round(p.price * 100),
  oldPriceInCents: Math.round(p.oldPrice * 100), images: i === 0 ? [images.keyboard, images.keyboardOrange, images.keyboardDesk, images.setup] : [p.image],
  badge: p.badge, stock: [42, 8, 18, 0][i], featured: i < 4, bestseller: i === 0 || i === 2,
  description: i === 0 ? 'Precisão absoluta em cada comando. Construção premium em alumínio, switches hot-swap e iluminação RGB por tecla.' : 'Hardware selecionado pela curadoria Nexus para o seu próximo upgrade.',
  specs: i === 0 ? {Switches: 'Nexus Linear Red · Hot-swap', Conectividade: 'USB-C removível · 1.8m', Estrutura: 'Alumínio anodizado', Compatibilidade: 'Windows · macOS · Linux'} : {},
}))

const expandedProducts: Product[] = [
  {
    "id": "ram-16",
    "name": "Memória RAM Nexus 16GB DDR4 3200MHz",
    "category": "Memória RAM",
    "priceInCents": 24990,
    "stock": 30,
    "images": [
      "/products/ram-16.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Memória RAM Nexus 16GB DDR4 3200MHz. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "ram-32",
    "name": "Memória RAM Nexus 32GB DDR5 6000MHz",
    "category": "Memória RAM",
    "priceInCents": 69990,
    "stock": 14,
    "images": [
      "/products/ram-32.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Memória RAM Nexus 32GB DDR5 6000MHz. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "case-air",
    "name": "Gabinete Nexus Airflow Mid Tower",
    "category": "Gabinetes",
    "priceInCents": 32990,
    "stock": 18,
    "images": [
      "/products/case-air.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Gabinete Nexus Airflow Mid Tower. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "case-glass",
    "name": "Gabinete Nexus Glass ATX",
    "category": "Gabinetes",
    "priceInCents": 59990,
    "stock": 9,
    "images": [
      "/products/case-glass.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Gabinete Nexus Glass ATX. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "ssd-500",
    "name": "SSD Nexus NVMe 500GB",
    "category": "SSDs",
    "priceInCents": 23990,
    "stock": 23,
    "images": [
      "/products/ssd-500.svg"
    ],
    "badge": "Linha Nexus",
    "description": "SSD Nexus NVMe 500GB. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "ssd-1tb",
    "name": "SSD Nexus NVMe 1TB",
    "category": "SSDs",
    "priceInCents": 39990,
    "stock": 27,
    "images": [
      "/products/ssd-1tb.svg"
    ],
    "badge": "Linha Nexus",
    "description": "SSD Nexus NVMe 1TB. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "mouse",
    "name": "Mouse Nexus Precision 16000 DPI",
    "category": "Mouses",
    "priceInCents": 17990,
    "stock": 32,
    "images": [
      "/products/mouse.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Mouse Nexus Precision 16000 DPI. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "headset",
    "name": "Headset Nexus Surround USB",
    "category": "Headsets",
    "priceInCents": 29990,
    "stock": 20,
    "images": [
      "/products/headset.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Headset Nexus Surround USB. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "monitor",
    "name": "Monitor Nexus 24 polegadas 180Hz",
    "category": "Monitores",
    "priceInCents": 89990,
    "stock": 11,
    "images": [
      "/products/monitor.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Monitor Nexus 24 polegadas 180Hz. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "cpu",
    "name": "Processador Nexus 6 núcleos 12 threads",
    "category": "Processadores",
    "priceInCents": 89990,
    "stock": 16,
    "images": [
      "/products/cpu.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Processador Nexus 6 núcleos 12 threads. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "motherboard",
    "name": "Placa-mãe Nexus B650 DDR5",
    "category": "Placas-mãe",
    "priceInCents": 109990,
    "stock": 8,
    "images": [
      "/products/motherboard.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Placa-mãe Nexus B650 DDR5. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "cooler",
    "name": "Cooler Nexus Tower 120mm",
    "category": "Refrigeração",
    "priceInCents": 15990,
    "stock": 22,
    "images": [
      "/products/cooler.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Cooler Nexus Tower 120mm. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  },
  {
    "id": "psu",
    "name": "Fonte Nexus 650W 80 Plus Bronze",
    "category": "Fontes",
    "priceInCents": 34990,
    "stock": 24,
    "images": [
      "/products/psu.svg"
    ],
    "badge": "Linha Nexus",
    "description": "Fonte Nexus 650W 80 Plus Bronze. Produto fictício do catálogo acadêmico, com preço demonstrativo e imagem ilustrativa. Confirme a compatibilidade antes de montar seu setup."
  }
]

export const seedProducts = [...originalSeedProducts, ...expandedProducts]
