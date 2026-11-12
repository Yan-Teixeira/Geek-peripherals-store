import { useEffect, useState } from 'react'
import { api, isDemo } from '../services/api'
import type { Product, Variation } from '../types'
import { errorMessage, money } from '../utils'
import { Button } from './Button'

export function VariationEditor({ product, onSaved }: { product: Product; onSaved: () => Promise<void> }) {
  const [items, setItems] = useState<Variation[]>([])
  const [editing, setEditing] = useState<Variation | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let active = true
    setEditing(null); setItems([]); setError('')
    if (!isDemo) api.variations(product.id).then(values => { if (active) setItems(values) }).catch(e => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [product.id])
  if (isDemo) return <p className="notice">O cadastro de variações fica disponível ao conectar à API.</p>
  async function refresh() { setItems(await api.variations(product.id)); await onSaved() }
  return <section className="form-panel fields"><h2>VARIAÇÕES · {product.name}</h2>
    <p>Cadastre cor, tamanho ou capacidade com preço e estoque próprios.</p>
    {error && <p role="alert" className="notice error">{error}</p>}
    {items.map(item => <div key={item.id} className="inline-actions"><span>{item.type}: {item.value} · {money(item.priceInCents)} · {item.stock} unidades</span><Button variant="secondary" disabled={busy} onClick={() => setEditing(item)}>Editar</Button><Button variant="secondary" disabled={busy} onClick={async () => {
      if (!window.confirm(`Excluir a variação ${item.value}?`)) return
      setBusy(true); setError('')
      try { await api.deleteVariation(product.id, item.id); if (editing?.id === item.id) setEditing(null); await refresh() } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
    }}>Excluir</Button></div>)}
    <form key={`${product.id}-${editing?.id || 'new'}`} className="fields" onSubmit={async event => {
      event.preventDefault(); const form = event.currentTarget; const data = new FormData(form)
      setBusy(true); setError('')
      try {
        await api.saveVariation(product.id, { type: String(data.get('type')) as Variation['type'], value: String(data.get('value')).trim(), priceInCents: Math.round(Number(data.get('price')) * 100), stock: Number(data.get('stock')) }, editing?.id)
        setEditing(null); form.reset(); await refresh()
      } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
    }}><fieldset disabled={busy} className="fields" style={{ border: 0, padding: 0 }}>
      <label>Tipo<select name="type" defaultValue={editing?.type || 'Cor'}><option>Cor</option><option>Tamanho</option><option>Capacidade</option></select></label>
      <label>Valor<input name="value" required maxLength={80} defaultValue={editing?.value}/></label>
      <div className="form-columns"><label>Preço (R$)<input name="price" type="number" required min="0.01" step="0.01" defaultValue={editing ? editing.priceInCents / 100 : ''}/></label><label>Estoque<input name="stock" type="number" required min="0" step="1" defaultValue={editing?.stock ?? 0}/></label></div>
      <div className="inline-actions"><Button type="submit">{busy ? 'Salvando...' : editing ? 'Salvar variação' : 'Adicionar variação'}</Button>{editing && <Button variant="secondary" onClick={() => setEditing(null)}>Cancelar edição</Button>}</div>
    </fieldset></form>
  </section>
}
