export const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Não foi possível concluir a operação.'
