import { useEffect, useState } from 'react'
import { categories, normalizeSearch } from '../catalog'
import { useCatalog } from '../contexts/CatalogContext'
import { api } from '../services/api'
import type { Dashboard, Product, ProductInput } from '../types'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { ErrorNotice, Loading } from '../components/Feedback'
import { money, errorMessage } from '../utils'

export function AdminPage() {
  const { products, loading, error: catalogError, refresh } = useCatalog()
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => { let active = true; api.dashboard().then(data => { if (active) setDashboard(data) }).catch(error => { if (active) setError(errorMessage(error)) }); return () => { active = false } }, [products])
  const visible = products.filter(p => normalizeSearch(`${p.name} ${p.category}`).includes(normalizeSearch(query)))
  async function save(data: ProductInput, id?: string) {
    await api.saveProduct(data, id)
    setEditing(null); await refresh()
  }
  return <main className="admin container">
    <div className="admin__heading"><div><span className="eyebrow">Central de operações</span><h1>VISÃO GERAL</h1><p>Acompanhe seus pedidos e gerencie o catálogo.</p></div><Button onClick={() => { setEditing('new'); setDeleting(null) }}><Icon name="plus"/> Cadastrar produto</Button></div>
    {error && <ErrorNotice message={error}/>}
    <section className="metrics">{[
      ['Vendas totais', dashboard ? money(dashboard.totalInCents) : '—', 'spark'],
      ['Pedidos', dashboard?.orderCount ?? '—', 'box'],
      ['Ticket médio', dashboard ? money(dashboard.averageInCents) : '—', 'grid'],
      ['Estoque crítico', dashboard?.lowStockCount ?? '—', 'cpu'],
    ].map(([label, value, icon]) => <article key={label}><span>{label}</span><strong>{value}</strong><small className={icon === 'cpu' ? 'warning' : 'up'}>{icon === 'cpu' ? 'Menos de 10 unidades' : 'Total registrado'}</small><i className="metric-icon"><Icon name={icon as 'spark' | 'box' | 'grid' | 'cpu'}/></i></article>)}</section>
    {editing && <ProductForm key={editing === 'new' ? 'new' : editing.id} product={editing === 'new' ? undefined : editing} onSave={save} onCancel={() => setEditing(null)}/>}
    {deleting && <section className="notice" role="alert"><p>Excluir <strong>{deleting.name}</strong> do catálogo?</p><div className="inline-actions"><Button disabled={busy} onClick={async () => { setBusy(true); setError(''); try { await api.deleteProduct(deleting.id); setDeleting(null); await refresh() } catch (error) { setError(errorMessage(error)) } finally { setBusy(false) } }}>{busy ? 'Excluindo...' : 'Confirmar exclusão'}</Button><Button variant="secondary" disabled={busy} onClick={() => setDeleting(null)}>Cancelar</Button></div></section>}
    <section className="inventory"><div className="inventory__heading"><div><h2>ESTOQUE ATUAL</h2><p>{products.length} produtos cadastrados</p></div><label className="table-search"><Icon name="search" size={17}/><input aria-label="Buscar no estoque" placeholder="Buscar no estoque..." value={query} onChange={event => setQuery(event.target.value)}/></label></div>
      {catalogError ? <ErrorNotice message={catalogError} retry={() => void refresh()}/> : loading ? <Loading/> : <><div className="table-wrap"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Quantidade</th><th>Status</th><th>Ações</th></tr></thead><tbody>{visible.map(product => <tr key={product.id}><td><div className="table-product"><img src={product.images[0]} alt=""/><span><strong>{product.name}</strong><small>{product.id}</small></span></div></td><td>{product.category}</td><td><strong>{money(product.priceInCents)}</strong></td><td><b className={product.stock < 10 ? 'low' : ''}>{product.stock}</b></td><td><span className={`status ${product.stock === 0 ? 'off' : product.stock < 10 ? 'warn' : 'ok'}`}><i/>{product.stock === 0 ? 'Esgotado' : product.stock < 10 ? 'Estoque baixo' : 'Em estoque'}</span></td><td><div className="inline-actions"><button className="row-action" aria-label={`Editar ${product.name}`} onClick={() => { setEditing(product); setDeleting(null) }}>Editar</button><button className="row-action" aria-label={`Excluir ${product.name}`} onClick={() => { setDeleting(product); setEditing(null) }}><Icon name="trash" size={16}/></button></div></td></tr>)}</tbody></table></div>{!visible.length && <p className="notice">Nenhum produto encontrado.</p>}<div className="table-footer"><span>Mostrando {visible.length} de {products.length} produtos</span></div></>}
    </section>
  </main>
}

function ProductForm({ product, onSave, onCancel }: { product?: Product; onSave: (data: ProductInput, id?: string) => Promise<void>; onCancel: () => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    const data = new FormData(event.currentTarget)
    try {
      const images = String(data.get('images')).split('\n').map(url => url.trim()).filter(Boolean)
      if (!images.length || images.some(url => { try { return !['http:', 'https:'].includes(new URL(url).protocol) } catch { return true } })) throw new Error('Informe URLs de imagem válidas, uma por linha.')
      const priceInCents = Math.round(Number(data.get('price')) * 100)
      const stock = Number(data.get('stock'))
      if (!Number.isSafeInteger(priceInCents) || priceInCents <= 0 || !Number.isSafeInteger(stock) || stock < 0) throw new Error('Preço ou estoque inválido.')
      await onSave({ name: String(data.get('name')).trim(), category: String(data.get('category')).trim(), description: String(data.get('description')).trim(), priceInCents, stock, images, badge: String(data.get('badge')).trim(), specs: product?.specs, oldPriceInCents: product?.oldPriceInCents }, product?.id)
    } catch (error) { setError(errorMessage(error)) } finally { setBusy(false) }
  }
  return <section className="form-panel product-form" aria-label={product ? 'Editar produto' : 'Novo produto'}><h2>{product ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}</h2>{error && <ErrorNotice message={error}/>}<form className="fields" onSubmit={submit}>
    <label>Nome<input name="name" required maxLength={150} defaultValue={product?.name}/></label>
    <label>Categoria<select name="category" defaultValue={product?.category || 'Teclados'}>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
    <label>Descrição<textarea name="description" required maxLength={2000} defaultValue={product?.description}/></label>
    <div className="form-columns"><label>Preço (R$)<input name="price" type="number" min="0.01" step="0.01" max="1000000" required defaultValue={product ? product.priceInCents / 100 : ''}/></label><label>Estoque<input name="stock" type="number" min="0" step="1" max="999999" required defaultValue={product?.stock ?? 0}/></label></div>
    <label>Selo do produto<input name="badge" maxLength={40} defaultValue={product?.badge}/></label>
    <label>Imagens (uma URL por linha)<textarea name="images" required defaultValue={product?.images.join('\n')}/></label>
    <div className="inline-actions"><Button type="submit" disabled={busy}>{busy ? 'Salvando...' : 'Salvar produto'}</Button><Button variant="secondary" disabled={busy} onClick={onCancel}>Cancelar</Button></div>
  </form></section>
}
