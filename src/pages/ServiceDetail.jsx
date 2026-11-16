import { memo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from '../components/atlas/SectionLabel'
import PageFx from '../components/PageFx'
import { MAILTO } from '../components/BrandedEmail'
import { DISCIPLINES } from '../content/site'
import { SERVICE_PAGES, getServicePage } from '../content/serviceLanding'
import NotFound from './NotFound'

const pad = (n) => String(n).padStart(2, '0')

const PROCESS = [
  { t: 'Listen', p: 'A conversation about what the product should do, who it is for and what a good result looks like.' },
  { t: 'Plan', p: 'A written plan with architecture, scope, timeline and cost, signed off by you.' },
  { t: 'Build', p: 'Focused sprints with regular demos, so you see progress and can steer it.' },
  { t: 'Launch & support', p: 'We ship it, then stay on to fix, tune and extend it.' },
]

const ServiceDetail = memo(() => {
  const { slug } = useParams()
  const page = getServicePage(slug)
  if (!page) return <NotFound />

  const hue = DISCIPLINES[page.key]?.cls ?? ''
  const others = SERVICE_PAGES.filter((p) => p.slug !== page.slug)

  return (
    <PageFx className={`sd-page ${hue}`}>
      <section className="at-ap-hero sd-hero" aria-labelledby="sd-title">
        <div className="at-wrap at-ap-hero__inner">
          <nav aria-label="Breadcrumb" className="sd-crumbs">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/services">Services</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.name}</span>
          </nav>
          <SectionLabel>{page.name}</SectionLabel>
          <h1 id="sd-title" className="sd-title" data-fx="lines">
            {page.h1}
          </h1>
          <p className="at-ap-hero__statement sd-intro" data-fx="fill">
            {page.intro}
          </p>
          <div className="sd-hero__cta" data-fx="rise">
            <Link to="/contact" className="at-btn at-btn--arrow">
              <span>Talk to us</span>
              <span className="at-btn__cell" aria-hidden="true">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="at-section sd-section" aria-labelledby="sd-included">
        <div className="at-wrap">
          <SectionLabel>What&apos;s included</SectionLabel>
          <h2 id="sd-included" className="at-h2 sd-h2" data-fx="lines">
            What we deliver.
          </h2>
          <ul className="sd-included" data-fx="stagger">
            {page.included.map((item, i) => (
              <li key={item.name} className="sd-included__item" data-spot>
                <span className="sd-included__n">{pad(i + 1)}</span>
                <h3 className="sd-included__t">{item.name}</h3>
                <p className="sd-included__p">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="at-section sd-section at-invert" aria-labelledby="sd-process">
        <div className="at-wrap">
          <SectionLabel>How it runs</SectionLabel>
          <h2 id="sd-process" className="at-h2 sd-h2" data-fx="lines">
            One team, start to finish.
          </h2>
          <ol className="sd-process" data-fx="stagger">
            {PROCESS.map((step, i) => (
              <li key={step.t} className="sd-process__step">
                <span className="sd-included__n">{pad(i + 1)}</span>
                <h3 className="sd-included__t">{step.t}</h3>
                <p className="sd-included__p">{step.p}</p>
              </li>
            ))}
          </ol>
          <p className="sd-more" data-fx="rise">
            <Link to="/approach" className="at-arrow-link">
              See the full approach
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            <Link to="/work" className="at-arrow-link">
              See our work
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </p>
        </div>
      </section>

      <section className="at-section sd-section" aria-labelledby="sd-faq">
        <div className="at-wrap at-ap-faq__grid">
          <div className="at-ap-faq__intro">
            <SectionLabel>Questions</SectionLabel>
            <h2 id="sd-faq" className="at-h2 sd-h2" data-fx="lines">
              Common questions.
            </h2>
          </div>
          <ul className="at-ap-qs" data-fx="stagger">
            {page.faqs.map((item, i) => (
              <li key={item.q}>
                <details className="at-ap-q">
                  <summary>
                    <span className="at-ap-q__n">{pad(i + 1)}</span>
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

      <section className="at-section sd-section" aria-labelledby="sd-related">
        <div className="at-wrap">
          <SectionLabel>More services</SectionLabel>
          <h2 id="sd-related" className="sr-only">
            Other services
          </h2>
          <ul className="sd-related" data-fx="stagger">
            {others.map((p) => (
              <li key={p.slug}>
                <Link to={`/services/${p.slug}`}>
                  {p.name}
                  <ArrowUpRight aria-hidden="true" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="at-section at-ap-cta" aria-labelledby="sd-cta">
        <div className="at-wrap">
          <h2 id="sd-cta" className="at-ap-cta__title" data-fx="lines">
            Tell us what you&apos;re building.
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
  )
})

ServiceDetail.displayName = 'ServiceDetail'

export default ServiceDetail
