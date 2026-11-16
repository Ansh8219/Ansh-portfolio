import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from '../components/atlas/SectionLabel'
import PageFx from '../components/PageFx'
import { MAILTO } from '../components/BrandedEmail'
import { DISCIPLINES, SERVICES } from '../content/site'
import { servicePageForKey } from '../content/serviceLanding'
import { SERVICES_INTRO, SERVICE_DETAILS } from '../content/services'

const pad = (n) => String(n).padStart(2, '0')
const TOTAL = SERVICES.length

/** One discipline. Left column sticks on desktop while the feature list animates in on the right. */
function Discipline({ service, index }) {
  const detail = SERVICE_DETAILS[service.key]
  const hue = DISCIPLINES[service.key]?.cls ?? ''
  const Icon = DISCIPLINES[service.key]?.Icon
  return (
    <section id={service.key} className={`sv-block ${hue}`} aria-labelledby={`sv-${service.key}`}>
      <div className="at-wrap sv-block__grid">
        <header className="sv-block__side">
          <div className="sv-block__sticky">
            <p className="sv-block__num" aria-hidden="true">
              <b>{pad(index + 1)}</b>
              <span>/ {pad(TOTAL)}</span>
            </p>
            <h2 id={`sv-${service.key}`} className="sv-block__title" data-fx="lines">
              {service.name}
            </h2>
            {Icon && <Icon className="sv-block__icon" aria-hidden="true" />}
          </div>
        </header>

        <div className="sv-block__main">
          <p className="sv-block__lead" data-fx="fill">
            {detail.lead}
          </p>
          <span className="sv-rule" data-fx="rule" aria-hidden="true" />
          <h3 className="sv-block__h">What we do</h3>
          <ul className="sv-feats" data-fx="stagger">
            {detail.features.map((feature, i) => (
              <li key={feature} className="sv-feat" data-spot>
                <span className="sv-feat__n">{pad(i + 1)}</span>
                <span className="sv-feat__t">{feature}</span>
              </li>
            ))}
          </ul>
          <div data-fx="rise" className="sv-links">
            <Link to={`/services/${servicePageForKey(service.key).slug}`} className="at-arrow-link">
              Full details
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            <Link to="/contact" className="at-arrow-link">
              Talk to us
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

const Services = memo(() => (
  <PageFx className="sv-page">
    <section className="at-ap-hero sv-hero" aria-labelledby="services-title" data-fx="hero">
      <div className="at-wrap at-ap-hero__inner">
        <SectionLabel>Services</SectionLabel>
        <h1 id="services-title" className="at-ap-hero__title">
          <span className="at-ab-hero__ln" data-ln>
            <span data-ln-in>Services</span>
          </span>
        </h1>
        <p className="at-ap-hero__statement" data-fx="fill">
          {SERVICES_INTRO}
        </p>
        <ol className="wk-index" aria-label="Disciplines" data-fx="stagger">
          {SERVICES.map((service, i) => (
            <li key={service.key}>
              <a href={`#${service.key}`}>
                <span>{pad(i + 1)}</span>
                {service.name}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {SERVICES.map((service, index) => (
      <Discipline key={service.key} service={service} index={index} />
    ))}

    <section className="at-section at-ap-cta" aria-labelledby="services-cta-title">
      <div className="at-wrap">
        <h2 id="services-cta-title" className="at-ap-cta__title" data-fx="lines">
          Ready to build?
        </h2>
        <div className="at-ap-cta__row">
          <Link to="/contact" className="at-btn at-btn--arrow">
            <span>Start a project</span>
            <span className="at-btn__cell" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </Link>
          <a href={MAILTO} className="at-arrow-link">
            hello@northvaultstudios.com
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>
      </div>
    </section>
  </PageFx>
))

Services.displayName = 'Services'

export default Services
