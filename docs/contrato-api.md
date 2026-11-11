# Proposta de contrato de API

Este contrato é uma proposta para alinhar a dupla. Nenhuma rota está implementada ou validada ainda.

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

Cadastro via /auth/register completa a operação de criação de usuários. Definir política de exclusão preservando histórico de pedidos e referências. Produtos desativados podem preservar o histórico sem aceitar novas compras.

Usuário: `{ id, name, email, role }`, com role `admin` ou `user`. Nunca retornar hash de senha.

Produto: `{ id, name, description, category, priceInCents, stock, images }`.

Pedido: `{ id, userId, items, totalInCents, status, createdAt }`. Cada item referencia um produto. O servidor calcula valores e verifica estoque, sem confiar no total enviado pelo navegador.

Erros propostos: `{ message, fieldErrors? }`. Usar 400 para entrada inválida, 401 para ausência/expiração da autenticação, 403 para acesso negado, 404 para recurso ausente e 409 para conflitos como e-mail duplicado.

Definir com a dupla o mecanismo de sessão antes da implementação; preferir cookie HttpOnly com configuração de CORS/credenciais adequada. Se usar token, documentar armazenamento, expiração e logout. Proteger operações com cookie contra CSRF. Nunca confiar em role informado pelo navegador para conceder privilégios.

## Pagamentos e checkout

O checkout do frontend inclui Pix, crédito, débito e boleto em **modo demonstrativo**. O QR temporário exibido nessa configuração contém um payload identificador da demonstração, não uma cobrança Pix. Na integração real, o backend deverá criar a cobrança com um provedor de pagamentos e devolver os dados seguros que a interface precisa exibir (por exemplo, QR e código Pix copia e cola, vencimento ou token de sessão do cartão). O backend deve validar o estado por webhook do provedor antes de marcar o pedido como pago.

Nunca envie nem persista número completo do cartão, CVV ou validade no banco MongoDB, nos pedidos, logs ou endpoints próprios. Para cartão, use os campos/tokenização hospedados pelo provedor e envie ao backend somente o token seguro. O servidor calcula o total com os preços atuais do catálogo e confirma estoque; valores do cliente servem apenas para apresentação.
