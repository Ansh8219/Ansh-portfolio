import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from './SectionLabel'

/** Home teaser that sends visitors to the full resume page. */
function ResumeAtlas() {
  return (
    <section id="resume" className="at-section at-ap-cta" aria-labelledby="resume-title">
      <div className="at-wrap">
        <SectionLabel>Resume</SectionLabel>
        <h2 id="resume-title" className="at-ap-cta__title">
          4+ years, one page.
        </h2>
        <p className="at-head__sub">Skills, experience and selected projects in one place. Save it as a PDF from there.</p>
        <div className="at-ap-cta__row">
          <Link to="/resume" className="at-btn at-btn--arrow">
            <span>See resume</span>
            <span className="at-btn__cell" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </Link>
          <Link to="/contact" className="at-arrow-link">
            Hire me
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default memo(ResumeAtlas)
