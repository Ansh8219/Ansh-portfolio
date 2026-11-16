import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from '../components/atlas/SectionLabel'
import PageFx from '../components/PageFx'
import { MAILTO } from '../components/BrandedEmail'
import WorkRows from '../components/WorkRows'
import { WORK_CASES, WORK_INTRO } from '../content/work'

const Work = memo(() => {
  return (
    <PageFx className="wk-page">
      <section className="at-ap-hero wk-hero" aria-labelledby="work-title" data-fx="hero">
        <div className="at-wrap at-ap-hero__inner">
          <SectionLabel>Work</SectionLabel>
          <h1 id="work-title" className="at-ap-hero__title">
            <span className="at-ab-hero__ln" data-ln>
              <span data-ln-in>Our work</span>
            </span>
          </h1>
          <p className="at-ap-hero__statement" data-fx="fill">
            {WORK_INTRO}
          </p>
        </div>
      </section>

      <div className="wk-ticker" data-fx="ticker" data-speed="46" aria-hidden="true">
        <div className="wk-ticker__track" data-ticker-track>
          {[0, 1].map((copy) => (
            <span key={copy} className="wk-ticker__half">
              {WORK_CASES.map((item) => (
                <span key={item.key}>{item.title}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section className="at-section wk-list" aria-label="Projects">
        <div className="at-wrap">
          <WorkRows items={WORK_CASES} defaultOpen={WORK_CASES[0].key} />
        </div>
      </section>

      <section className="at-section at-ap-cta" aria-labelledby="work-cta-title">
        <div className="at-wrap">
          <h2 id="work-cta-title" className="at-ap-cta__title" data-fx="lines">
            Your product is next.
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

Work.displayName = 'Work'

export default Work
