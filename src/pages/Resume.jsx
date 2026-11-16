import { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Printer } from 'lucide-react'
import SectionLabel from '../components/atlas/SectionLabel'
import PageFx from '../components/PageFx'
import { MAILTO } from '../components/BrandedEmail'
import { SOCIAL_LINKS, STACK_ROWS, SERVICES } from '../content/site'
import { WORK_CASES } from '../content/work'

const pad = (n) => String(n).padStart(2, '0')

const SKILL_GROUPS = [
  { h: 'Backend', items: ['Python', 'Django & DRF', 'FastAPI', 'Celery', 'REST APIs', 'Microservices', 'System architecture'] },
  { h: 'Frontend & mobile', items: ['React', 'Vite', 'JavaScript', 'TypeScript', 'Flutter (iOS & Android)'] },
  { h: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'] },
  { h: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'CI/CD pipelines', 'GitHub Actions', 'Jenkins'] },
  { h: 'AI', items: ['LLM integrations', 'AI agents', 'RAG', 'Vector databases', 'Workflow automation'] },
]

const PROJECT_LIST = WORK_CASES.filter((c) => c.key !== 'northvault')

const SECTIONS = ['Summary', 'Skills', 'Experience', 'Selected projects', 'Contact']

/** Resume page: text only, printable. "Save as PDF" uses the browser's print dialog. */
const Resume = memo(() => {
  const print = useCallback(() => window.print(), [])
  return (
    <PageFx className="lg-page rs-page">
      <section className="lg-hero" aria-labelledby="rs-title">
        <div className="at-wrap">
          <SectionLabel>Resume</SectionLabel>
          <h1 id="rs-title" className="lg-title" data-fx="lines">
            Ansh
          </h1>
          <p className="lg-meta">Full Stack, AI &amp; DevOps Engineer · 4+ years · Chandigarh / Mohali, India</p>
          <div className="rs-actions">
            <button type="button" onClick={print} className="at-btn at-btn--arrow">
              <span>Save as PDF</span>
              <span className="at-btn__cell" aria-hidden="true">
                <Printer size={18} />
              </span>
            </button>
            <a href={MAILTO} className="at-arrow-link">
              ansh.dev721@gmail.com
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="lg-body" aria-label="Resume">
        <div className="at-wrap lg-grid">
          <nav className="lg-toc" aria-label="On this page">
            <p className="lg-toc__h">On this page</p>
            <ol>
              {SECTIONS.map((s, i) => (
                <li key={s}>
                  <a href={`#rs-${i}`}>
                    <span>{pad(i + 1)}</span>
                    {s}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="lg-doc">
            <section id="rs-0" className="lg-block">
              <h2 className="lg-h"><span>01</span>Summary</h2>
              <p className="lg-p">
                Full stack, AI and DevOps engineer with 4+ years of experience. I mainly design system architecture and
                build Python backends with Django and FastAPI, React web apps and Flutter mobile apps, and I run the cloud
                infrastructure and CI/CD behind them.
              </p>
            </section>

            <section id="rs-1" className="lg-block">
              <h2 className="lg-h"><span>02</span>Skills</h2>
              {SKILL_GROUPS.map((g) => (
                <div key={g.h} className="rs-skill">
                  <p className="rs-skill__h">{g.h}</p>
                  <ul className="rs-tags">
                    {g.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section id="rs-2" className="lg-block">
              <h2 className="lg-h"><span>03</span>Experience</h2>
              <p className="lg-p"><strong>Full Stack &amp; AI Developer</strong> · 4+ years</p>
              <ul className="rs-list">
                <li>Design system architecture and build Python backends (Django, FastAPI) with PostgreSQL, Redis and Celery.</li>
                <li>Build React web apps and admin panels, and Flutter apps released on the App Store and Google Play.</li>
                <li>Set up and run AWS infrastructure with Docker, CI/CD and monitoring.</li>
                <li>Integrate LLMs, AI agents and RAG into products.</li>
              </ul>
            </section>

            <section id="rs-3" className="lg-block">
              <h2 className="lg-h"><span>04</span>Selected projects</h2>
              {PROJECT_LIST.map((p) => (
                <div key={p.key} className="rs-project">
                  <p className="rs-project__t">
                    {p.title} <span>· {p.category}</span>
                  </p>
                  <p className="lg-p">{p.summary}</p>
                  {p.stack.length ? <p className="rs-project__s">{p.stack.join(' · ')}</p> : null}
                </div>
              ))}
              <Link to="/work" className="at-arrow-link">
                Project details
                <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            </section>

            <section id="rs-4" className="lg-block">
              <h2 className="lg-h"><span>05</span>Contact</h2>
              <p className="lg-p">
                <a href={MAILTO}>ansh.dev721@gmail.com</a> · <a href="tel:+918219698580">+91 8219698580</a>
              </p>
              <p className="lg-p">
                {SOCIAL_LINKS.map(({ name, url }, i) => (
                  <span key={name}>
                    {i ? ' · ' : ''}
                    <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
                  </span>
                ))}
              </p>
            </section>
          </div>
        </div>
      </section>
    </PageFx>
  )
})

Resume.displayName = 'Resume'

export default Resume
