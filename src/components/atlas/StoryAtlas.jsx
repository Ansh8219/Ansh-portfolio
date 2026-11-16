import { memo, useRef } from 'react'
import { Link } from 'react-router-dom'
import SectionLabel from './SectionLabel'
import { WHO_WE_ARE_P1, WHO_WE_ARE_P2, ART } from '../../content/site'
import { gsap, fillWords, useSignalMotion } from '../../motion/signal'

const FACTS = [
  { label: 'Experience', value: '4+ years' },
  { label: 'Focus', value: 'Architecture & Python backend' },
  { label: 'Contact', value: 'ansh.dev721@gmail.com' },
]

/**
 * Studio (inverted "paper" section). A large statement fills word by word as it scrolls past;
 * the studio image opens out of a clip-path mask beside it.
 */
function StoryAtlas() {
  const rootRef = useRef(null)

  useSignalMotion(rootRef, (_conditions, scope) => {
    const q = gsap.utils.selector(scope)
    const splits = [fillWords(q('[data-fill]')[0], { from: 0.16, start: 'clamp(top 75%)', end: 'clamp(bottom 45%)' })]

    const frame = q('[data-frame]')[0]
    const video = q('[data-video]')[0]
    if (frame && video) {
      const range = { trigger: frame, start: 'clamp(top 95%)', end: 'clamp(top 30%)', scrub: 0.6 }
      gsap.fromTo(frame, { clipPath: 'inset(12% 12% 12% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: range })
      gsap.fromTo(video, { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: range })
    }

    q('[data-fact]').forEach((fact, i) => {
      const rule = fact.querySelector('[data-rule]')
      const trigger = { trigger: fact, start: 'clamp(top 92%)', once: true }
      gsap.from(rule, { scaleX: 0, transformOrigin: 'left center', duration: 1.1, delay: i * 0.08, ease: 'expo.out', scrollTrigger: trigger })
    })

    return () => splits.forEach((s) => s?.revert())
  })

  return (
    <section id="who-we-are" ref={rootRef} className="at-section at-invert at-story" aria-labelledby="story-title">
      <div className="at-wrap at-story__grid">
        <SectionLabel className="at-story__label">About</SectionLabel>

        <div className="at-story__main">
          <h2 id="story-title" className="sr-only">
            About Ansh
          </h2>
          <p className="at-story__statement" data-fill>
            {WHO_WE_ARE_P1}
          </p>

          <ul className="at-facts">
            {FACTS.map((fact) => (
              <li key={fact.label} className="at-fact" data-fact>
                <span className="at-fact__rule" data-rule aria-hidden="true" />
                <span className="at-fact__label">{fact.label}</span>
                <span className="at-fact__value">{fact.value}</span>
              </li>
            ))}
          </ul>

          <p className="at-story__body">{WHO_WE_ARE_P2}</p>

          <div className="at-story__actions">
            <Link to="/about" className="at-btn at-btn--ghost">
              About me
            </Link>
            <Link to="/services" className="at-btn at-btn--ghost">
              My expertise
            </Link>
          </div>
        </div>

        <figure className="at-story__media">
          <div className="at-story__frame" data-frame>
            <img
              src={ART.studio.image}
              srcSet={`${ART.studio.imageSm} 720w, ${ART.studio.image} ${ART.studio.width}w`}
              sizes="(min-width: 1024px) 30vw, 100vw"
              alt="A developer desk: laptop with code, wireframe sketches and a desk lamp"
              width={ART.studio.width}
              height={ART.studio.height}
              loading="lazy"
              decoding="async"
              className="at-story__video"
              data-video
            />
          </div>
          <figcaption className="at-caption">Fig. 02 · The workspace</figcaption>
        </figure>
      </div>
    </section>
  )
}

export default memo(StoryAtlas)
