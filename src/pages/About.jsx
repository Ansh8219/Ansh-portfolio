import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from '../components/atlas/SectionLabel'
import PageFx from '../components/PageFx'
import { ART, DISCIPLINES, PROJECTS, SERVICES, STACK_ROWS, WHO_WE_ARE_P1, WHO_WE_ARE_P2, WHY_CHOOSE_US } from '../content/site'

const pad = (n) => String(n).padStart(2, '0')

// `count` values tick up from 0 when the row scrolls into view (the server renders the final number)
const FACTS = [
  { label: 'Based in', text: 'Chandigarh, India' },
  { label: 'Shipped', count: PROJECTS.length, after: ' platforms' },
  { label: 'Disciplines', count: SERVICES.length, after: ', one team' },
  { label: 'Replies', before: 'Within ', count: 24, after: ' hours' },
]

const TICKER = ['AI & agents', 'Software', 'Web & mobile', 'Cloud & DevOps', 'Data & QA', 'Brand & marketing']

const STEPS = [
  {
    title: 'Discover',
    text: 'We start with the problem and the goal, not a feature list: who it is for, what success looks like and what is in the way.',
  },
  {
    title: 'Plan',
    text: 'Architecture, scope and a clear plan before the first line of code, so the budget and the timeline actually mean something.',
  },
  {
    title: 'Build',
    text: 'Focused sprints with working software at every step. You see real progress, not promises.',
  },
  {
    title: 'Launch',
    text: 'Testing, deployment and handover on infrastructure that is built for production from day one.',
  },
  {
    title: 'Support',
    text: 'We stay accountable after launch: monitoring, fixes and the next round of improvements.',
  },
]

/** One infinite, CSS-driven row of tools. The second copy is hidden from assistive tech. */
function ToolRow({ items, reverse = false, duration = 60 }) {
  const group = (hidden) =>
    items.map(({ name, Icon }) => (
      <li key={`${hidden ? 'b' : 'a'}-${name}`} className="at-ab-tool" aria-hidden={hidden || undefined}>
        <Icon aria-hidden="true" size={20} />
        {name}
      </li>
    ))
  return (
    <div className={`at-ab-marquee${reverse ? ' is-reverse' : ''}`} style={{ '--dur': `${duration}s` }}>
      <ul className="at-ab-marquee__track">
        {group(false)}
        {group(true)}
      </ul>
    </div>
  )
}

/** Big scrolling words between the hero and the next section (decorative; speeds up while scrolling). */
function Ticker() {
  const group = (hidden) =>
    TICKER.map((word, i) => (
      <span key={`${hidden ? 'b' : 'a'}-${word}`} className={`at-ab-ticker__item${i % 2 ? ' is-outline' : ''}`}>
        {word}
        <i aria-hidden="true" />
      </span>
    ))
  return (
    <div className="at-ab-ticker" data-fx="ticker" data-speed="45" aria-hidden="true">
      <div className="at-ab-ticker__track" data-ticker-track>
        <div className="at-ab-ticker__group">{group(false)}</div>
        <div className="at-ab-ticker__group">{group(true)}</div>
      </div>
    </div>
  )
}

const About = memo(() => (
  <PageFx className="at-about-page">
    {/* Hero */}
    <section className="at-ab-hero" aria-labelledby="about-title" data-fx="hero">
      <div className="at-wrap at-ab-hero__inner">
        <SectionLabel>About</SectionLabel>
        <svg className="at-ab-badge" viewBox="0 0 120 120" aria-hidden="true" focusable="false" data-fx="spin">
          <defs>
            <path id="abBadgePath" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text fontSize="9.6" letterSpacing="1.4">
            <textPath href="#abBadgePath" textLength="286" lengthAdjust="spacing">
              Engineering + creative · Chandigarh, India ·
            </textPath>
          </text>
          <path d="M60 44v30m0 0l-9-9m9 9l9-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 id="about-title" className="at-ab-hero__title">
          <span className="at-ab-hero__ln" data-ln>
            <span data-ln-in>Engineered,</span>
          </span>
          <span className="at-ab-hero__ln" data-ln>
            <span data-ln-in>not assembled.</span>
          </span>
        </h1>
        <div className="at-ab-hero__base">
          <p className="at-ab-hero__lead" data-fx="rise" data-delay="0.7">
            NorthVault Studios is a digital engineering and AI solutions studio in Chandigarh, India. We build software that is meant to last, and we stay with it after launch.
          </p>
          <div className="at-cx-hero__meta" data-fx="rise" data-delay="0.85">
            <span>Studio in Chandigarh</span>
            <span>Engineering + creative, under one roof</span>
          </div>
        </div>
      </div>
    </section>

    <Ticker />

    {/* Who we are */}
    <section className="at-section at-invert at-ab-who" aria-labelledby="who-title">
      <div className="at-wrap at-ab-who__grid">
        <figure className="at-ab-who__media">
          <div className="at-ab-who__frame" data-fx="clip">
            <img
              src={ART.studio.image}
              srcSet={`${ART.studio.imageSm} 720w, ${ART.studio.image} ${ART.studio.width}w`}
              sizes="(min-width: 1024px) 34vw, 100vw"
              alt="A NorthVault Studios desk: laptop with code, wireframe sketches and a desk lamp"
              width={ART.studio.width}
              height={ART.studio.height}
              loading="lazy"
              decoding="async"
              data-fx-inner
            />
          </div>
          <svg className="at-ab-who__seal" viewBox="0 0 120 120" aria-hidden="true" focusable="false" data-fx="spin">
            <defs>
              <path id="abSealPath" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            </defs>
            <text fontSize="9.6" letterSpacing="1.4">
              <textPath href="#abSealPath" textLength="286" lengthAdjust="spacing">
                Built to last · Built to last · Built to last ·
              </textPath>
            </text>
            <circle cx="60" cy="60" r="7" fill="currentColor" />
          </svg>
          <figcaption className="at-caption">Fig. 01 · The studio</figcaption>
        </figure>

        <div className="at-ab-who__main">
          <SectionLabel>Who we are</SectionLabel>
          <h2 id="who-title" className="sr-only">
            Who we are
          </h2>
          <p className="at-story__statement" data-fx="fill">
            {WHO_WE_ARE_P1}
          </p>
          <p className="at-story__body">{WHO_WE_ARE_P2}</p>

          <ul className="at-facts at-ab-facts">
            {FACTS.map((fact) => (
              <li key={fact.label} className="at-fact">
                <span className="at-fact__rule" data-fx="rule" aria-hidden="true" />
                <span className="at-fact__label">{fact.label}</span>
                <span className="at-fact__value">
                  {fact.text ?? (
                    <>
                      {fact.before}
                      <span data-fx="count" data-to={fact.count}>
                        {fact.count}
                      </span>
                      {fact.after}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* What we do */}
    <section className="at-section at-ab-do" aria-labelledby="do-title">
      <div className="at-wrap">
        <div className="at-ab-head">
          <SectionLabel>What we do</SectionLabel>
          <h2 id="do-title" className="at-h2" data-fx="lines">
            Six disciplines, one team.
          </h2>
        </div>

        <ol className="at-ab-rows" data-fx="stagger">
          {SERVICES.map((service, index) => (
            <li key={service.key} className={`at-ab-row h-${service.key}`}>
              <Link to={{ pathname: '/services', hash: `#${service.key}` }} className="at-ab-row__link">
                <span className="at-ab-row__num">{pad(index + 1)}</span>
                <span className="at-ab-row__name">{DISCIPLINES[service.key].label}</span>
                <span className="at-ab-row__text">
                  <span className="at-ab-row__desc">{service.description}</span>
                  <span className="at-ab-row__feat">{service.features.slice(0, 3).join(' · ')}</span>
                </span>
                <span className="at-ab-row__arrow" aria-hidden="true">
                  <ArrowUpRight size={22} />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* How we work */}
    <section className="at-section at-invert at-ab-how" aria-labelledby="how-title">
      <div className="at-wrap at-ab-how__grid">
        <div className="at-ab-how__intro">
          <SectionLabel>How we work</SectionLabel>
          <h2 id="how-title" className="at-h2" data-fx="lines">
            Clear steps, sharp delivery.
          </h2>
          <p className="at-head__sub">No black box. Five steps, each with something you can see, review and sign off.</p>
          <p className="at-ab-how__count" aria-hidden="true">
            <b data-fx-counter>01</b>
            <span>/ {pad(STEPS.length)}</span>
          </p>
        </div>

        <ol className="at-ab-steps" data-fx="progress">
          <span className="at-ab-steps__line" data-fx-line aria-hidden="true" />
          {STEPS.map((step, index) => (
            <li key={step.title} className="at-ab-step" data-fx-step>
              <span className="at-ab-step__num">{pad(index + 1)}</span>
              <div>
                <h3 className="at-ab-step__title">{step.title}</h3>
                <p className="at-ab-step__text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* Why us */}
    <section className="at-section at-ab-why" aria-labelledby="why-title">
      <div className="at-wrap">
        <div className="at-ab-head">
          <SectionLabel>Why teams choose us</SectionLabel>
          <h2 id="why-title" className="at-h2" data-fx="lines">
            We don&apos;t chase trends. We build things that last.
          </h2>
        </div>

        <ul className="at-ab-why__grid" data-fx="stagger">
          {WHY_CHOOSE_US.map((item, index) => (
            <li key={item.title} className="at-ab-why__item" data-spot>
              <span className="at-ab-why__rule" aria-hidden="true" />
              <span className="at-ab-why__num">{pad(index + 1)}</span>
              <h3 className="at-ab-why__title">{item.title}</h3>
              <p className="at-ab-why__text">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* Tools */}
    <section className="at-section at-ab-tools" aria-labelledby="tools-title">
      <div className="at-wrap at-ab-head">
        <SectionLabel>Tools</SectionLabel>
        <h2 id="tools-title" className="at-ab-tools__title" data-fx="lines">
          What we build with.
        </h2>
      </div>
      <div className="at-ab-tools__rows">
        {STACK_ROWS.map((row, index) => (
          <ToolRow key={index} items={row} reverse={index % 2 === 1} duration={55 + index * 12} />
        ))}
      </div>
      <div className="at-wrap at-ab-tools__cta">
        <Link to="/contact" className="at-btn at-btn--arrow">
          <span>Start a project</span>
          <span className="at-btn__cell" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </Link>
        <Link to="/services" className="at-btn at-btn--ghost">
          Our services
        </Link>
      </div>
    </section>
  </PageFx>
))

About.displayName = 'About'

export default About
