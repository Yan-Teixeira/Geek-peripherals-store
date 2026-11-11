# Contrato atual da API

Este contrato descreve a API implementada em `server/src`. A sessão usa cookie JWT HttpOnly com validade de 7 dias; chamadas do navegador devem incluir credenciais (o frontend já faz isso). Configure `CLIENT_ORIGIN` com a origem exata do frontend. A API ainda não oferece integração de pagamento nem persiste o endereço enviado pelo checkout.

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

O cadastro cria sempre um usuário comum e autentica a sessão. Contas vinculadas a pedidos não podem ser excluídas. Produtos vinculados a pedidos, itens de carrinho ou variações são desativados em vez de removidos; produtos sem referências podem ser excluídos.

Usuário: `{ id, name, email, role }`, com role `admin` ou `user`. Nunca retornar hash de senha.

Produto exposto pela API inclui `{ id, name, description, category, priceInCents, oldPriceInCents?, stock, images, badge?, specs }`. Internamente, o produto referencia uma categoria por `categoryId`; ao cadastrar pelo painel, a API localiza ou cria a categoria pelo nome. O documento MongoDB armazena valores monetários em centavos inteiros. Produtos inativos não aparecem para visitantes.

Pedido: `{ id, userId, items, totalInCents, status, createdAt }`. O documento de pedido e seus itens ficam em coleções separadas (`pedidos` e `pedido_itens`). Cada item expõe `productId`, nome, imagem, preço unitário em centavos e quantidade, e mantém referência MongoDB ao produto. O servidor calcula valores e verifica/baixa estoque em transação, sem confiar no total enviado pelo navegador. MongoDB precisa estar em replica set para suportar transações (Atlas já oferece esse modo). `shippingAddressId` existe no model e é opcional. Atualmente, `POST /orders` consome somente `items`; campos de endereço e pagamento enviados pelo frontend ainda não são persistidos. O pedido fica com status `Aguardando Pagamento` e o estoque é baixado durante sua criação.

As coleções seguem o diagrama em português: `clientes`, `categorias`, `produtos`, `variacoes`, `enderecos`, `carrinho_itens`, `pedidos` e `pedido_itens`. Campos de API são convertidos para os nomes do frontend; o cliente não precisa conhecer os campos internos do MongoDB.

Erros usam `{ message, fieldErrors? }`. A API retorna 400 para entrada inválida, 401 para ausência/expiração da autenticação, 403 para acesso negado, 404 para recurso ausente, 409 para conflitos e estoque insuficiente, e 500 para erros internos. Nunca confie em papel informado pelo navegador. O cookie usa `SameSite=Strict`; CORS aceita somente a origem configurada. O cadastro não aceita papel. Crie o primeiro administrador diretamente no banco, por responsável autorizado.

## Pagamentos e checkout

O checkout do frontend inclui Pix, crédito, débito e boleto em **modo demonstrativo**. O QR temporário exibido nessa configuração contém um payload identificador da demonstração, não uma cobrança Pix. Na integração real, o backend deverá criar a cobrança com um provedor de pagamentos e devolver os dados seguros que a interface precisa exibir (por exemplo, QR e código Pix copia e cola, vencimento ou token de sessão do cartão). O backend deve validar o estado por webhook do provedor antes de marcar o pedido como pago.

Nunca envie nem persista número completo do cartão, CVV ou validade no MongoDB, nos pedidos, logs ou endpoints próprios. Para cartão, use a tokenização do provedor e envie ao backend somente o token seguro. O servidor deve calcular o total com os preços atuais do catálogo e confirmar estoque; valores do cliente servem apenas para apresentação.
