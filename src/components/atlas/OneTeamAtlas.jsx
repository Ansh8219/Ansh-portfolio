import { memo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from './SectionLabel'
import { SERVICES } from '../../content/site'
import { gsap, SplitText } from '../../motion/signal'

// Display word per discipline (approved service names, shortened).
const WORDS = {
  ai: 'AI',
  software: 'Software',
  web: 'Web & Mobile',
  cloud: 'Cloud',
  data: 'Data & QA',
  brand: 'Brand',
}
const ITEMS = SERVICES.map((s) => ({ key: s.key, word: WORDS[s.key] }))
const pad = (n) => String(n).padStart(2, '0')
const HOLD_MS = 1300

/**
 * "One team" (paper section): one giant word cycles through the six disciplines, letters rising
 * out of a mask, with a live 01 / 06 counter. The server renders the first word; cycling runs on the
 * client only while the section is on screen, and never with reduced motion.
 */
function OneTeamAtlas() {
  const wordRef = useRef(null)
  const dotRef = useRef(null)
  const countRef = useRef(null)

  useEffect(() => {
    const el = wordRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let index = 0
    let timer = 0
    let tl = null
    let split = null

    const swap = () => {
      const next = (index + 1) % ITEMS.length
      tl?.kill()
      split?.revert()
      split = SplitText.create(el, { type: 'chars', charsClass: 'at-one__char' })
      tl = gsap.timeline()
      tl.to(split.chars, { yPercent: -110, duration: 0.26, ease: 'power3.in', stagger: 0.008 })
        .add(() => {
          split.revert()
          index = next
          el.textContent = ITEMS[index].word
          el.parentElement.className = `at-one__word h-${ITEMS[index].key}`
          if (countRef.current) countRef.current.textContent = pad(index + 1)
          split = SplitText.create(el, { type: 'chars', charsClass: 'at-one__char' })
          gsap.fromTo(
            split.chars,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.5, ease: 'expo.out', stagger: 0.014, onComplete: () => split?.revert() },
          )
        })
      if (dotRef.current) gsap.fromTo(dotRef.current, { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', delay: 0.3 })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer)
        if (entry.isIntersecting) timer = window.setInterval(swap, HOLD_MS)
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearInterval(timer)
      tl?.kill()
      split?.revert()
    }
  }, [])

  return (
    <section id="one-team" className="at-section at-invert at-one" aria-labelledby="one-title">
      <div className="at-wrap">
        <div className="at-one__bar">
          <SectionLabel>One team</SectionLabel>
          <p className="at-one__count" aria-hidden="true">
            <span ref={countRef}>01</span> / {pad(ITEMS.length)}
          </p>
        </div>

        <h2 id="one-title" className="sr-only">
          One team for AI, software, web and mobile, cloud, data and brand
        </h2>
        <p className={`at-one__word h-${ITEMS[0].key}`} aria-hidden="true">
          <span ref={wordRef}>{ITEMS[0].word}</span>
          <span ref={dotRef} className="at-one__dot">
            .
          </span>
        </p>

        <div className="at-one__foot">
          <p className="at-one__sub">AI, software, web, cloud, data and brand, designed and built under one roof.</p>
          <Link to="/services" className="at-arrow-link at-one__link">
            Explore all services
            <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default memo(OneTeamAtlas)
