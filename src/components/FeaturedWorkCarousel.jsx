import { memo, useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { preloadImages } from '../utils/preloadImages'
import { CINEMATIC_EASE, MOTION_DURATION } from '../motion/cinematic'
import ResponsivePicture from './ResponsivePicture'

function FeaturedWorkCarousel({ projects, onCtaClick }) {
  const prefersReducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const count = projects.length

  useEffect(() => {
    if (!projects.length) return
    preloadImages(
      projects.map((p) => p.image),
      { priority: 'low' },
    )
  }, [projects])

  const goTo = useCallback(
    (index) => {
      if (!count) return
      setActive(((index % count) + count) % count)
    },
    [count],
  )

  const goPrev = useCallback(() => {
    setActive((prev) => (prev - 1 + count) % count)
  }, [count])

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % count)
  }, [count])

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    },
    [goPrev, goNext],
  )

  if (!count) return null

  const project = projects[active]
  const number = String(active + 1).padStart(2, '0')
  const total = String(count).padStart(2, '0')
  const techTags = project.tech
    ? project.tech.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: MOTION_DURATION, ease: CINEMATIC_EASE },
      }

  return (
    <div
      className="featured-work w-full outline-none"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="featured-work__stage grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-10 xl:gap-12">
        <div className="relative flex flex-col gap-3 lg:col-span-7">
          <div className="featured-work__media relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:min-h-[480px] lg:h-full">
            <motion.div key={project.image} className="absolute inset-0" {...motionProps}>
              <ResponsivePicture
                src={project.image}
                alt=""
                width={1280}
                height={900}
                loading={active === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 1023px) 100vw, 58vw"
                preferWebp={false}
                className="h-full w-full object-cover object-center"
              />
              <div className="featured-work__media-veil pointer-events-none absolute inset-0" aria-hidden />
            </motion.div>
          </div>

          <div
            className="featured-work__thumbs grid grid-cols-4 gap-2 sm:gap-2.5"
            role="tablist"
            aria-label="Project previews"
          >
            {projects.map((item, index) => {
              const isActive = index === active
              return (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show ${item.title}`}
                  onClick={() => goTo(index)}
                  className={`featured-work__thumb interactive-tap group relative aspect-[16/10] overflow-hidden ${
                    isActive ? 'is-active' : ''
                  }`}
                >
                  <ResponsivePicture
                    src={item.image}
                    alt=""
                    width={320}
                    height={200}
                    loading="lazy"
                    sizes="(max-width: 1023px) 22vw, 12vw"
                    preferWebp={false}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="featured-work__thumb-veil" aria-hidden />
                  <span className="featured-work__thumb-label">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col justify-center lg:col-span-5">
          <motion.div key={project.title} className="flex flex-col" {...motionProps}>
            <div className="mb-3 flex items-center gap-3 sm:mb-4">
              <span className="font-sans text-[11px] font-medium tabular-nums tracking-[0.2em] text-accent">
                {number}
              </span>
              <span className="h-px w-8 bg-[var(--glass-border)]" aria-hidden />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-secondary">
                {project.category}
              </span>
            </div>

            <h3 className="type-display-sm mb-3 text-2xl leading-tight text-[var(--text-primary)] sm:mb-4 sm:text-3xl md:text-4xl">
              {project.title}
            </h3>

            <p className="editorial-body mb-4 max-w-md text-sm leading-relaxed text-secondary sm:mb-5 sm:text-base">
              {project.description}
            </p>

            {project.outcome ? (
              <p className="featured-work__outcome mb-5 sm:mb-6">{project.outcome}</p>
            ) : null}

            {techTags.length ? (
              <ul className="mb-6 flex flex-wrap gap-x-4 gap-y-2 sm:mb-7">
                {techTags.map((tag) => (
                  <li
                    key={tag}
                    className="list-none font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-primary)]/70"
                  >
                    {tag}
                  </li>
                ))}
                {project.year ? (
                  <li className="list-none font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-secondary">
                    {project.year}
                  </li>
                ) : null}
              </ul>
            ) : null}

            {onCtaClick ? (
              <button type="button" onClick={onCtaClick} className="btn-primary w-fit">
                Start a similar project
              </button>
            ) : null}
          </motion.div>

          <div className="mt-7 flex items-center justify-between gap-4 border-t border-[var(--glass-border)] pt-5 sm:mt-8">
            <p className="font-sans text-[11px] tabular-nums tracking-[0.22em] text-secondary" aria-live="polite">
              <span className="text-[var(--text-primary)]">{number}</span>
              <span className="mx-2 opacity-40">/</span>
              <span>{total}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="featured-work__nav interactive-tap"
                aria-label="Previous project"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="featured-work__nav interactive-tap"
                aria-label="Next project"
              >
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(FeaturedWorkCarousel)
