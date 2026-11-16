import { Link } from 'react-router-dom'
import HandwriteAccent from '../components/HandwriteAccent'
import GsapReveal from '../components/GsapReveal'

const NotFound = () => (
  <div className="relative z-10 page-hero-pad pb-16 sm:pb-24 md:pb-32">
    <section className="section-pad py-12 sm:py-20">
      <GsapReveal className="site-shell text-center" stagger={0.1} y={28} start="top 90%">
        <HandwriteAccent as="h1" size="title" className="mb-2" masked>
          Page Not Found
        </HandwriteAccent>
        <HandwriteAccent tone="soft" className="mb-6" masked>
          This Page Doesn&apos;t Exist
        </HandwriteAccent>
        <p className="editorial-body mx-auto max-w-xl text-base sm:text-lg" data-reveal>
          The page you were looking for may have moved or never existed. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4" data-reveal>
          <Link to="/" className="btn-primary btn-primary--hero">
            Back to Home
          </Link>
          <Link to="/services" className="hero-story-btn">
            My Expertise
          </Link>
          <Link to="/contact" className="hero-story-btn">
            Contact
          </Link>
        </div>
      </GsapReveal>
    </section>
  </div>
)

export default NotFound
