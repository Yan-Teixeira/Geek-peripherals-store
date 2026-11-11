# Geek Peripherals Store

Projeto acadêmico de Arquitetura Web: um e-commerce geek especializado em periféricos de computadores, com loja virtual e painel administrativo.

## Status

Repositório em preparação. A implementação começa pelo frontend. O código do Figma Make ainda precisa ser exportado/importado; frontend e backend **ainda não estão implementados nem executáveis**.

## Design

[E-commerce Gamer e Dashboard — Figma Make](https://www.figma.com/make/Hgswb9fAi6Bah2m0mEPPNF/E-commerce-Gamer-e-Dashboard)

## Tecnologias exigidas

- Frontend: React, react-router-dom, fetch ou axios, layout responsivo.
- Backend: Node.js, Express, MongoDB e Mongoose, organizado em MVC para API JSON.
- Segurança: login, senhas com hash bcrypt, perfis de administrador e usuário, autorização e validação no servidor.

## Estrutura

```text
client/                 # Frontend React (pendente)
server/                 # Backend API MVC (pendente)
docs/
  requisitos.md         # Checklist da entrega
  contrato-api.md       # Proposta para integração entre a dupla
  github.md             # Criação do repositório e uso de Git
```

## Funcionalidades planejadas

- Catálogo, busca e filtro por categoria.
- Detalhes e galeria de imagens dos produtos.
- Cadastro, login, logout e estado do usuário autenticado.
- Carrinho e criação de pedidos.
- Área administrativa para gerenciar produtos e visualizar vendas.
- Rotas de interface restritas conforme o perfil, com autorização efetiva também na API.
- Indicadores de carregamento, mensagens de erro e adaptação a desktop e celular.

## Execução local

Ainda não há `package.json` ou aplicação executável. Os comandos abaixo são a **convenção planejada**, a validar depois da implementação:

```bash
# Terminal 1 — após implementar o backend
cd server
npm install
# Copie .env.example para .env e preencha os valores.
npm start

# Terminal 2 — após implementar o frontend
cd client
npm install
# Copie .env.example para .env.
npm start
```

As variáveis previstas estão nos arquivos `.env.example` de cada pasta. Elas são uma proposta de integração e deverão corresponder ao código implementado. Nunca publique arquivos `.env` ou credenciais reais.

## Entrega acadêmica

O projeto completo precisa demonstrar cadastro, login, erro de login, CRUD de pelo menos duas entidades relacionadas e diferença de acesso entre administrador e usuário. A apresentação deve durar de 3 a 5 minutos.

Veja o [checklist de requisitos](docs/requisitos.md). O frontend isolado não conclui os requisitos de backend, persistência ou segurança do trabalho.

## Equipe

Preencher antes da entrega:

| Integrante | Responsabilidade |
| --- | --- |
| Nome do integrante | Frontend |
| Nome do integrante | Backend |

## Colaboração

Use branches por funcionalidade e commits semânticos, por exemplo: `feat: adiciona catálogo de produtos`, `fix: corrige validação de login` e `docs: atualiza instruções de execução`.
