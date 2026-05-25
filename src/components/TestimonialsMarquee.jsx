import { memo, useMemo } from 'react'

/** Enough cards so the loop never shows empty space on wide screens. */
function buildSeamlessLoop(items, minPerHalf = 12) {
  const half = []
  while (half.length < minPerHalf) {
    half.push(...items)
  }
  return [...half, ...half]
}

function TestimonialCard({ testimonial }) {
  return (
    <article className="testimonial-marquee-card glass-card flex shrink-0 flex-col rounded-2xl border border-[var(--glass-border)] p-6 md:p-7">
      <span className="mb-3 block font-serif text-4xl leading-none text-[#ff6b00] select-none md:text-5xl" aria-hidden>
        &ldquo;
      </span>
      <p className="editorial-body mb-5 flex-1 text-sm leading-relaxed md:text-base">{testimonial.content}</p>
      <div className="mb-4 h-px bg-[var(--glass-border)]" />
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff6b00] text-sm font-semibold text-white md:h-11 md:w-11">
          {testimonial.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium tracking-tight text-[var(--text-primary)]">{testimonial.name}</p>
          <p className="mt-0.5 truncate text-xs text-secondary md:text-sm">
            {testimonial.title}, {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  )
}

function TestimonialsMarquee({ testimonials }) {
  const loopItems = useMemo(() => buildSeamlessLoop(testimonials), [testimonials])

  const renderTrack = (direction) => (
    <div className="testimonial-marquee-row">
      <div
        className={`testimonial-marquee-track ${
          direction === 'ltr' ? 'testimonial-marquee-ltr' : 'testimonial-marquee-rtl'
        }`}
      >
        {loopItems.map((t, i) => (
          <TestimonialCard key={`${direction}-${t.name}-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="testimonial-marquee-strip" aria-label="Client testimonials">
      {renderTrack('ltr')}
      {renderTrack('rtl')}
    </div>
  )
}

export default memo(TestimonialsMarquee)
