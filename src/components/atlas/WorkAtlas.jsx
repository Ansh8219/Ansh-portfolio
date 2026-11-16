import { memo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from './SectionLabel'
import { DISCIPLINES } from '../../content/site'
import { WORK_CASES } from '../../content/work'
import { gsap, ScrollTrigger, useSignalMotion } from '../../motion/signal'
import { ZOOM_SCROLL, HANDOFF_FROM } from '../../motion/handoff'
import { getLenisInstance } from '../../utils/lenis'

const ITEMS = WORK_CASES.filter((c) => c.key !== 'northvault')
const COUNT = ITEMS.length
const VH_PER_PROJECT = 0.6 // viewport heights of pinned scroll per project
const pad = (n) => String(n).padStart(2, '0')

/**
 * Selected work (home). Desktop: a pinned stage that shows ONE project at a time; scrolling loads the next one
 * (big name, status, summary, details, stack, links). Text only. Phones, tablets and reduced motion get the same
 * content as a plain stacked list, which is also what the server renders.
 * Hand-over from the Approach TV zoom: this section is pulled up over the end of the zoom (CSS `.is-handoff`), stays
 * hidden until the zoom is part-way through and is fully in when the zoom ends, so the screen is never empty.
 */
function WorkAtlas() {
  const rootRef = useRef(null)

  useSignalMotion(rootRef, ({ desktop }, scope) => {
    if (!desktop) return undefined
    const q = gsap.utils.selector(scope)
    const panels = q('[data-wp]')
    const buttons = q('[data-index]')
    const bar = q('[data-bar]')[0]
    const stage = q('[data-stage]')[0]
    let active = -1

    scope.classList.add('is-pinned', 'is-handoff')
    gsap.set(scope, { autoAlpha: 0 })
    gsap.set(panels, { autoAlpha: 0 })

    const show = (next) => {
      if (next === active) return
      const prev = active
      const dir = next > prev ? 1 : -1
      active = next
      // every other panel loses its pending tweens first, so fast scrolling can never leave two projects on screen
      panels.forEach((panel, i) => {
        if (i === next) return
        gsap.killTweensOf([panel, ...panel.querySelectorAll('[data-rise], [data-wt]')])
        if (i === prev) gsap.to(panel, { autoAlpha: 0, duration: 0.25 })
        else gsap.set(panel, { autoAlpha: 0 })
      })
      const panel = panels[next]
      const title = panel.querySelector('[data-wt]')
      gsap.killTweensOf([panel, title, ...panel.querySelectorAll('[data-rise]')])
      gsap.to(panel, { autoAlpha: 1, duration: 0.2, delay: 0.1 })
      gsap.fromTo(title, { yPercent: 105 * dir }, { yPercent: 0, duration: 0.9, ease: 'expo.out', delay: 0.08 })
      gsap.fromTo(panel.querySelectorAll('[data-rise]'), { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', stagger: 0.05, delay: 0.16 })
      buttons.forEach((button, i) => {
        if (i === next) button.setAttribute('aria-current', 'step')
        else button.removeAttribute('aria-current')
      })
    }

    // The stage is exactly as tall as the real window (not a CSS viewport unit), re-read on every refresh.
    const fit = () => stage.style.setProperty('--stage-h', `${window.innerHeight}px`)
    fit()
    ScrollTrigger.addEventListener('refreshInit', fit)

    const pin = ScrollTrigger.create({
      id: 'work-pin',
      trigger: stage,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * COUNT * VH_PER_PROJECT)}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        show(Math.min(COUNT - 1, Math.floor(self.progress * COUNT)))
        if (bar) gsap.set(bar, { scaleX: Math.max(0.02, self.progress) })
      },
    })
    show(0)

    // Hand-over: hidden until the zoom is part-way through, fully in when it ends (created after the pin so it
    // always reads the pin's fresh start on refresh).
    const entry = ScrollTrigger.create({
      start: () => pin.start - window.innerHeight * ZOOM_SCROLL * (1 - HANDOFF_FROM),
      end: () => pin.start,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => gsap.set(scope, { autoAlpha: self.progress }),
      onRefresh: (self) => gsap.set(scope, { autoAlpha: self.progress }),
    })

    const onClick = (event) => {
      const i = Number(event.currentTarget.dataset.index)
      const target = pin.start + ((i + 0.5) / COUNT) * (pin.end - pin.start)
      const lenis = getLenisInstance()
      if (lenis) lenis.scrollTo(target, { duration: 1.1, force: true })
      else window.scrollTo({ top: target, behavior: 'smooth' })
    }
    buttons.forEach((button) => button.addEventListener('click', onClick))

    return () => {
      buttons.forEach((button) => button.removeEventListener('click', onClick))
      ScrollTrigger.removeEventListener('refreshInit', fit)
      stage.style.removeProperty('--stage-h')
      entry.kill()
      pin.kill()
      const touched = [scope, ...panels, bar, ...panels.flatMap((p) => [...p.querySelectorAll('[data-rise], [data-wt]')])].filter(Boolean)
      gsap.set(touched, { clearProps: 'all' })
      scope.classList.remove('is-pinned', 'is-handoff')
      ScrollTrigger.refresh()
    }
  })

  return (
    <section id="work" ref={rootRef} className="at-section at-work" aria-labelledby="work-title">
      <div className="wp-stage" data-stage>
        <div className="at-wrap wp-top">
          <SectionLabel>Selected work</SectionLabel>
          <h2 id="work-title" className="wp-heading">
            Work I’ve shipped.
          </h2>
          <ol className="wp-index" aria-label="Projects">
            {ITEMS.map((item, i) => (
              <li key={item.key}>
                <button type="button" data-index={i} className="at-svc__tab">
                  <span className="at-svc__num">{pad(i + 1)}</span>
                  {item.title}
                  <span className="at-svc__dash" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="at-wrap wp-panels">
          {ITEMS.map((item, i) => (
            <article key={item.key} className={`wp-panel ${DISCIPLINES[item.lead]?.cls ?? ''}`} data-wp aria-labelledby={`wp-${item.key}`}>
              <div className="wp-main">
                <p className="wp-num" data-rise>
                  <span className="wp-dot" aria-hidden="true" />
                  {pad(i + 1)} / {pad(COUNT)}
                </p>
                <h3 id={`wp-${item.key}`} className="wp-title">
                  <span data-wt>{item.title}</span>
                </h3>
                <p className="wp-cat" data-rise>
                  {item.category}
                </p>
                <p data-rise>
                  <span className={`wk-badge wk-badge--${item.status.tone}`}>{item.status.label}</span>
                </p>
              </div>

              <div className="wp-side">
                <p className="wp-sum" data-rise>
                  {item.summary}
                </p>
                <p className="wp-about" data-rise>
                  {item.about}
                </p>
                {item.parts.length > 0 && (
                  <ul className="wp-parts" data-rise>
                    {item.parts.map((part) => (
                      <li key={part.name}>
                        <b>{part.name}</b>
                        <span>{part.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.roles.length > 0 && (
                  <ul className="wk-chips" data-rise aria-label="Roles">
                    {item.roles.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
                {item.stack.length > 0 && (
                  <ul className="wk-chips wk-chips--mono" data-rise aria-label="Stack">
                    {item.stack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
                {item.links.length > 0 && (
                  <ul className="wk-links" data-rise>
                    {item.links.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="at-arrow-link">
                          {l.label}
                          <ArrowUpRight aria-hidden="true" size={16} />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="at-wrap wp-foot">
          <span className="wp-bar" aria-hidden="true">
            <i data-bar />
          </span>
          <p className="wp-links">
            <Link to="/work" className="at-arrow-link">
              See all work
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            <Link to="/contact" className="at-arrow-link">
              Build something similar
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default memo(WorkAtlas)
