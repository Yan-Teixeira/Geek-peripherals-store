import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { demoPixPayload, formatCardNumber, formatExpiry } from '../payment-demo'
import type { DemoCard, DemoPix } from '../payment-demo'
import type { PaymentSelection } from '../types'
import { money } from '../utils'

export function CardFields({ card, onChange, payment, onPayment, total, isDemo }: { card: DemoCard; onChange: (card: DemoCard) => void; payment: PaymentSelection; onPayment: (payment: PaymentSelection) => void; total: number; isDemo: boolean }) {
  const change = (key: keyof DemoCard, value: string) => onChange({ ...card, [key]: value })
  return <section className="card-fields fields" aria-label="Dados do cartão">
    <p className="notice">{isDemo ? 'Use somente dados fictícios: 4111 1111 1111 1111, validade futura e CVV 123. Os dados do cartão não são enviados nem salvos.' : 'Pagamento real com cartão indisponível até integrar um provedor seguro.'}</p>
    <label>Número do cartão<input disabled={!isDemo} required inputMode="numeric" autoComplete="off" placeholder="0000 0000 0000 0000" maxLength={19} value={card.number} onChange={e => change('number', formatCardNumber(e.target.value))}/></label>
    <label>Nome impresso no cartão<input disabled={!isDemo} required autoComplete="off" placeholder="NOME COMPLETO" maxLength={80} value={card.holder} onChange={e => change('holder', e.target.value.toUpperCase())}/></label>
    <div className="form-columns"><label>Validade<input disabled={!isDemo} required inputMode="numeric" autoComplete="off" placeholder="MM/AA" maxLength={5} value={card.expiry} onChange={e => change('expiry', formatExpiry(e.target.value))}/></label><label>CVV<input disabled={!isDemo} required type="password" inputMode="numeric" autoComplete="off" placeholder="000" maxLength={3} value={card.cvv} onChange={e => change('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}/></label></div>
    {payment.method === 'card' ? <label>Parcelamento<select value={payment.installments} onChange={e => onPayment({ ...payment, installments: Number(e.target.value) })}>{Array.from({ length: 10 }, (_, index) => <option key={index} value={index + 1}>{index + 1}x de aproximadamente {money(Math.ceil(total / (index + 1)))} · total {money(total)}</option>)}</select></label> : <p>Débito à vista · {money(total)}</p>}
  </section>
}

export function PixDetails({ pix, now, isDemo }: { pix: DemoPix | null; now: number; isDemo: boolean }) {
  const [image, setImage] = useState<{ payload: string; url: string } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const payload = pix ? demoPixPayload(pix) : ''
  useEffect(() => {
    let active = true
    setCopied(false); setError('')
    if (payload && isDemo) QRCode.toDataURL(payload, { width: 240, margin: 4, errorCorrectionLevel: 'M' }).then(url => { if (active) setImage({ payload, url }) }).catch(() => { if (active) setError('Não foi possível gerar o QR Code. Volte à etapa anterior e tente novamente.') })
    return () => { active = false }
  }, [payload, isDemo])
  if (!isDemo) return <p className="notice">A emissão de uma cobrança Pix real depende da integração com o provedor de pagamento.</p>
  const seconds = pix ? Math.max(0, Math.ceil((pix.expiresAt - now) / 1000)) : 0
  return <section className="pix-panel" aria-label="Pix demonstrativo">
    <div className="pix-qr">{image?.payload === payload && seconds > 0 ? <img src={image.url} width="240" height="240" alt="QR Code de demonstração, não pagável"/> : <span role="status">Gerando QR Code...</span>}</div>
    <div><h3>Pix</h3><p>QR demonstrativo, sem cobrança. Não é aceito por aplicativos bancários.</p><p className="pix-timer">Expira em <strong aria-label="Tempo restante">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</strong></p><p>Um novo código é gerado automaticamente após 30 minutos. Alterar o carrinho também renova o código.</p><button type="button" className="button button--secondary" disabled={!pix || seconds === 0} onClick={async () => { try { await navigator.clipboard.writeText(payload); setCopied(true) } catch { setError('Não foi possível copiar o código neste navegador.') } }}>Copiar código de teste</button><p role="status">{copied ? 'Código demonstrativo copiado.' : ''}</p>{error && <p role="alert">{error}</p>}</div>
  </section>
}
