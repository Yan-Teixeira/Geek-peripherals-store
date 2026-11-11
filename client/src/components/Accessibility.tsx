import { useEffect, useRef, useState } from 'react'

const defaults = { largeText: false, contrast: false, links: false, motion: false }
export function Accessibility() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem('nexus:accessibility') || '{}')
      return Object.fromEntries(Object.keys(defaults).map(key => [key, value?.[key] === true])) as typeof defaults
    } catch { return defaults }
  })
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLElement>(null)
  useEffect(() => {
    Object.entries(settings).forEach(([key, value]) => document.documentElement.classList.toggle(`a11y-${key}`, value))
    try { localStorage.setItem('nexus:accessibility', JSON.stringify(settings)) } catch { /* Preferências seguem em memória. */ }
  }, [settings])
  useEffect(() => { if (open) panel.current?.focus() }, [open])
  function close() { setOpen(false); trigger.current?.focus() }
  return <div className="accessibility-widget">
    {open && <section ref={panel} id="accessibility-panel" className="accessibility-panel" aria-label="Opções de acessibilidade" tabIndex={-1} onKeyDown={event => { if (event.key === 'Escape') close() }}>
      <div className="accessibility-heading"><h2>Acessibilidade</h2><button onClick={close} aria-label="Fechar acessibilidade">×</button></div>
      <p>Ajuste a leitura do site para você.</p>
      {([['largeText', 'Texto ampliado'], ['contrast', 'Alto contraste'], ['links', 'Destacar links'], ['motion', 'Reduzir movimentos']] as const).map(([key, label]) => <label key={key}><input type="checkbox" checked={settings[key]} onChange={event => setSettings(current => ({ ...current, [key]: event.target.checked }))}/>{label}</label>)}
      <button className="button button--secondary" onClick={() => setSettings(defaults)}>Restaurar padrão</button>
      <small>Também é possível ampliar a página pelo zoom do navegador.</small>
    </section>}
    <button ref={trigger} className="accessibility-trigger" aria-label="Opções de acessibilidade" aria-expanded={open} aria-controls="accessibility-panel" onClick={() => open ? close() : setOpen(true)}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="6" r="3" fill="currentColor"/><path d="M5 12c7 3 15 3 22 0M16 14v8m0 0-4 7m4-7 4 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  </div>
}
