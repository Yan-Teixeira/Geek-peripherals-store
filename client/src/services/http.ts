export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message) }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')}${path}`, {
      ...init, credentials: 'include', signal: controller.signal,
      headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
    })
    const body = await response.text()
    let data: unknown
    try { data = body ? JSON.parse(body) : undefined } catch { throw new ApiError('A API retornou uma resposta inválida.', response.status) }
    if (!response.ok) {
      if (response.status === 401) window.dispatchEvent(new Event('auth:expired'))
      const message = data && typeof data === 'object' && 'message' in data ? String(data.message) : 'Não foi possível concluir a solicitação.'
      throw new ApiError(message, response.status)
    }
    return data as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (controller.signal.aborted) throw new Error('A API demorou para responder. Tente novamente.')
    throw new Error('Não foi possível conectar à API. Verifique se o backend está em execução.')
  } finally { clearTimeout(timeout) }
}
