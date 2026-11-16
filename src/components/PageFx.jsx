import { useRef } from 'react'
import { gsap, ScrollTrigger, fillWords, revealLines, useSignalMotion, whenVisible } from '../motion/signal'

/**
 * Scroll/move animation layer for inner pages (About, Services, Contact, 404).
 * Wrap a page and tag elements with data attributes; all motion is skipped for reduced motion
 * and reverted on unmount (see useSignalMotion).
 *
 *  data-fx="lines"                headline lines rise out of a mask when scrolled into view (once)
 *  data-fx="rule"                 a hairline draws left -> right when scrolled into view (once)
 *  data-fx="fill"                 words dim -> full as the paragraph scrolls past (scrubbed)
 *  data-fx="clip"                 box opens from an inset clip-path; [data-fx-inner] inside scales down
 *  data-fx="parallax" data-speed  element drifts vertically against the scroll (default 12 = %)
 *  data-fx="stagger"              direct children rise + fade in as a batch (cards, list rows)
 *  data-fx="scale"                block eases from scale .92 + radius to full size, scrubbed
 *  data-fx="progress"             inside it, [data-fx-line] draws top->bottom with scroll;
 *                                 [data-fx-step] rows light up when reached
 *  data-magnetic                  button/link follows the pointer a little (fine pointers only)
 *  data-fx="hero"                 [data-ln-in] rise out of their line masks on load; the [data-ln] lines then
 *                                 glide apart (1st left, 2nd right) as the section scrolls away
 *  data-fx="rise"                 fade + rise once when scrolled into view (data-delay in seconds)
 *  data-fx="count"                number counts up to data-to when scrolled into view (once)
 *  data-fx="spin"                 rotates one full turn across its scroll range (scrubbed)
 *  data-fx="ticker"               infinite marquee ([data-ticker-track], two equal copies), faster while scrolling
 *  data-spot                      a soft light follows the pointer inside the element (--mx / --my)
 *  progress + [data-fx-counter]   the step in the middle of the screen gets .is-active and the counter shows its number
 */
export default function PageFx({ children, className = '', as: Tag = 'div', ...rest }) {
  const rootRef = useRef(null)

  useSignalMotion(rootRef, (conditions, scope) => {
    const q = gsap.utils.selector(scope)
    const splits = []
    const cleanups = []

    q('[data-fx="lines"]').forEach((el) => {
      splits.push(revealLines(el, { start: 'clamp(top 92%)' }))
    })

    q('[data-fx="rule"]').forEach((el) => {
      gsap.from(el, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'clamp(top 94%)', once: true },
      })
    })

    // hero headline: rise on load, then the two lines glide apart while the section scrolls away
    q('[data-fx="hero"]').forEach((hero) => {
      const ins = hero.querySelectorAll('[data-ln-in]')
      const lns = hero.querySelectorAll('[data-ln]')
      if (ins.length) gsap.from(ins, { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: 0.1 })
      if (lns.length >= 2) {
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: '80% top', scrub: 0.6 } })
          .to(lns[0], { x: () => -window.innerWidth * 0.06 }, 0)
          .to(lns[1], { x: () => window.innerWidth * 0.14 }, 0)
      }
    })

    q('[data-fx="rise"]').forEach((el) => {
      gsap.set(el, { autoAlpha: 0, y: 28 })
      cleanups.push(
        whenVisible([el], () =>
          gsap.to(el, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', delay: parseFloat(el.dataset.delay || '0') }),
        ),
      )
    })

    q('[data-fx="count"]').forEach((el) => {
      const original = el.textContent
      const to = parseFloat(el.dataset.to)
      if (Number.isNaN(to)) return
      const counter = { v: 0 }
      el.textContent = '0'
      const countTween = gsap.to(counter, {
        paused: true,
        v: to,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = String(Math.round(counter.v))
        },
        onComplete: () => {
          el.textContent = original
        },
      })
      cleanups.push(whenVisible([el], () => countTween.play()))
      cleanups.push(() => {
        el.textContent = original
      })
    })

    q('[data-fx="spin"]').forEach((el) => {
      gsap.to(el, { rotate: 360, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
    })

    q('[data-fx="ticker"]').forEach((el) => {
      const track = el.querySelector('[data-ticker-track]')
      if (!track) return
      const dir = el.dataset.dir === 'right' ? 1 : -1
      const loop = gsap.fromTo(
        track,
        { xPercent: dir < 0 ? 0 : -50 },
        { xPercent: dir < 0 ? -50 : 0, ease: 'none', duration: parseFloat(el.dataset.speed || '40'), repeat: -1 },
      )
      // faster while the page is being scrolled, easing back to the normal pace afterwards
      let boost = 0
      const trigger = ScrollTrigger.create({
        onUpdate: (self) => {
          boost = Math.max(boost, Math.min(7, Math.abs(self.getVelocity()) / 300))
        },
      })
      const tick = () => {
        boost += (0 - boost) * 0.06
        loop.timeScale(1 + boost)
      }
      gsap.ticker.add(tick)
      cleanups.push(() => {
        gsap.ticker.remove(tick)
        trigger.kill()
        loop.kill()
      })
    })

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      q('[data-spot]').forEach((el) => {
        const move = (e) => {
          const r = el.getBoundingClientRect()
          el.style.setProperty('--mx', `${e.clientX - r.left}px`)
          el.style.setProperty('--my', `${e.clientY - r.top}px`)
        }
        el.addEventListener('pointermove', move)
        cleanups.push(() => el.removeEventListener('pointermove', move))
      })
    }

    q('[data-fx="fill"]').forEach((el) => {
      splits.push(fillWords(el, { from: 0.2, start: 'clamp(top 82%)', end: 'clamp(bottom 55%)' }))
    })

    q('[data-fx="clip"]').forEach((el) => {
      const inner = el.querySelector('[data-fx-inner]')
      const range = { trigger: el, start: 'clamp(top 95%)', end: 'clamp(top 35%)', scrub: 0.6 }
      gsap.fromTo(el, { clipPath: 'inset(14% 14% 14% 14% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none', scrollTrigger: range })
      if (inner) gsap.fromTo(inner, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: range })
    })

    q('[data-fx="parallax"]').forEach((el) => {
      const speed = parseFloat(el.dataset.speed || '12')
      gsap.fromTo(
        el,
        { yPercent: speed },
        { yPercent: -speed, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    })

    q('[data-fx="stagger"]').forEach((group) => {
      const items = Array.from(group.children)
      gsap.set(items, { autoAlpha: 0, y: 48 })
      cleanups.push(
        whenVisible(items, (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, overwrite: true }),
        ),
      )
    })

    q('[data-fx="scale"]').forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 0.92, borderRadius: 48 },
        { scale: 1, borderRadius: 24, ease: 'none', scrollTrigger: { trigger: el, start: 'clamp(top 95%)', end: 'clamp(top 40%)', scrub: 0.6 } },
      )
    })

    q('[data-fx="progress"]').forEach((wrap) => {
      const line = wrap.querySelector('[data-fx-line]')
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: wrap, start: 'clamp(top 70%)', end: 'clamp(bottom 60%)', scrub: 0.5 } },
        )
      }
      const counter = scope.querySelector('[data-fx-counter]')
      const steps = Array.from(wrap.querySelectorAll('[data-fx-step]'))
      steps.forEach((step, i) => {
        // the step crossing the middle of the screen is the active one; the last one stays lit
        // after it has been passed (scrolling on down), so the end of the list never looks "off"
        const isLast = i === steps.length - 1
        const on = () => {
          step.classList.add('is-active')
          if (counter) counter.textContent = String(i + 1).padStart(2, '0')
        }
        const off = () => step.classList.remove('is-active')
        const active = ScrollTrigger.create({
          trigger: step,
          start: 'clamp(top 62%)',
          end: 'clamp(bottom 62%)',
          onEnter: on,
          onEnterBack: on,
          onLeave: isLast ? undefined : off,
          onLeaveBack: off,
        })
        cleanups.push(() => {
          active.kill()
          step.classList.remove('is-active')
        })
        gsap.fromTo(
          step,
          { autoAlpha: 0.25, x: -18 },
          { autoAlpha: 1, x: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: step, start: 'clamp(top 80%)', toggleActions: 'play none none reverse' } },
        )
      })
    })

    // Magnetic buttons: desktop with a real pointer only.
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      q('[data-magnetic]').forEach((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
        const move = (e) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - (r.left + r.width / 2)) * 0.28)
          yTo((e.clientY - (r.top + r.height / 2)) * 0.28)
        }
        const leave = () => {
          xTo(0)
          yTo(0)
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      })
    }

    // Whenever the page's height changes (fonts, images, accordions), re-measure the scroll-linked triggers.
    if (typeof ResizeObserver !== 'undefined') {
      let timer = 0
      let first = true
      const ro = new ResizeObserver(() => {
        if (first) {
          first = false
          return
        }
        window.clearTimeout(timer)
        timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
      })
      ro.observe(scope)
      cleanups.push(() => {
        window.clearTimeout(timer)
        ro.disconnect()
      })
    }

    // Images/fonts that settle after the triggers exist shift their start/end; re-measure once.
    if (document.readyState !== 'complete') {
      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh, { once: true })
      cleanups.push(() => window.removeEventListener('load', refresh))
    }

    return () => {
      splits.forEach((s) => s?.revert())
      cleanups.forEach((fn) => fn())
    }
  })

  return (
    <Tag ref={rootRef} className={className} {...rest}>
      {children}
    </Tag>
  )
}
