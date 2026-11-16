import { memo } from 'react'
import { Link } from 'react-router-dom'
import SectionLabel from '../components/atlas/SectionLabel'
import PageFx from '../components/PageFx'
import { LEGAL_UPDATED, PRIVACY, TERMS } from '../content/legal'

const DOCS = { privacy: PRIVACY, terms: TERMS }
const pad = (n) => String(n).padStart(2, '0')
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/** Privacy / Terms. Plain, always-visible text: only the page title animates. `doc` is "privacy" or "terms". */
const Legal = memo(({ doc }) => {
  const data = DOCS[doc]
  const other = doc === 'privacy' ? { to: '/terms', label: 'Terms of Use' } : { to: '/privacy', label: 'Privacy Policy' }
  return (
    <PageFx className="lg-page">
      <section className="lg-hero" aria-labelledby="lg-title">
        <div className="at-wrap">
          <SectionLabel>Legal</SectionLabel>
          <h1 id="lg-title" className="lg-title" data-fx="lines">
            {data.title}
          </h1>
          <p className="lg-meta">Last updated {LEGAL_UPDATED}</p>
        </div>
      </section>

      <section className="lg-body" aria-label={data.title}>
        <div className="at-wrap lg-grid">
          <nav className="lg-toc" aria-label="On this page">
            <p className="lg-toc__h">On this page</p>
            <ol>
              {data.sections.map((section, i) => (
                <li key={section.h}>
                  <a href={`#${slugify(section.h)}`}>
                    <span>{pad(i + 1)}</span>
                    {section.h}
                  </a>
                </li>
              ))}
            </ol>
            <Link to={other.to} className="at-arrow-link lg-toc__other">
              {other.label}
            </Link>
          </nav>

          <div className="lg-doc">
            <p className="lg-intro">{data.intro}</p>
            {data.sections.map((section, i) => (
              <section key={section.h} id={slugify(section.h)} className="lg-block" aria-labelledby={`${slugify(section.h)}-h`}>
                <h2 id={`${slugify(section.h)}-h`} className="lg-h">
                  <span>{pad(i + 1)}</span>
                  {section.h}
                </h2>
                {section.p.map((text) => (
                  <p key={text} className="lg-p">
                    {text}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </PageFx>
  )
})

Legal.displayName = 'Legal'

export default Legal
