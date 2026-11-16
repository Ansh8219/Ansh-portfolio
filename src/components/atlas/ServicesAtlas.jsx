import { memo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from './SectionLabel'
import { SERVICES } from '../../content/site'
import { gsap, ScrollTrigger, useSignalMotion } from '../../motion/signal'
import { getLenisInstance } from '../../utils/lenis'
import { ZOOM_SCROLL } from '../../motion/handoff'

// Display word per discipline (the full approved name stays in the <h3>).
const WORD = {
  ai: 'AI',
  software: 'Software',
  web: 'Web & Mobile',
  cloud: 'Cloud',
  data: 'Data & QA',
  brand: 'Brand',
}

const TV_SRC = '/images/nv/763116e303e94da529ca1429a0cb603b4c2a0234-1536x1024.avif'

const SCROLL_PER_SERVICE = 0.45 // viewport heights of pinned scroll per discipline
const TV_ZOOM = 6.2 // extra scale at the end of the zoom (the screen then fills the viewport)
const SCREEN_ORIGIN = '50% 38.8%' // centre of the TV's glass, as a share of the image box
const pad = (n) => String(n).padStart(2, '0')

/**
 * Approach (pinned stage). Desktop: the retro TV sits in the centre and the page does not scroll:
 * each step of the scroll swaps what is shown ON THE TV SCREEN (number, name, description, features,
 * link). The current discipline's big word waits top-left, behind the TV; the next one is ghosted
 * bottom-right; an index top-right tracks progress. After the sixth discipline the view zooms quickly into
 * the screen while the Work stage fades in underneath, so the hand-over is never empty.
 * Elsewhere (and with reduced motion): the TV and the big words are hidden and the six blocks are a
 * plain list. The server-rendered HTML is always that list.
 */
function ServicesAtlas() {
  const rootRef = useRef(null)

  useSignalMotion(rootRef, ({ desktop }, scope) => {
    const q = gsap.utils.selector(scope)
    const panels = q('[data-panel]')

    if (!desktop) {
      panels.forEach((panel) => {
        gsap.from(panel.querySelectorAll('[data-rise]'), {
          yPercent: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: { trigger: panel, start: 'clamp(top 85%)', once: true },
        })
      })
      return undefined
    }

    scope.classList.add('is-pinned')
    const stage = q('[data-stage]')[0]
    const wordEls = q('[data-wordp]')
    const ghosts = q('[data-ghost]')
    const buttons = q('[data-index]')
    const tv = q('[data-figure]')[0]
    const content = q('[data-content]')[0]
    const screen = q('[data-screen]')[0]
    const chrome = q('[data-chrome]')
    const wash = q('[data-wash]')[0]
    const count = panels.length
    const stepSpan = SCROLL_PER_SERVICE * count
    const stepEnd = stepSpan / (stepSpan + ZOOM_SCROLL) // share of the pin used by the six steps
    let active = -1

    gsap.set(panels, { autoAlpha: 0 })
    gsap.set(wordEls, { autoAlpha: 0 })
    gsap.set(ghosts, { autoAlpha: 0 })

    const show = (next) => {
      if (next === active) return
      const prev = active
      const dir = next > prev ? 1 : -1
      active = next

      // Fast scrolling can skip steps, and a fade-in that is still waiting out its delay is NOT
      // cancelled by a later fade-out (overwrite:'auto' only sees running tweens): the old panel
      // would switch itself back on and two services would be drawn on top of each other.
      // So every element that is not the new target loses all its pending tweens first; only the
      // one just left fades out, everything else is simply set to hidden.
      panels.forEach((panel, i) => {
        if (i === next) return
        gsap.killTweensOf([panel, ...panel.querySelectorAll('[data-rise]')])
        if (i === prev) gsap.to(panel, { autoAlpha: 0, duration: 0.25 })
        else gsap.set(panel, { autoAlpha: 0 })
      })
      wordEls.forEach((el, i) => {
        if (i === next) return
        const word = el.querySelector('[data-word]')
        gsap.killTweensOf([el, word])
        if (i === prev) {
          gsap.to(el, { autoAlpha: 0, duration: 0.35 })
          gsap.to(word, { yPercent: -60 * dir, duration: 0.5, ease: 'power2.in' })
        } else gsap.set(el, { autoAlpha: 0 })
      })
      ghosts.forEach((ghost, i) => {
        if (i === next) return
        gsap.killTweensOf(ghost)
        if (i === prev) gsap.to(ghost, { autoAlpha: 0, duration: 0.3 })
        else gsap.set(ghost, { autoAlpha: 0 })
      })

      const panel = panels[next]
      const word = wordEls[next].querySelector('[data-word]')
      gsap.killTweensOf([panel, ...panel.querySelectorAll('[data-rise]'), wordEls[next], word, ghosts[next]].filter(Boolean))
      // the screen "refreshes": a quick brightness blink as the new page is drawn
      if (screen) gsap.fromTo(screen, { filter: 'brightness(1.4)' }, { filter: 'brightness(1)', duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
      gsap.to(panel, { autoAlpha: 1, duration: 0.2, delay: 0.08 })
      gsap.fromTo(panel.querySelectorAll('[data-rise]'), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out', stagger: 0.05, delay: 0.12 })
      gsap.to(wordEls[next], { autoAlpha: 1, duration: 0.2 })
      gsap.fromTo(word, { yPercent: 70 * dir }, { yPercent: 0, duration: 0.9, ease: 'expo.out' })
      if (ghosts[next]) gsap.fromTo(ghosts[next], { autoAlpha: 0, xPercent: 6 }, { autoAlpha: 1, xPercent: 0, duration: 0.9, ease: 'expo.out' })
      buttons.forEach((button, i) => {
        if (i === next) button.setAttribute('aria-current', 'step')
        else button.removeAttribute('aria-current')
      })
    }

    const pin = ScrollTrigger.create({
      id: 'services-pin',
      trigger: stage,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * (stepSpan + ZOOM_SCROLL))}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        show(Math.min(count - 1, Math.floor((self.progress / stepEnd) * count)))
        // after the sixth step: words and index fade, the TV scales up until its screen fills the viewport
        const z = Math.max(0, (self.progress - stepEnd) / (1 - stepEnd))
        gsap.set(chrome, { autoAlpha: 1 - Math.min(1, z * 2.4) })
        if (tv) gsap.set(tv, { scale: 1 + z * z * TV_ZOOM, transformOrigin: SCREEN_ORIGIN })
        screen?.style.setProperty('--scan', String(1 - Math.min(1, z * 2.5)))
        // the glass dissolves into the page background while the Work stage fades in on top of it
        if (wash) gsap.set(wash, { autoAlpha: Math.min(1, Math.max(0, (z - 0.35) / 0.5)) })
        if (content) gsap.set(content, { autoAlpha: 1 - Math.min(1, Math.max(0, (z - 0.4) / 0.4)) })
      },
    })
    show(0)

    const onClick = (event) => {
      const i = Number(event.currentTarget.dataset.index)
      const target = pin.start + ((i + 0.5) / count) * stepEnd * (pin.end - pin.start)
      const lenis = getLenisInstance()
      if (lenis) lenis.scrollTo(target, { duration: 1.2, force: true })
      else window.scrollTo({ top: target, behavior: 'smooth' })
    }
    buttons.forEach((button) => button.addEventListener('click', onClick))

    return () => {
      buttons.forEach((button) => button.removeEventListener('click', onClick))
      pin.kill()
      screen?.style.removeProperty('--scan')
      const touched = [...panels, ...wordEls, ...ghosts, ...chrome, tv, content, screen, wash, ...panels.flatMap((p) => [...p.querySelectorAll('[data-rise]')]), ...wordEls.map((w) => w.querySelector('[data-word]'))].filter(Boolean)
      gsap.set(touched, { clearProps: 'all' })
      scope.classList.remove('is-pinned')
      ScrollTrigger.refresh()
    }
  })

  return (
    <section id="services" ref={rootRef} className="at-section at-services" aria-labelledby="services-title">
      <div className="at-svc" data-stage>
        <div className="at-svc__top at-wrap" data-chrome>
          <SectionLabel>Approach</SectionLabel>
          <h2 id="services-title" className="at-svc__title">
            Six disciplines, one team
          </h2>
          <ol className="at-svc__index" aria-label="Disciplines">
            {SERVICES.map((service, index) => (
              <li key={service.key}>
                <button type="button" data-index={index} className={`at-svc__tab h-${service.key}`}>
                  <span className="at-svc__num">{pad(index + 1)}</span>
                  {WORD[service.key]}
                  <span className="at-svc__dash" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* big discipline words (desktop stage only; the <h3> inside each panel is the real heading) */}
        <div className="at-svc__words" aria-hidden="true" data-chrome>
          {SERVICES.map((service) => (
            <p key={service.key} className={`at-panel__word h-${service.key}`} data-wordp>
              <span data-word>{WORD[service.key]}</span>
            </p>
          ))}
        </div>

        <div className="at-svc__wash" data-wash aria-hidden="true" />

        <figure className="at-svc__tv" data-figure>
          <img
            className="at-svc__tvimg"
            src={TV_SRC}
            width="1536"
            height="1024"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
          <div className="at-svc__screen" data-screen>
            <div className="at-svc__content" data-content>
              {SERVICES.map((service, index) => (
                <article key={service.key} className={`at-panel h-${service.key}`} data-panel aria-labelledby={`svc-${service.key}`}>
                  <div className="at-panel__info">
                    <p className="at-panel__num" data-rise>
                      <span className="at-panel__dot" aria-hidden="true" />
                      {pad(index + 1)} / {pad(SERVICES.length)}
                    </p>
                    <h3 id={`svc-${service.key}`} className="at-panel__title" data-rise>
                      {service.name}
                    </h3>
                    <p className="at-panel__desc" data-rise>
                      {service.description}
                    </p>
                    <ul className="at-chips" data-rise>
                      {service.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <Link to={{ pathname: '/services', hash: `#${service.key}` }} className="at-arrow-link" data-rise>
                      Explore {WORD[service.key]}
                      <span className="sr-only"> — {service.name}</span>
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </figure>

        <div className="at-svc__ghosts" aria-hidden="true" data-chrome>
          {SERVICES.map((service, index) => {
            const next = SERVICES[index + 1]
            return (
              <p key={service.key} className={`at-svc__ghost${next ? ` h-${next.key}` : ''}`} data-ghost>
                {next ? WORD[next.key] : 'Launch'}
              </p>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default memo(ServicesAtlas)
