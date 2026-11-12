import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Progressive enhancement: conteúdo só é ocultado quando há um observer ativo.
export function MotionEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let stop = () => {}
    function configure() {
      stop()
      if (preference.matches || document.documentElement.classList.contains('a11y-motion')) return
      if (!('IntersectionObserver' in window)) return
      const seen = new WeakSet<Element>()
      const pending = new Set<Element>()
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.remove('motion-pending'); pending.delete(entry.target); observer.unobserve(entry.target)
        }
      }, { threshold: 0.08 })
      function discover() {
        document.querySelectorAll('main .section-heading, main .product-card, main .hero__content, main .benefits, main .gallery, main .product-info, main .about-intro > div, main .about-intro > img, main .about-values > article, main .about-project').forEach(element => {
          if (seen.has(element)) return
          seen.add(element); element.classList.add('motion-reveal', 'motion-pending'); pending.add(element); observer.observe(element)
        })
      }
      discover()
      const content = document.getElementById('content')
      const changes = new MutationObserver(discover)
      if (content) changes.observe(content, { childList: true, subtree: true })
      const focus = (event: FocusEvent) => {
        const element = (event.target as Element)?.closest('.motion-pending')
        if (element) { element.classList.remove('motion-pending'); pending.delete(element); observer.unobserve(element) }
      }
      document.addEventListener('focusin', focus)
      let frame = 0
      const move = () => {
        frame = 0
        const hero = document.querySelector<HTMLElement>('.hero')
        if (!hero) return
        const box = hero.getBoundingClientRect()
        if (box.bottom > 0 && box.top < window.innerHeight) hero.style.setProperty('--parallax-y', `${Math.max(-60, Math.min(60, -box.top * 0.12))}px`)
      }
      const schedule = () => { if (!frame) frame = requestAnimationFrame(move) }
      window.addEventListener('scroll', schedule, { passive: true }); schedule()
      stop = () => {
        observer.disconnect(); changes.disconnect(); pending.forEach(element => element.classList.remove('motion-pending'))
        document.removeEventListener('focusin', focus); window.removeEventListener('scroll', schedule); cancelAnimationFrame(frame)
        document.querySelector<HTMLElement>('.hero')?.style.removeProperty('--parallax-y')
      }
    }
    configure()
    const settings = new MutationObserver(configure)
    settings.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    preference.addEventListener('change', configure)
    return () => { stop(); settings.disconnect(); preference.removeEventListener('change', configure) }
  }, [pathname])
  return null
}
