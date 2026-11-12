# Home dinâmica e movimento acessível

- GET /api/home retorna featured (até 4 mais vistos), weeklyOffers (até 4 marcados), bestsellers e distinctSoldProducts. Só entram produtos ativos. Empates usam o ID para uma ordem estável.
- POST /api/products/:id/views exige sessão. Cada visita autenticada aos detalhes incrementa viewsCount com $inc; React StrictMode não duplica o envio. Visitantes anônimos podem consultar detalhes, mas não registrar views. Este contador mede visitas, não usuários únicos, e não é uma métrica antifraude.
- PATCH /api/products/:id/weekly-offer exige admin e recebe { "isWeeklyOffer": true/false }. A flag também pode ser definida no formulário de produto. Não altera automaticamente o preço.
- Mais vendidos soma unidades dos itens de pedidos Pago, Enviado ou Entregue e agrupa por productId. Só aparece com pelo menos dois produtos ativos distintos vendidos; várias unidades do mesmo produto não satisfazem a condição. Pedidos aguardando pagamento e cancelados não contam. A seção tem no máximo quatro produtos.
- Os campos novos usam defaults (zero/false), sem apagar registros ou exigir recadastro. Nenhuma venda é criada ou marcada como paga por esta implementação. O pagamento real continua pendente de integração.
- Dados da home vêm da API no modo real. O modo demo simula os mesmos critérios em memória, sem usar featured/bestseller estáticos como prova de venda.
- A rotação da estrela ocorre a cada nove segundos. Reveal usa IntersectionObserver e parallax usa requestAnimationFrame com evento passivo. Não há biblioteca nova nem interceptação da roda do mouse. A rolagem suave é nativa.
- Preferência do sistema ou opção Reduzir movimentos desliga rotação, reveal, parallax e deslocamentos em botões. Foco por teclado revela conteúdo imediatamente. Alto contraste remove transparência dos cards e menus.

## Validação

`node --test server/tests/home.test.js` cobre autorização, incremento atômico, validação da flag e respostas da home com zero/um/dois produtos vendidos usando modelos substituídos em memória. Não escreve no Atlas. `npm run build --prefix client` valida os tipos e gera o frontend.

Para conferir no ambiente de desenvolvimento: visitar produto como cliente, voltar à home, marcar/desmarcar oferta no admin, e conferir o ranking com pedidos confirmados já existentes. Conferir cards com títulos de diferentes tamanhos, navegação por teclado e redução de movimento no sistema e no menu.
