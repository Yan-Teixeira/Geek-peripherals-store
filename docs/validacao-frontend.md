# Validação do frontend

Verificado localmente em 11/11/2026. Dados de teste fictícios, modo demonstrativo.

## Verificações automatizadas

- `npm run build`: TypeScript e bundle de produção Vite.
- `npm test`: três testes passaram (recuperação de dados inválidos do carrinho, soma de quantidades sem mutação, rejeição de quantidade inválida/estoque excedido).

## Navegador

- Loja renderizada com os estilos, imagens e identidade visual do ZIP do Figma.
- Busca por GeForce exibe apenas o produto correspondente.
- Detalhe da GeForce mostra o produto correto, sem reutilizar conteúdo do teclado.
- Adicionar duas unidades resulta em subtotal R$ 10.799,80.
- Checkout sem sessão redireciona ao login; login retorna ao checkout.
- Senha incorreta exibe mensagem de erro.
- Pedido simulado confirmado, carrinho esvaziado e pedido exibido no histórico.
- Cliente tentando acessar `/admin` recebe acesso restrito.
- Administrador acessa métricas e tabela.
- Criação de produto: catálogo passa de 4 para 5 itens.
- Edição de nome/preço refletida na tabela.
- Exclusão com confirmação retorna o catálogo a 4 itens.
- Logout volta ao login e remove acesso administrativo da navegação.
- Cadastro fictício concluído.
- Layout mobile conferido em viewport 390 × 844, incluindo loja, detalhe e cadastro.
- Loja e detalhe sem transbordamento horizontal; todas as cinco imagens da loja e cinco da galeria estavam carregadas.

## Pendente

- Integração com servidor real, cookie de sessão, erros HTTP e expiração de sessão em ambiente integrado.
- Persistência, hash bcrypt, autorização no servidor e CRUD da segunda entidade.
- Fluxo de pagamento/frete (não implementado).
- Testes em aparelhos físicos e em outros navegadores.

As verificações do frontend não comprovam os requisitos de segurança ou de persistência do trabalho completo.
