import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useCatalog } from '../contexts/CatalogContext'
import { api, isDemo } from '../services/api'
import { Button } from '../components/Button'
import { ErrorNotice, Loading } from '../components/Feedback'
import { Icon } from '../components/Icon'
import { money, errorMessage } from '../utils'
import { formatPostalCode, paymentNames, states, validateAddress, validateCheckout, validatePayment } from '../checkout'
import type { DeliveryAddress, Order, PaymentSelection } from '../types'
import { emptyCard, renewDemoPix, validateDemoCard } from '../payment-demo'
import type { DemoPix } from '../payment-demo'
import { CardFields, PixDetails } from '../components/PaymentDetails'

const initialAddress: DeliveryAddress = { recipient: '', postalCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' }

export function CheckoutPage() {
  const { items, clear } = useCart()
  const { products, loading, error: catalogError, refresh } = useCatalog()
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState(initialAddress)
  const [payment, setPayment] = useState<PaymentSelection>({ method: 'pix', installments: 1 })
  const [card, setCard] = useState(emptyCard)
  const [pix, setPix] = useState<DemoPix | null>(null)
  const [now, setNow] = useState(Date.now())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const submitting = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const total = items.reduce((sum, item) => sum + (products.find(p => p.id === item.productId)?.priceInCents || 0) * item.quantity, 0)
  const cartKey = items.map(item => `${item.productId}:${item.quantity}`).sort().join('|')
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer) }, [])
  useEffect(() => {
    if (step !== 1 || payment.method !== 'pix') return
    setPix(current => renewDemoPix(current, total, cartKey, Date.now(), () => globalThis.crypto.randomUUID()))
  }, [step, payment.method, total, cartKey, now])

  function goTo(next: number) {
    setStep(next); setError('')
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'center' }) })
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validation = step === 0 ? validateAddress(address) : validateCheckout({ address, payment }) || ((payment.method === 'card' || payment.method === 'debit') && isDemo ? validateDemoCard(card) : '')
    if (validation) { setError(validation); return }
    if (step < 2) { goTo(step + 1); return }
    if (submitting.current) return
    submitting.current = true; setBusy(true); setError('')
    try {
      const result = await api.createOrder(items, { address, payment })
      setOrder(result); clear(); await refresh()
    } catch (error) { setError(errorMessage(error)); await refresh() }
    finally { setBusy(false); submitting.current = false }
  }
  if (order) return <main className="form-page container"><section className="form-panel order-success"><span className="eyebrow">{isDemo ? 'Simulação concluída' : 'Pedido recebido'}</span><h1>Seu pedido foi registrado!</h1><p>{isDemo ? 'Nenhum valor foi cobrado. Este pedido faz parte da demonstração acadêmica.' : 'O registro do pedido não confirma o pagamento. Aguarde as instruções do serviço de pagamento.'}</p><p>Protocolo: {order.id}</p><p>Forma escolhida: {paymentNames[payment.method]}</p><p>Total dos produtos: <strong>{money(order.totalInCents)}</strong></p><Link className="button button--primary" to="/conta">Ver meus pedidos</Link></section></main>
  if (loading && !products.length) return <Loading/>
  if (catalogError) return <ErrorNotice message={catalogError} retry={() => void refresh()}/>
  if (!items.length) return <main className="form-page container"><section className="form-panel"><h1>Seu carrinho está vazio</h1><p>Escolha seus produtos antes de seguir para o pagamento.</p><Link className="button button--primary" to="/catalogo">Explorar catálogo</Link></section></main>
  const invalid = items.some(item => { const product = products.find(p => p.id === item.productId); return !product || item.quantity > product.stock })
  const updateAddress = (key: keyof DeliveryAddress, value: string) => setAddress(current => ({ ...current, [key]: value }))
  return <main className="payment-page container">
    <Link className="back-link" to="/catalogo"><Icon name="arrow"/> Continuar comprando</Link>
    <header className="payment-heading"><span className="eyebrow">Falta pouco para o seu próximo upgrade</span><h1>FINALIZAR PEDIDO</h1><p>Informe onde entregar, escolha como pagar e confira os detalhes antes de concluir.</p></header>
    <ol className="checkout-steps" aria-label="Etapas do pedido">{['Entrega', 'Pagamento', 'Revisão'].map((label, index) => <li key={label} className={step === index ? 'current' : step > index ? 'complete' : ''} aria-current={step === index ? 'step' : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
    <div className="payment-layout">
      <form className="form-panel payment-form" onSubmit={submit}>
        <h2 ref={heading} tabIndex={-1}>{['ENDEREÇO DE ENTREGA', 'FORMA DE PAGAMENTO', 'REVISE SEU PEDIDO'][step]}</h2>
        {isDemo && <p className="notice">Demonstração: utilize um endereço fictício. Não há cobrança, emissão de boleto ou envio de produtos.</p>}
        {error && <ErrorNotice message={error}/>}
        {step === 0 && <div className="fields">
          <label>Nome do destinatário<input required maxLength={100} autoComplete="shipping name" value={address.recipient} onChange={e => updateAddress('recipient', e.target.value)}/></label>
          <div className="form-columns"><label>CEP<input required inputMode="numeric" autoComplete="shipping postal-code" placeholder="00000-000" pattern="[0-9]{5}-[0-9]{3}" maxLength={9} value={address.postalCode} onChange={e => updateAddress('postalCode', formatPostalCode(e.target.value))}/></label><label>Estado<select required autoComplete="shipping address-level1" value={address.state} onChange={e => updateAddress('state', e.target.value)}><option value="">Selecione</option>{states.map(state => <option key={state}>{state}</option>)}</select></label></div>
          <label>Rua / Avenida<input required maxLength={160} autoComplete="shipping address-line1" value={address.street} onChange={e => updateAddress('street', e.target.value)}/></label>
          <div className="form-columns"><label>Número<input required maxLength={20} placeholder="Ex.: 123 ou S/N" value={address.number} onChange={e => updateAddress('number', e.target.value)}/></label><label>Complemento (opcional)<input maxLength={100} autoComplete="shipping address-line2" value={address.complement} onChange={e => updateAddress('complement', e.target.value)}/></label></div>
          <div className="form-columns"><label>Bairro<input required maxLength={100} value={address.neighborhood} onChange={e => updateAddress('neighborhood', e.target.value)}/></label><label>Cidade<input required maxLength={100} autoComplete="shipping address-level2" value={address.city} onChange={e => updateAddress('city', e.target.value)}/></label></div>
        </div>}
        {step === 1 && <>
          <fieldset className="payment-methods"><legend>Como você prefere pagar?</legend>{(['pix', 'card', 'debit', 'boleto'] as const).map(method => <label key={method} className={`payment-option ${payment.method === method ? 'selected' : ''}`}><input type="radio" name="payment" checked={payment.method === method} onChange={() => setPayment({ method, installments: 1 })}/><span><strong>{paymentNames[method]}</strong><small>{method === 'pix' ? 'À vista via Pix' : method === 'card' ? 'Em até 10 parcelas' : method === 'debit' ? 'À vista no débito' : 'À vista por boleto'}</small></span></label>)}</fieldset>
          {(payment.method === 'card' || payment.method === 'debit') ? <CardFields card={card} onChange={setCard} payment={payment} onPayment={setPayment} total={total} isDemo={isDemo}/> : payment.method === 'pix' ? <PixDetails pix={pix} now={now} isDemo={isDemo}/> : <p className="notice">Nesta demonstração, a escolha do boleto fica registrada no pedido. Nenhum boleto real é emitido.</p>}
        </>}
        {step === 2 && <div className="review-sections"><section><div className="review-heading"><h3>Entrega</h3><button type="button" onClick={() => goTo(0)}>Editar endereço</button></div><address>{address.recipient}<br/>{address.street}, {address.number}{address.complement && ` · ${address.complement}`}<br/>{address.neighborhood} · {address.city}/{address.state}<br/>CEP {address.postalCode}</address></section><section><div className="review-heading"><h3>Pagamento</h3><button type="button" onClick={() => goTo(1)}>Alterar pagamento</button></div><p>{paymentNames[payment.method]}{payment.method === 'card' && ` · ${payment.installments}x`}</p><p>O pedido será registrado como aguardando pagamento{isDemo ? ' (simulado)' : ''}.</p></section></div>}
        {invalid && <ErrorNotice message="Há produtos indisponíveis ou sem estoque suficiente. Revise o carrinho."/>}
        <div className="checkout-navigation">{step > 0 && <Button disabled={busy} variant="secondary" onClick={() => goTo(step - 1)}>Voltar</Button>}<Button type="submit" disabled={busy || invalid || loading || !!validatePayment(payment)}>{busy ? 'Registrando...' : step === 0 ? 'Continuar para pagamento' : step === 1 ? 'Revisar pedido' : isDemo ? 'Concluir pedido simulado' : 'Registrar pedido'}</Button></div>
      </form>
      <aside className="form-panel order-summary"><span className="eyebrow">Seu próximo upgrade</span><h2>RESUMO DO PEDIDO</h2><ul className="checkout-list">{items.map(item => { const product = products.find(p => p.id === item.productId); return <li key={item.productId}><span>{item.quantity} × {product?.name || 'Produto indisponível'}</span><strong>{money((product?.priceInCents || 0) * item.quantity)}</strong></li> })}</ul><div className="summary-total"><span>Subtotal</span><strong>{money(total)}</strong></div><p>Frete e prazo de entrega ainda não integrados. Nenhuma taxa de envio está incluída neste subtotal.</p><p><Icon name="check" size={16}/> Confira os dados antes de concluir.</p></aside>
    </div>
  </main>
}
