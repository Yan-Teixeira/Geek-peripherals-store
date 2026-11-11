# Proposta de contrato de API

Este contrato descreve a API implementada em `server/src`. A sessão usa cookie JWT HttpOnly com validade de 7 dias; chamadas do navegador devem incluir credenciais (o frontend já faz isso). Configure `CLIENT_ORIGIN` com a origem exata do frontend.

Base local proposta: `http://localhost:3000/api`. Dados em JSON. Valores monetários em centavos inteiros, quantidades inteiras positivas. IDs gerados pelo servidor.

| Método | Rota | Finalidade | Acesso proposto |
| --- | --- | --- | --- |
| POST | /auth/register | Cadastro sem permitir escolher papel admin | Público |
| POST | /auth/login | Autenticar | Público |
| GET | /auth/me | Recuperar sessão/usuário | Autenticado |
| POST | /auth/logout | Encerrar sessão | Autenticado |
| GET | /products | Listar e filtrar produtos | Público |
| GET | /products/:id | Detalhes de produto | Público |
| POST | /products | Criar produto | Admin |
| PATCH | /products/:id | Editar produto | Admin |
| DELETE | /products/:id | Excluir produto | Admin |
| GET | /users | Listar usuários | Admin |
| GET | /users/:id | Consultar usuário | Próprio usuário ou admin |
| PATCH | /users/:id | Editar dados permitidos | Próprio usuário ou admin |
| DELETE | /users/:id | Excluir conta conforme política definida | Próprio usuário ou admin |
| POST | /orders | Criar pedido com produtos e quantidades | Autenticado |
| GET | /orders | Listar pedidos próprios; admin pode listar todos | Autenticado |
| GET | /orders/:id | Detalhes de pedido | Dono ou admin |
| GET | /dashboard | Totais de vendas | Admin |
| PATCH | /orders/:id | Atualizar status do pedido | Admin |
| DELETE | /orders/:id | Excluir pedido | Admin |

`GET /products` aceita `q` para busca textual e `category` para filtrar. Administrador autenticado também recebe produtos inativos. `GET /orders?all=true` lista todos somente para administrador; cliente recebe sempre os próprios.

Cadastro via /auth/register completa a operação de criação de usuários. Definir política de exclusão preservando histórico de pedidos e referências. Produtos desativados podem preservar o histórico sem aceitar novas compras.

Usuário: `{ id, name, email, role }`, com role `admin` ou `user`. Nunca retornar hash de senha.

Produto exposto pela API: `{ id, name, description, category, priceInCents, stock, images }`. Internamente, o produto referencia uma categoria por `categoryId`; ao cadastrar pelo painel, a API localiza ou cria a categoria pelo nome. O documento MongoDB armazena valores monetários em centavos inteiros.

Pedido: `{ id, userId, items, totalInCents, status, createdAt }`. O documento de pedido e seus itens ficam em coleções separadas (`pedidos` e `pedido_itens`). Cada item expõe `productId`, nome, imagem, preço unitário em centavos e quantidade, e mantém referência MongoDB ao produto. O servidor calcula valores e verifica/baixa estoque em transação, sem confiar no total enviado pelo navegador. MongoDB precisa estar em replica set para suportar transações (Atlas já oferece esse modo). `shippingAddressId` existe no model e é opcional até a tela de endereço ser integrada ao checkout.

As coleções seguem o diagrama em português: `clientes`, `categorias`, `produtos`, `variacoes`, `enderecos`, `carrinho_itens`, `pedidos` e `pedido_itens`. Campos de API são convertidos para os nomes do frontend; o cliente não precisa conhecer os campos internos do MongoDB.

Erros: `{ message, fieldErrors? }`. 400 para entrada inválida, 401 para ausência/expiração da autenticação, 403 para acesso negado, 404 para recurso ausente e 409 para conflitos como e-mail duplicado ou estoque insuficiente.

Nunca confiar em role informado pelo navegador para conceder privilégios. Cookie SameSite=Strict e CORS de origem única reduzem exposição a CSRF. Cadastro não aceita papel; criação do primeiro admin deve ser feita diretamente no banco por responsável autorizado.
