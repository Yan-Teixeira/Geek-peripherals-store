# Preparação do GitHub

Nome sugerido: `geek-peripherals-store`.

Descrição sugerida: `E-commerce geek de periféricos — projeto acadêmico Full Stack com React, Node.js, Express e MongoDB.`

O PDF aceita um repositório com client/server ou dois repositórios separados. Esta estrutura usa um único repositório. O PDF não determina nome, licença ou visibilidade.

## Criar e publicar

1. No GitHub, crie um repositório com o nome sugerido na sua conta.
2. Escolha a visibilidade desejada, garantindo acesso ao professor na entrega.
3. Não gere outro README ou .gitignore no GitHub, pois estes arquivos já existem localmente.
4. Na pasta raiz local, execute os comandos abaixo, substituindo SEU_USUARIO.

```bash
git init -b main
git add README.md .gitignore client server docs
git commit -m "docs: estrutura projeto e requisitos acadêmicos"
git remote add origin https://github.com/SEU_USUARIO/geek-peripherals-store.git
git push -u origin main
```

Os comandos ainda não foram executados. Se o Git solicitar identidade, configure seu nome e e-mail antes do commit. Se o repositório já tiver histórico remoto, faça a integração desse histórico; não use push forçado para sobrescrevê-lo.

## Desenvolvimento em dupla

Cada integrante deve trabalhar em uma branch e abrir pull requests para main. Exemplos: `feat/frontend-catalogo` e `feat/backend-auth`. Convide o outro integrante como colaborador no GitHub.

Antes de publicar: conferir arquivos com `git status`, não incluir .env, node_modules ou credenciais, e atualizar o README com apenas as funcionalidades realmente implementadas.
