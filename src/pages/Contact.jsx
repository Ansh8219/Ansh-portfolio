import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from '../components/atlas/SectionLabel'
import PageFx from '../components/PageFx'
import { MAILTO } from '../components/BrandedEmail'
import { useContactForm } from '../hooks/useContactForm'
import { gsap, SplitText } from '../motion/signal'

const EMAIL = 'ansh.dev721@gmail.com'
const GREETINGS = ['Hello.', "Let's talk.", 'Say hi.', 'Start here.']

const NEEDS = ['AI & automation', 'System architecture', 'Python backend', 'Web & mobile', 'Cloud & DevOps', 'Full product build', 'Not sure yet']
const PURPOSES = ['New product', 'Redesign or upgrade', 'Automate a process', 'Something else']
const TIMINGS = ['As soon as possible', 'Coming months', 'Still exploring']

// How each answer reads inside the sentence "You're looking for … for …, timing: …."
const PHRASE = {
  'AI & automation': 'AI & automation',
  'System architecture': 'system architecture',
  'Python backend': 'a Python backend',
  'Web & mobile': 'web & mobile development',
  'Cloud & DevOps': 'cloud & DevOps',
  'Full product build': 'a full product build',
  'Not sure yet': 'some help deciding',
  'New product': 'a new product',
  'Redesign or upgrade': 'a redesign or upgrade',
  'Automate a process': 'automating a process',
  'Something else': 'something else',
  'As soon as possible': 'as soon as possible',
  'Coming months': 'the coming months',
  'Still exploring': 'still exploring',
}

/** The hero word: starts as "Hello." (what the server renders) and cycles through a few plain-English openers. */
function GreetingWord() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let index = 0
    let tl = null
    let split = null
    const make = () => SplitText.create(el, { type: 'chars', charsClass: 'at-cx-char' })

    const swap = () => {
      const next = (index + 1) % GREETINGS.length
      tl?.kill()
      split?.revert()
      split = make()
      tl = gsap.timeline()
      tl.to(split.chars, { yPercent: -110, duration: 0.28, ease: 'power3.in', stagger: 0.012 }).add(() => {
        split.revert()
        index = next
        el.textContent = GREETINGS[index]
        split = make()
        gsap.fromTo(
          split.chars,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.02, onComplete: () => split?.revert() },
        )
      })
    }

    const timer = window.setInterval(swap, 2400)
    return () => {
      window.clearInterval(timer)
      tl?.kill()
      split?.revert()
    }
  }, [])

  return (
    <p className="at-cx-hero__word" aria-hidden="true">
      <span ref={ref}>{GREETINGS[0]}</span>
    </p>
  )
}

/** Live India time with seconds. Placeholders on the server / first render (no hydration mismatch). */
function StudioClock() {
  const [t, setT] = useState(null)

  useEffect(() => {
    let format
    try {
      format = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Kolkata' })
    } catch {
      return undefined
    }
    const tick = () => {
      const parts = format.formatToParts(new Date())
      const get = (type) => parts.find((p) => p.type === type)?.value
      setT({ h: get('hour'), m: get('minute'), s: get('second') })
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="at-cx-clock">
      <p className="at-cx-clock__label">Local time in Chandigarh / Mohali</p>
      <p className="at-cx-clock__time" aria-hidden="true">
        <span>{t?.h ?? '--'}</span>
        <span className="at-cx-clock__colon">:</span>
        <span>{t?.m ?? '--'}</span>
        <sup>{t?.s ?? '--'}</sup>
      </p>
    </div>
  )
}

function ChoiceGroup({ number, legend, name, options, value, onChange }) {
  return (
    <fieldset className="at-choice">
      <legend>
        <span className="at-q">{number}</span>
        {legend}
      </legend>
      <div className="at-choice__opts">
        {options.map((option) => (
          <label key={option} className="at-opt">
            <input type="radio" name={name} value={option} checked={value === option} onChange={onChange} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** A filled answer, or an empty solid blank (no dots, no ellipsis) until it is chosen. */
const Blank = ({ value }) =>
  value ? (
    <span className="at-brief__fill">{PHRASE[value] ?? value}</span>
  ) : (
    <span className="at-brief__blank" aria-label="not chosen yet" />
  )

const Contact = memo(() => {
  const { formData, formStatus, handleChange, handleSubmit } = useContactForm()
  const [copied, setCopied] = useState(false)

  const answered = [formData.service, formData.purpose, formData.timing, formData.name.trim(), formData.email.trim(), formData.message.trim()].filter(Boolean).length

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = MAILTO
    }
  }, [])

  return (
    <PageFx className="at-contact-page">
      {/* Hero: greeting word, rule + location line, live clock */}
      <section className="at-cx-hero" aria-labelledby="contact-title">
        <div className="at-wrap at-cx-hero__inner">
          <SectionLabel>Contact</SectionLabel>
          <h1 id="contact-title" className="sr-only">
            Contact Ansh
          </h1>
          <GreetingWord />
          <div className="at-cx-hero__base">
            <div className="at-cx-hero__meta">
              <span>Based in Chandigarh / Mohali</span>
              <span>Full stack, AI &amp; DevOps engineering</span>
            </div>
            <StudioClock />
          </div>
        </div>
      </section>

      {/* Brief builder + details */}
      <section className="at-section at-cx-body" aria-label="Start a project">
        <div className="at-wrap at-contact__grid">
          <form onSubmit={handleSubmit} className="at-form" data-fx="stagger">
            <p className="at-progress" aria-live="polite">
              <span>
                <b>{answered}</b> of 6 answered
              </span>
              <span className="at-progress__bar" aria-hidden="true">
                <i style={{ transform: `scaleX(${answered / 6})` }} />
              </span>
            </p>

            <ChoiceGroup number="01" legend="What do you need?" name="service" options={NEEDS} value={formData.service} onChange={handleChange} />
            <ChoiceGroup number="02" legend="What for?" name="purpose" options={PURPOSES} value={formData.purpose} onChange={handleChange} />
            <ChoiceGroup number="03" legend="When?" name="timing" options={TIMINGS} value={formData.timing} onChange={handleChange} />

            <div className="at-form__row">
              <div className="at-field">
                <label htmlFor="name">
                  <span className="at-q">04</span>Name
                </label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required autoComplete="name" placeholder="Your name" />
              </div>
              <div className="at-field">
                <label htmlFor="company">
                  Company <span className="at-field__opt">(optional)</span>
                </label>
                <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} autoComplete="organization" placeholder="Company or project" />
              </div>
            </div>

            <div className="at-field">
              <label htmlFor="email">
                <span className="at-q">05</span>Email
              </label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" inputMode="email" spellCheck={false} placeholder="you@company.com" />
            </div>

            <div className="at-field">
              <label htmlFor="message">
                <span className="at-q">06</span>What else should I know?
              </label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={4} placeholder="Goals, current product, links, deadlines" />
            </div>

            <div className="at-brief">
              <div className="at-brief__label">Your brief so far</div>
              <p className="at-brief__text">
                You&apos;re looking for <Blank value={formData.service} /> for <Blank value={formData.purpose} />, timing:{' '}
                <Blank value={formData.timing} />.
              </p>
            </div>

            <div>
              <div className="at-form__submit">
                <button type="submit" className="at-btn at-btn--arrow" disabled={formStatus === 'submitting'} aria-busy={formStatus === 'submitting' || undefined}>
                  <span>{formStatus === 'submitting' ? 'Sending…' : 'Send my message'}</span>
                  <span className="at-btn__cell" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </button>
                <span className="at-form__hint">Opens an email to Ansh.</span>
              </div>
              <div role="status" aria-live="polite" aria-atomic="true">
                {formStatus === 'success' ? (
                  <p className="at-form__note">Message received — I&apos;ll be in touch within one business day.</p>
                ) : null}
                {formStatus === 'mailto' ? (
                  <p className="at-form__note">
                    Your email app should open with this message ready to send. If nothing opens, email <a href={MAILTO}>{EMAIL}</a> directly.
                  </p>
                ) : null}
                {formStatus === 'error' ? (
                  <p className="at-form__note at-form__note--error">
                    Your message wasn&apos;t sent. Check your connection and try again, or email <a href={MAILTO}>{EMAIL}</a>.
                  </p>
                ) : null}
              </div>
            </div>
          </form>

          <aside className="at-contact__intro at-cx-info" aria-label="Contact details">
            <div className="at-cx-info__block">
              <p className="at-cx-info__label">Email</p>
              <a href={MAILTO} className="at-cx-info__email">
                {EMAIL}
              </a>
              <div>
                <button type="button" className="at-btn at-btn--ghost at-btn--sm" onClick={copyEmail}>
                  {copied ? 'Copied' : 'Copy address'}
                </button>
                <span className="sr-only" role="status">
                  {copied ? 'Email address copied' : ''}
                </span>
              </div>
            </div>

            <div className="at-cx-info__block">
              <p className="at-cx-info__label">Engineer</p>
              <p className="at-cx-info__text">
                Ansh
                <br />
                Full Stack, AI &amp; DevOps Engineer
                <br />
                Chandigarh / Mohali, India
              </p>
            </div>

            <div className="at-cx-info__block">
              <p className="at-cx-info__label">Phone</p>
              <a href="tel:+918219698580" className="at-cx-info__text at-cx-info__link">
                +91&nbsp;8219698580
              </a>
            </div>

            <div className="at-cx-info__block">
              <p className="at-cx-info__label">Good to know</p>
              <p className="at-cx-info__text">4+ years of experience · NDA on request</p>
            </div>
          </aside>
        </div>
      </section>
    </PageFx>
  )
})

Contact.displayName = 'Contact'

export default Contact
