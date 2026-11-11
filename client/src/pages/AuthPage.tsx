import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api, isDemo } from '../services/api'
import { Button } from '../components/Button'
import { ErrorNotice } from '../components/Feedback'
import { errorMessage } from '../utils'
export function AuthPage({ register = false }: { register?: boolean }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState('')
  const redirect = typeof location.state?.from === 'string' && location.state.from.startsWith('/') && !location.state.from.startsWith('//') ? location.state.from : '/conta'
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setSuccess('')
    const data = new FormData(event.currentTarget)
    try {
      const email = String(data.get('email')).trim()
      const password = String(data.get('password'))
      if (register) {
        if (password !== data.get('confirm')) throw new Error('As senhas não coincidem.')
        await api.register(String(data.get('name')), email, password)
        setSuccess('Cadastro realizado! Entre com seu e-mail e senha.')
      } else { await login(email, password); navigate(redirect, { replace: true }) }
    } catch (error) { setError(errorMessage(error)) } finally { setBusy(false) }
  }
  return <main className="form-page container"><section className="form-panel"><span className="eyebrow">Sua conta Nexus</span><h1>{register ? 'CRIE SUA CONTA' : 'BEM-VINDO DE VOLTA'}</h1>
    {isDemo && <p className="notice">Demonstração local. Use dados fictícios. Admin: <strong>admin@nexus.demo</strong> · Cliente: <strong>cliente@nexus.demo</strong> · Senha: <strong>Nexus123!</strong>. Cadastros e sessão são apagados ao recarregar.</p>}
    {error && <ErrorNotice message={error}/>} {success ? <div className="notice" role="status">{success} <Link to="/login" state={location.state}>Entrar</Link></div> : <form onSubmit={submit} className="fields">
      {register && <label>Nome<input name="name" autoComplete="name" required maxLength={100}/></label>}
      <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
      <label>Senha<input name="password" type="password" autoComplete={register ? 'new-password' : 'current-password'} required minLength={register ? 8 : 1} maxLength={72}/></label>
      {register && <label>Confirmar senha<input name="confirm" type="password" autoComplete="new-password" required minLength={8} maxLength={72}/></label>}
      <Button type="submit" disabled={busy}>{busy ? 'Aguarde...' : register ? 'Criar conta' : 'Entrar'}</Button>
    </form>}
    <p>{register ? 'Já tem conta?' : 'Ainda não tem conta?'} <Link to={register ? '/login' : '/cadastro'} state={location.state}>{register ? 'Entrar' : 'Cadastre-se'}</Link></p>
  </section></main>
}
