# Atualização do catálogo e acessibilidade

Catálogo com 17 produtos demonstrativos e categorias centralizadas em `client/src/catalog.ts`. A rota `/catalogo` reutiliza o layout existente; filtros combinam busca sem acentos/aliases, categoria, preços mínimo e máximo e estoque, com ordenação por preço ou nome. Todos os novos preços são fictícios para o trabalho. As imagens locais em `client/public/products` são ilustrações identificadas, não fotos de fabricantes.

O botão azul com figura humana oferece texto ampliado, alto contraste, destaque de links e redução de movimento. Preferências ficam no navegador e podem ser restauradas. O painel aceita Escape e controles por teclado; não constitui certificação WCAG.

Sobre e Pagamento foram implementadas posteriormente a partir da descrição do usuário; veja `sobre-pagamento.md`. A comparação com as telas novas do Figma, a página dedicada de Acessibilidade e a reprodução do novo design de Catálogo continuam dependendo da exportação atualizada. O painel de acessibilidade já funciona. Os links internos retornados pelo conector não permitiram ler o conteúdo do Make nesta sessão.

Rodar em `client`: `npm start`. Validar: `npm run build` e `npm test`.
