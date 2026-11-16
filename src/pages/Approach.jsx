import { memo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from '../components/atlas/SectionLabel'
import PageFx from '../components/PageFx'
import { MAILTO } from '../components/BrandedEmail'
import { gsap, ScrollTrigger, useSignalMotion } from '../motion/signal'

const pad = (n) => String(n).padStart(2, '0')

/**
 * The five steps. `kind` decides how the window's lines are drawn, `tone` which backdrop the step sits on in the
 * plain list (steps 1-2 and 5 on paper, 3-4 on dark; the pinned stage fades between the same two palettes).
 * A line is { t: text, hi?: highlighted part of t, p?: code prefix, c?: discipline colour, live?: pulsing dot }.
 */
const STEPS = [
  {
    key: 'listen',
    title: 'Listen',
    tone: 'paper',
    kind: 'notes',
    text: 'It starts with a conversation. What should the product do, who is it for and what does a good result look like for your team?',
    win: { title: 'notes / first call', tag: 'Brief' },
    lines: [
      { t: 'What should the product really do?', hi: 'really do?' },
      { t: 'Who is it for, exactly?', hi: 'exactly?' },
      { t: 'What does a good result look like?', hi: 'good result' },
      { t: 'What is already there?', hi: 'already there?' },
      { t: 'What could get in the way?', hi: 'get in the way?' },
    ],
  },
  {
    key: 'plan',
    title: 'Plan',
    tone: 'paper',
    kind: 'check',
    text: 'I turn the answers into a written plan: architecture, scope, timeline and cost, so there are no surprises later.',
    win: { title: 'plan / scope.md', tag: 'Scope' },
    lines: [
      { t: 'Architecture and stack agreed' },
      { t: 'Scope cut into focused sprints' },
      { t: 'Risks written down early' },
      { t: 'Timeline and budget confirmed' },
      { t: 'Plan signed off by you', hi: 'signed off' },
    ],
  },
  {
    key: 'design',
    title: 'Design',
    tone: 'dark',
    kind: 'swatch',
    text: 'Architecture diagrams, API contracts and the data model, reviewed with you before anything is built.',
    win: { title: 'design / architecture.md', tag: 'Design' },
    lines: [
      { t: 'Services and boundaries mapped', c: 'ai' },
      { t: 'Database schema and migrations', c: 'software' },
      { t: 'API contracts: requests, responses, errors', c: 'web' },
      { t: 'Infrastructure and deployment plan', c: 'cloud' },
      { t: 'UI flows for web and mobile', c: 'brand' },
    ],
  },
  {
    key: 'build',
    title: 'Build',
    tone: 'dark',
    kind: 'code',
    text: 'Focused sprints with working software at the end of each one. You see real progress, tested and running, not slides about it.',
    win: { title: 'src / release.log', tag: 'Build' },
    lines: [
      { p: '✓', t: 'auth and roles' },
      { p: '✓', t: 'booking engine' },
      { p: '✓', t: 'admin dashboard' },
      { p: '→', t: 'payments · in review', hi: 'in review' },
      { p: '○', t: 'notifications · next' },
    ],
  },
  {
    key: 'launch',
    title: 'Launch',
    tone: 'paper',
    kind: 'check',
    text: 'Testing, deployment and handover on production infrastructure. Then I stay on: monitoring, fixes and the next round of improvements.',
    win: { title: 'ops / launch.checklist', tag: 'Live' },
    lines: [
      { t: 'Tests passing' },
      { t: 'Deployed on AWS' },
      { t: 'Monitoring and alerts on' },
      { t: 'Handover and documentation done' },
      { t: 'Support starts now', hi: 'now', live: true },
    ],
  },
]

const RULES = [
  { title: 'One engineer, one thread', text: 'The person who plans your product is the person who builds it. No hand-offs, no lost context.' },
  { title: 'Working software, early', text: 'A running build at the end of every sprint, so you review the real thing instead of slides about it.' },
  { title: 'Plain-language updates', text: 'Short, regular updates in words you do not need a glossary for.' },
  { title: 'Built to be supported', text: 'Documented, tested and deployed so it can keep growing after launch. NDA on request.' },
]

const FAQ = [
  { q: 'How does a project start?', a: 'With a short call. I ask about the goal, the users and what already exists, then send a written plan with scope, timeline and cost.' },
  { q: 'How long does a project take?', a: 'It depends on the scope. A focused first version is often a matter of weeks; larger platforms run in phases. You get a timeline in the plan before anything starts.' },
  { q: 'Can you work with an existing product?', a: 'Yes. I review what is there first, then improve, extend or rebuild only the parts that need it.' },
  { q: 'Who will I talk to during the project?', a: 'Me, directly. You talk to the engineer doing the work.' },
  { q: 'What happens after launch?', a: 'I stay on. Monitoring, fixes and the next round of improvements are part of how I work, not an afterthought.' },
  { q: 'Can we sign an NDA?', a: 'Yes, on request, before we discuss anything sensitive.' },
]

const SCROLL_PER_STEP = 0.9 // viewport heights of pinned scroll per step
const TONE = {
  paper: { '--st-bg': 'rgb(239,235,226)', '--st-ink': 'rgb(18,19,26)', '--st-dim': 'rgba(18,19,26,0.62)', '--st-card': 'rgb(250,249,245)', '--st-line': 'rgba(18,19,26,0.18)' },
  dark: { '--st-bg': 'rgb(10,11,16)', '--st-ink': 'rgb(238,235,227)', '--st-dim': 'rgba(238,235,227,0.6)', '--st-card': 'rgb(18,20,28)', '--st-line': 'rgba(238,235,227,0.16)' },
}

/** One line of a step's window; markup depends on the window kind. */
function WinLine({ kind, line, index }) {
  const [before, after] = line.hi ? line.t.split(line.hi) : [line.t, '']
  const text = line.hi ? (
    <>
      {before}
      <em>{line.hi}</em>
      {after}
    </>
  ) : (
    line.t
  )
  if (kind === 'notes') {
    return (
      <p className="at-ap-line at-ap-line--note" data-line>
        <span className="at-ap-line__n">{pad(index + 1)}</span>
        <span>{text}</span>
      </p>
    )
  }
  if (kind === 'swatch') {
    return (
      <p className={`at-ap-line at-ap-line--swatch h-${line.c}`} data-line>
        <i className="at-ap-dot" aria-hidden="true" />
        <span>{text}</span>
      </p>
    )
  }
  if (kind === 'code') {
    return (
      <p className="at-ap-line at-ap-line--code" data-line>
        <span className={`at-ap-code__p${line.p === '→' ? ' is-now' : ''}`} aria-hidden="true">
          {line.p}
        </span>
        <span>{text}</span>
      </p>
    )
  }
  return (
    <p className="at-ap-line at-ap-line--check" data-line>
      <i className={`at-ap-tick${line.live ? ' is-live' : ''}`} aria-hidden="true" />
      <span>{text}</span>
    </p>
  )
}

/**
 * The process. Desktop: the section pins and one scroll-linked timeline drives everything, so it reverses cleanly:
 * the big number, title and text change per step, the window's lines appear one after another, the backdrop fades
 * paper -> dark -> paper and the tabs along the bottom fill. Elsewhere (and with reduced motion) it is a plain list
 * of the five steps with everything visible.
 */
function ProcessStage() {
  const rootRef = useRef(null)

  useSignalMotion(rootRef, ({ desktop }, scope) => {
    if (!desktop) return undefined
    const q = gsap.utils.selector(scope)
    const steps = q('[data-step]')
    const fills = q('[data-tab-fill]')
    const count = steps.length

    scope.classList.add('is-pinned')

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scope,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * SCROLL_PER_STEP * (count + 0.2))}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    })

    steps.forEach((step, i) => {
      const t0 = i
      const num = step.querySelector('[data-num]')
      const copy = step.querySelector('[data-copy]')
      const win = step.querySelector('[data-win]')
      const lines = step.querySelectorAll('[data-line]')

      if (i > 0) {
        tl.to(steps[i - 1], { autoAlpha: 0, duration: 0.2 }, t0)
          .fromTo(step, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, t0)
          .fromTo(num, { yPercent: 35, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, t0 + 0.05)
          .fromTo(copy, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, t0 + 0.12)
          .fromTo(win, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, t0 + 0.05)
      }
      // the window's lines appear one after another, step by step
      tl.fromTo(lines, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.09, ease: 'power2.out' }, t0 + (i === 0 ? 0.08 : 0.35))
      tl.fromTo(fills[i], { scaleX: 0 }, { scaleX: 1, duration: 1 }, t0)

      const tone = STEPS[i].tone
      const prevTone = i > 0 ? STEPS[i - 1].tone : tone
      if (i > 0 && tone !== prevTone) tl.to(scope, { ...TONE[tone], duration: 0.4, ease: 'power1.inOut' }, t0)
    })
    tl.to({}, { duration: 0.2 }, count) // hold the last step for a moment before the pin releases

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      scope.classList.remove('is-pinned')
      const touched = [scope, ...steps, ...q('[data-num], [data-copy], [data-win], [data-line], [data-tab-fill]')]
      gsap.set(touched, { clearProps: 'all' })
      ScrollTrigger.refresh()
    }
  })

  return (
    <section ref={rootRef} className="at-ap-stage" aria-label="How a project runs">
      <ol className="at-ap-steps">
        {STEPS.map((step, index) => (
          <li key={step.key} className={`at-ap-step tone-${step.tone}`} data-step>
            <div className="at-ap-step__left">
              <p className="at-ap-step__num" data-num>
                <b>{pad(index + 1)}</b>
                <span>/ {pad(STEPS.length)}</span>
              </p>
              <div className="at-ap-step__copy" data-copy>
                <h2 className="at-ap-step__title">{step.title}</h2>
                <p className="at-ap-step__text">{step.text}</p>
              </div>
            </div>

            <div className="at-ap-win" data-win>
              <div className="at-ap-win__bar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span className="at-ap-win__title">{step.win.title}</span>
                <span className="at-ap-win__tag">{step.win.tag}</span>
              </div>
              <div className="at-ap-win__body">
                {step.lines.map((line, i) => (
                  <WinLine key={line.t} kind={step.kind} line={line} index={i} />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <ol className="at-ap-tabs" aria-hidden="true">
        {STEPS.map((step, index) => (
          <li key={step.key}>
            <span className="at-ap-tabs__bar">
              <i data-tab-fill />
            </span>
            <span className="at-ap-tabs__label">
              {pad(index + 1)} {step.title}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

const Approach = memo(() => (
  <PageFx className="at-approach-page">
    {/* Hero */}
    <section className="at-ap-hero" aria-labelledby="approach-title" data-fx="hero">
      <div className="at-wrap at-ap-hero__inner">
        <SectionLabel>Approach</SectionLabel>
        <h1 id="approach-title" className="at-ap-hero__title">
          <span className="at-ab-hero__ln" data-ln>
            <span data-ln-in>Approach</span>
          </span>
        </h1>
        <p className="at-ap-hero__statement" data-fx="fill">
          This is how a project runs with me, from the first conversation to the day your product goes live, and the support that follows.
        </p>
      </div>
    </section>

    <ProcessStage />

    {/* Ground rules */}
    <section className="at-section at-ab-why at-ap-rules" aria-labelledby="rules-title">
      <div className="at-wrap">
        <div className="at-ab-head">
          <SectionLabel>On every project</SectionLabel>
          <h2 id="rules-title" className="at-h2" data-fx="lines">
            The same ground rules, every time.
          </h2>
        </div>
        <ul className="at-ab-why__grid" data-fx="stagger">
          {RULES.map((rule, index) => (
            <li key={rule.title} className="at-ab-why__item" data-spot>
              <span className="at-ab-why__rule" aria-hidden="true" />
              <span className="at-ab-why__num">{pad(index + 1)}</span>
              <h3 className="at-ab-why__title">{rule.title}</h3>
              <p className="at-ab-why__text">{rule.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* FAQ */}
    <section className="at-section at-invert at-ap-faq" aria-labelledby="faq-title">
      <div className="at-wrap at-ap-faq__grid">
        <div className="at-ap-faq__intro">
          <SectionLabel>Questions</SectionLabel>
          <h2 id="faq-title" className="at-h2" data-fx="lines">
            Questions I hear a lot.
          </h2>
          <p className="at-head__sub">Not here? Ask me directly.</p>
        </div>
        <ul className="at-ap-qs" data-fx="stagger">
          {FAQ.map((item, index) => (
            <li key={item.q}>
              <details className="at-ap-q">
                <summary>
                  <span className="at-ap-q__n">{pad(index + 1)}</span>
                  <span className="at-ap-q__t">{item.q}</span>
                  <span className="at-ap-q__icon" aria-hidden="true" />
                </summary>
                <div className="at-ap-q__a">
                  <p>{item.a}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* Call to action */}
    <section className="at-section at-ap-cta" aria-labelledby="cta-title">
      <div className="at-wrap">
        <h2 id="cta-title" className="at-ap-cta__title" data-fx="lines">
          Ready when you are.
        </h2>
        <div className="at-ap-cta__row">
          <Link to="/contact" className="at-btn at-btn--arrow">
            <span>Start a project</span>
            <span className="at-btn__cell" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </Link>
          <a href={MAILTO} className="at-arrow-link">
            ansh.dev721@gmail.com
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>
      </div>
    </section>
  </PageFx>
))

Approach.displayName = 'Approach'

export default Approach
