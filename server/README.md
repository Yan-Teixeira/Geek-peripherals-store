# API Geek Peripherals Store

API JSON em Node.js, Express, MongoDB/Mongoose e bcryptjs. A estrutura MVC divide modelos, controladores e rotas. Os models seguem o diagrama de dados da loja, com coleções `clientes`, `categorias`, `produtos`, `variacoes`, `enderecos`, `carrinho_itens`, `pedidos` e `pedido_itens`. A API mantém o contrato esperado pelo frontend (por exemplo, `priceInCents` e `productId`) e converte esses valores para o formato interno dos models.

Produtos guardam referência à categoria; a categoria é criada automaticamente quando o administrador cadastra um produto novo. Pedidos e itens são documentos separados, relacionados por referência. O pedido mantém preço, nome e imagem do item como snapshot histórico. Preços são inteiros em centavos em todo o backend. Endereço de entrega é opcional no pedido até a tela de checkout/endereço ser implementada. O carrinho atual ainda fica no estado local do frontend; o model `CartItem` já deixa a persistência preparada para uma etapa futura.

## Executar localmente

Requisitos: Node.js 20 ou superior e MongoDB local ou Atlas.

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edite `.env`: informe a URI MongoDB e substitua `JWT_SECRET` por segredo aleatório de pelo menos 32 caracteres. Inicie com `npm run dev` (reinício automático) ou `npm start`. A API inicia em `http://localhost:3000`; `GET /health` verifica disponibilidade.

## Segurança e acesso

O cadastro público sempre cria `role: user`; ele ignora campos de papel enviados pelo cliente. Senhas são armazenadas com bcrypt (12 rounds). JWT de 7 dias fica em cookie HttpOnly, SameSite=Strict e Secure em produção. CORS aceita somente `CLIENT_ORIGIN` com credenciais. Helmet e limite de tentativas nas rotas de autenticação estão ativos. Defina `NODE_ENV=production` atrás de HTTPS.

Produtos podem ser lidos sem login. Criação, edição e remoção exigem administrador. Clientes criam pedidos e leem os próprios; administradores leem todos, atualizam status e excluem pedidos. Exclusão de produto referenciado por pedido vira desativação lógica. Contas com pedidos não podem ser excluídas. `POST /api/auth/register` e `POST /api/auth/login` criam a sessão.

Consulte [`../docs/contrato-api.md`](../docs/contrato-api.md) para rotas e formatos alinhados ao frontend. Para promover o primeiro administrador, cadastre uma conta e altere seu campo `role` para `admin` diretamente no MongoDB; nunca exponha essa operação publicamente.
