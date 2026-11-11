# Checklist de entrega

Fonte: PDF do Projeto Final de Arquitetura Web fornecido pelo usuário. Os itens abaixo distinguem exigências acadêmicas de decisões propostas para este projeto.

## Obrigatórios — frontend

- [x] React.
- [x] Consumo da API com fetch.
- [x] Navegação SPA com react-router-dom.
- [x] Estado do usuário autenticado e de seu nível de acesso.
- [x] Layout adaptado a desktop e mobile.
- [x] Feedback visual de erros.
- [x] Feedback de carregamento durante requisições.

## Obrigatórios — backend

- [x] Node.js e Express.
- [x] MVC adaptado à entrega de JSON.
- [x] MongoDB e Mongoose.
- [x] CRUD completo de produtos e pedidos relacionados a usuário e produto.
- [x] Login e hash de senha com bcrypt.
- [x] Pelo menos dois níveis de acesso.
- [x] Autorização de rotas no servidor.
- [x] Validação dos dados recebidos no servidor.

## Entrega e boas práticas

- [x] Pastas locais client e server criadas.
- [x] README inicial criado, com status explícito.
- [ ] Aplicações e instruções implementadas; inicialização da API ainda depende de instalar pacotes e configurar MongoDB.
- [x] Variáveis de ambiente documentadas em `.env.example`.
- [ ] Repositório publicado no GitHub e link disponível.
- [ ] Commits semânticos ao longo do desenvolvimento.
- [ ] Apresentação de 3–5 minutos: cadastro, login, erro de login, CRUD e diferença de permissões.

## Tema escolhido e propostas

E-commerce de periféricos. Produtos, usuários e pedidos são entidades propostas. A relação pedidos → usuário e itens → produtos precisa existir de fato no banco. Definir com a dupla quais duas entidades terão CRUD completo; apenas criar/listar pedidos não constitui CRUD completo.

Galeria e filtros são sugestões de UX do tema no PDF. Carrinho, compra e painel de vendas compõem o fluxo sugerido.

## Bônus, não obrigatórios

- [ ] Funcionalidade em tempo real com WebSockets.
- [ ] Deploy do backend e frontend.
- [ ] Teste unitário básico de uma rota crítica.

## Pesos de avaliação

Backend 30%; frontend 30%; segurança 20%; UX/UI 10%; boas práticas 10%.
