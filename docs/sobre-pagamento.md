# Sobre, pagamento e ajustes visuais

- `/sobre`: apresentação NEXUS//LAB, valores e contexto acadêmico; link no cabeçalho e rodapé.
- `/pagamento`: fluxo protegido com endereço de entrega, seleção de Pix/cartão/boleto e revisão antes de registrar pedido.
- `/checkout`: redireciona para `/pagamento`, preservando o caminho antigo usado pelo carrinho.
- Endereço e forma de pagamento permanecem no estado da tela ao avançar/voltar. Não são gravados em localStorage. Recarregar descarta o preenchimento.
- Formulário exige destinatário, CEP de oito dígitos, rua, número, bairro, cidade e UF; complemento é opcional. O CEP não é consultado externamente nem comprova que o endereço existe.
- Cartão oferece de 1 a 10 parcelas; Pix/boleto são à vista. Não há captura de dados de cartão, gateway, QR Code real ou emissão de boleto.
- O pedido demonstrativo guarda os dados informados em memória e recebe status `Aguardando pagamento (simulado)`. Não há confirmação de pagamento real.
- Frete e prazo ainda não são calculados; o resumo apresenta somente subtotal dos produtos e informa essa limitação.
- `client/src/refinements.css`: margens de textos, formulários e caixas; raios de 12 px para cards/controles e 15 px para a imagem de Sobre.

## Contrato atualizado para o backend

`POST /orders` recebe `{ items, address, payment }`.

`address`: `{ recipient, postalCode, street, number, complement, neighborhood, city, state }`.

`payment`: `{ method: 'pix' | 'card' | 'boleto', installments: number }`.

Validar todos os campos, preço/estoque, entrega e condições de parcelamento no servidor. O cliente não envia total como fonte de verdade. A resposta Order pode incluir `checkout: { address, payment }`. Aprovação de pagamento real exige integração com provedor e confirmação confiável no backend.

## Design

Estas telas foram implementadas pela descrição do usuário e identidade visual já exportada. A leitura do conteúdo das novas telas no Figma Make continuou indisponível; não foi feita comparação fiel com o novo Figma.
