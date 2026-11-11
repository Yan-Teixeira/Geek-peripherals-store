import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types'
import { api } from '../services/api'
import { ApiError } from '../services/http'
import { errorMessage } from '../utils'

const AuthContext = createContext<{ user: User | null; loading: boolean; error: string; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void> } | null>(null)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    api.me().then(user => { if (active) setUser(user) }).catch(error => {
      if (active && !(error instanceof ApiError && error.status === 401)) setError(errorMessage(error))
    }).finally(() => { if (active) setLoading(false) })
    const expired = () => setUser(null)
    window.addEventListener('auth:expired', expired)
    return () => { active = false; window.removeEventListener('auth:expired', expired) }
  }, [])
  async function login(email: string, password: string) { const user = await api.login(email, password); setUser(user); setError('') }
  async function logout() { await api.logout(); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, error, login, logout }}>{children}</AuthContext.Provider>
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('AuthProvider ausente'); return context }
