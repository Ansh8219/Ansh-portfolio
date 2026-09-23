import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import HandwriteAccent from './HandwriteAccent'
import GsapReveal from './GsapReveal'
import ResponsivePicture from './ResponsivePicture'
import { preloadImages } from '../utils/preloadImages'
import { getLenisInstance } from '../utils/lenis'
import { cn } from './lib/utils'

gsap.registerPlugin(ScrollTrigger)

// Longer track per service so Lenis wheel deltas don't skip indices.
const VH_PER_SERVICE = 1.45
const EASE_OUT = 'power3.out'
const EASE_IN_OUT = 'power2.inOut'

function scrollToProgress(container, progress) {
  if (!container) return
  const rect = container.getBoundingClientRect()
  const start = window.scrollY + rect.top
  const track = Math.max(1, container.offsetHeight - window.innerHeight)
  const top = start + Math.min(1, Math.max(0, progress)) * track
  const lenis = getLenisInstance()
  if (lenis) {
    lenis.scrollTo(top, { duration: 0.9, offset: 0 })
    return
  }
  window.scrollTo({ top, behavior: 'smooth' })
}

function splitWords(text) {
  return String(text || '')
    .split(/(\s+)/)
    .filter((part) => part.length > 0)
}

function ServiceIndexList({ services, activeIndex, onSelect }) {
  return (
    <nav aria-label="Services" className="services-pin__index flex flex-col">
      {services.map((service, i) => {
        const isActive = i === activeIndex
        const number = String(i + 1).padStart(2, '0')
        return (
          <button
            key={service.name}
            type="button"
            onClick={() => onSelect(i)}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'group relative flex items-center gap-2.5 border-l-2 py-1.5 pl-3 text-left transition-[color,border-color] duration-300 [@media(min-height:800px)]:py-2',
              isActive
                ? 'border-[#ff6b00] text-[var(--text-primary)]'
                : 'border-transparent text-secondary hover:border-[var(--glass-border)] hover:text-[var(--text-primary)]',
            )}
          >
            <span
              className={cn(
                'w-5 shrink-0 font-sans text-[10px] tabular-nums tracking-[0.18em] transition-colors duration-300',
                isActive ? 'text-[#ff6b00]' : 'text-secondary/70',
              )}
            >
              {number}
            </span>
            <span
              className={cn(
                'type-display-sm text-[12px] leading-snug transition-[font-weight,letter-spacing] duration-300 sm:text-[13px] [@media(min-height:800px)]:sm:text-sm',
                isActive ? 'font-bold tracking-tight' : 'font-medium tracking-normal',
              )}
            >
              {service.title}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

function MobileServices({ services }) {
  const [active, setActive] = useState(0)

  return (
    <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4">
      {services.map((service, i) => {
        const isActive = active === i
        const Icon = service.icon
        const number = String(i + 1).padStart(2, '0')

        return (
          <button
            key={service.name}
            type="button"
            className={cn(
              'interactive-tap group relative w-full overflow-hidden rounded-xl border text-left shadow-lg transition-[opacity,transform,box-shadow] duration-200 sm:rounded-2xl',
              'border-[var(--glass-border)]',
              isActive ? 'ring-2 ring-[#ff6b00]/55' : 'opacity-90',
              'active:scale-[0.99]',
            )}
            onClick={() => setActive(i)}
            aria-expanded={isActive}
            aria-label={service.title}
          >
            <ResponsivePicture
              src={service.image}
              alt=""
              width={960}
              height={720}
              loading={i < 3 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              sizes="(max-width: 767px) 100vw, 50vw"
              preferWebp={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/15"
              aria-hidden
            />
            <div className="relative z-10 flex min-h-[11rem] flex-col justify-end p-4 sm:min-h-[12rem] sm:p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b00]">
                  {number}
                </span>
                {Icon ? <Icon className="text-sm text-[#ff6b00]" aria-hidden /> : null}
              </div>
              <h3 className="type-display-sm text-sm leading-tight text-white sm:text-base">
                {service.title}
              </h3>
              {isActive ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs leading-relaxed text-white/80">{service.description}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {service.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="list-none rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/90"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function DesktopStickyServices({ services }) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const hintRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const metaRef = useRef(null)
  const featuresRef = useRef(null)
  const imageRefs = useRef([])
  const mediaRefs = useRef([])
  const jumpLockRef = useRef(false)
  const jumpTimerRef = useRef(null)
  const hintTimerRef = useRef(null)
  const activeRef = useRef(0)
  const prevIndexRef = useRef(0)
  const didInitRef = useRef(false)
  const tlRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hintVisible, setHintVisible] = useState(true)
  const count = services.length
  const service = services[activeIndex] ?? services[0]
  const Icon = service?.icon
  const totalLabel = String(count).padStart(2, '0')
  const numberLabel = String(activeIndex + 1).padStart(2, '0')
  const titleWords = splitWords(service?.title)

  const dismissHint = useCallback(() => {
    setHintVisible(false)
    if (hintTimerRef.current) {
      window.clearTimeout(hintTimerRef.current)
      hintTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!services.length) return
    preloadImages(
      services.map((s) => s.image),
      { priority: 'low' },
    )
  }, [services])

  useEffect(() => {
    // Auto-hide after a few seconds so it doesn't linger forever
    if (!hintVisible) return undefined
    hintTimerRef.current = window.setTimeout(() => setHintVisible(false), 6000)
    return () => {
      if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current)
    }
  }, [hintVisible])

  useEffect(() => {
    if (activeIndex > 0) dismissHint()
  }, [activeIndex, dismissHint])

  useEffect(() => {
    return () => {
      if (jumpTimerRef.current) window.clearTimeout(jumpTimerRef.current)
      if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current)
      tlRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    const lenis = getLenisInstance()
    if (!lenis) {
      ScrollTrigger.refresh()
      return undefined
    }
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    ScrollTrigger.refresh()
    return () => {
      lenis.off('scroll', onScroll)
    }
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || !count) return undefined

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleY: p })
        }
        if (jumpLockRef.current) return

        const target = Math.min(count - 1, Math.max(0, Math.floor(p * count)))
        const current = activeRef.current
        if (target === current) return
        const next = target > current ? current + 1 : current - 1
        activeRef.current = next
        setActiveIndex(next)
      },
    })

    return () => trigger.kill()
  }, [count])

  useLayoutEffect(() => {
    imageRefs.current.forEach((layer, i) => {
      if (!layer) return
      gsap.set(layer, {
        autoAlpha: i === 0 ? 1 : 0,
        zIndex: i === 0 ? 2 : 1,
        clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
      })
      if (mediaRefs.current[i]) {
        gsap.set(mediaRefs.current[i], { scale: i === 0 ? 1 : 1.12, yPercent: 0 })
      }
    })

    // Initial text settle
    const words = titleRef.current?.querySelectorAll('.services-pin__word-inner')
    if (words?.length) gsap.set(words, { yPercent: 0 })
    if (metaRef.current) gsap.set(metaRef.current, { autoAlpha: 1, y: 0 })
    if (descRef.current) gsap.set(descRef.current, { autoAlpha: 1, y: 0 })
    if (featuresRef.current) {
      gsap.set(featuresRef.current.querySelectorAll('li'), { autoAlpha: 1, y: 0 })
    }
  }, [count])

  useLayoutEffect(() => {
    const prev = prevIndexRef.current
    prevIndexRef.current = activeIndex
    activeRef.current = activeIndex

    const incoming = imageRefs.current[activeIndex]
    const outgoing = imageRefs.current[prev]
    const words = titleRef.current?.querySelectorAll('.services-pin__word-inner')
    const chips = featuresRef.current?.querySelectorAll('li')

    if (prefersReducedMotion) {
      imageRefs.current.forEach((layer, i) => {
        if (!layer) return
        gsap.set(layer, {
          autoAlpha: i === activeIndex ? 1 : 0,
          zIndex: i === activeIndex ? 2 : 1,
          clipPath: 'inset(0% 0% 0% 0%)',
        })
        if (mediaRefs.current[i]) gsap.set(mediaRefs.current[i], { scale: 1, yPercent: 0 })
      })
      if (words?.length) gsap.set(words, { yPercent: 0 })
      if (metaRef.current) gsap.set(metaRef.current, { autoAlpha: 1, y: 0 })
      if (descRef.current) gsap.set(descRef.current, { autoAlpha: 1, y: 0 })
      if (chips?.length) gsap.set(chips, { autoAlpha: 1, y: 0 })
      return undefined
    }

    // First paint — no transition
    if (!didInitRef.current) {
      didInitRef.current = true
      return undefined
    }

    if (prev === activeIndex) return undefined

    tlRef.current?.kill()
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } })
    tlRef.current = tl

    // Text: masked word rise + cascade
    const wordMasks = words?.length
      ? Array.from(words)
          .map((word) => word.parentElement)
          .filter(Boolean)
      : []
    if (words?.length) {
      gsap.set(words, { yPercent: 115 })
      wordMasks.forEach((mask) => mask.classList.add('is-masked'))
    }
    if (metaRef.current) gsap.set(metaRef.current, { autoAlpha: 0, y: 16 })
    if (descRef.current) gsap.set(descRef.current, { autoAlpha: 0, y: 20, filter: 'blur(6px)' })
    if (chips?.length) gsap.set(chips, { autoAlpha: 0, y: 14 })

    tl.to(metaRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0)
    tl.to(
      words || [],
      {
        yPercent: 0,
        duration: 0.72,
        stagger: 0.04,
        onComplete: () => {
          wordMasks.forEach((mask) => mask.classList.remove('is-masked'))
        },
      },
      0.04,
    )
    tl.to(
      descRef.current,
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6 },
      0.16,
    )
    tl.to(
      chips || [],
      { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.05 },
      0.22,
    )

    // Images: curtain wipe + Ken Burns
    imageRefs.current.forEach((layer, i) => {
      if (!layer) return
      if (i === activeIndex) gsap.set(layer, { zIndex: 3 })
      else if (i === prev) gsap.set(layer, { zIndex: 2 })
      else gsap.set(layer, { zIndex: 1 })
    })

    if (incoming) {
      gsap.set(incoming, { autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0%)' })
      if (mediaRefs.current[activeIndex]) {
        gsap.set(mediaRefs.current[activeIndex], { scale: 1.16, yPercent: 8 })
      }

      tl.to(
        incoming,
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05, ease: EASE_IN_OUT },
        0,
      )
      tl.to(
        mediaRefs.current[activeIndex],
        { scale: 1, yPercent: 0, duration: 1.4, ease: EASE_OUT },
        0,
      )
    }

    if (outgoing && outgoing !== incoming) {
      if (mediaRefs.current[prev]) {
        tl.to(
          mediaRefs.current[prev],
          { scale: 1.08, yPercent: -5, duration: 1, ease: EASE_IN_OUT },
          0,
        )
      }
      tl.to(
        outgoing,
        { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' },
        0.4,
      )
    }

    tl.add(() => {
      imageRefs.current.forEach((layer, i) => {
        if (!layer || i === activeIndex) return
        gsap.set(layer, {
          autoAlpha: 0,
          clipPath: 'inset(100% 0% 0% 0%)',
          zIndex: 1,
        })
      })
      if (incoming) gsap.set(incoming, { zIndex: 2 })
    })

    return () => {
      tl.kill()
    }
  }, [activeIndex, prefersReducedMotion])

  const onSelect = useCallback(
    (index) => {
      if (!count) return
      dismissHint()
      jumpLockRef.current = true
      activeRef.current = index
      setActiveIndex(index)
      scrollToProgress(containerRef.current, (index + 0.35) / count)
      if (jumpTimerRef.current) window.clearTimeout(jumpTimerRef.current)
      jumpTimerRef.current = window.setTimeout(() => {
        jumpLockRef.current = false
      }, 1100)
    },
    [count, dismissHint],
  )

  const trackHeight = `${Math.max(count, 1) * VH_PER_SERVICE * 100}vh`

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: trackHeight }}
      data-active-service={activeIndex}
    >
      <div className="sticky top-0 flex h-[100svh] max-h-[100svh] flex-col overflow-hidden">
        <div className="section-pad site-shell flex min-h-0 flex-1 flex-col py-5 md:py-7 [@media(min-height:800px)]:py-9">
          <GsapReveal
            className="mb-4 flex shrink-0 flex-col items-start [@media(min-height:800px)]:mb-7"
            stagger={0.08}
            y={18}
            start="top 88%"
          >
            <p
              className="mb-1.5 text-[10px] uppercase tracking-[0.35em] text-secondary md:text-xs"
              data-reveal
            >
              What we do
            </p>
            <HandwriteAccent as="h2" size="title" align="left" masked>
              Our Services
            </HandwriteAccent>
            <HandwriteAccent tone="soft" align="left" className="mt-1" masked>
              Strategy → Build → Scale
            </HandwriteAccent>
            <p
              className="mt-3 flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.28em] text-[#ff6b00]"
              data-reveal
            >
              <span className="services-pin__hint-chevron inline-block" aria-hidden>
                ↓
              </span>
              Scroll to explore services
            </p>
          </GsapReveal>

          <div className="grid min-h-0 flex-1 grid-cols-12 items-stretch gap-6 xl:gap-12">
            <div className="col-span-5 flex min-h-0 flex-col justify-between gap-4 xl:col-span-4 [@media(min-height:800px)]:gap-6">
              <ServiceIndexList
                services={services}
                activeIndex={activeIndex}
                onSelect={onSelect}
              />

              <div className="services-pin__copy relative min-h-[8rem] [@media(min-height:800px)]:min-h-[11rem]">
                <div
                  ref={metaRef}
                  className="mb-2 flex items-center gap-3 [@media(min-height:800px)]:mb-3"
                >
                  <span className="font-sans text-[11px] tabular-nums tracking-[0.28em] text-secondary">
                    <span className="text-[#ff6b00]">{numberLabel}</span>
                    <span className="mx-1.5 text-secondary/40">/</span>
                    {totalLabel}
                  </span>
                  {Icon ? <Icon className="text-base text-[#ff6b00]" aria-hidden /> : null}
                </div>

                <h3
                  ref={titleRef}
                  className="type-display mb-3 text-[1.45rem] leading-[1.08] text-[var(--text-primary)] sm:text-2xl md:text-[2rem] [@media(min-height:800px)]:mb-4"
                >
                  {titleWords.map((part, i) =>
                    /^\s+$/.test(part) ? (
                      <span key={`sp-${i}`}>{' '}</span>
                    ) : (
                      <span key={`${service.name}-w-${i}`} className="services-pin__word">
                        <span className="services-pin__word-inner inline-block will-change-transform">
                          {part}
                        </span>
                      </span>
                    ),
                  )}
                </h3>

                <p
                  ref={descRef}
                  className="editorial-body mb-3 max-w-md text-[13px] leading-relaxed text-secondary line-clamp-3 [@media(min-height:800px)]:mb-4 [@media(min-height:800px)]:line-clamp-none [@media(min-height:800px)]:text-sm"
                >
                  {service?.description}
                </p>

                <ul
                  ref={featuresRef}
                  className="hidden flex-wrap gap-2 [@media(min-height:760px)]:flex"
                >
                  {service?.features?.map((feature) => (
                    <li
                      key={feature}
                      className="list-none border border-[var(--glass-border)] px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-primary)]/75"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative col-span-7 min-h-0 xl:col-span-8">
              <div className="services-pin__stage absolute inset-0 overflow-hidden">
                {services.map((item, i) => (
                  <div
                    key={item.name}
                    ref={(node) => {
                      imageRefs.current[i] = node
                    }}
                    className="services-pin__layer absolute inset-0"
                    aria-hidden={i !== activeIndex}
                  >
                    <div
                      ref={(node) => {
                        mediaRefs.current[i] = node
                      }}
                      className="services-pin__media h-full w-full will-change-transform"
                    >
                      <ResponsivePicture
                        src={item.image}
                        alt=""
                        width={1280}
                        height={960}
                        loading={i <= 1 ? 'eager' : 'lazy'}
                        fetchPriority={i === 0 ? 'high' : undefined}
                        sizes="(max-width: 1023px) 100vw, 55vw"
                        preferWebp={false}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>
                ))}

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/35 via-transparent to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[var(--glass-border)]"
                  aria-hidden
                />

                <div
                  className="services-pin__progress pointer-events-none absolute right-3 top-1/2 z-10 hidden h-[42%] w-px -translate-y-1/2 bg-white/15 lg:block"
                  aria-hidden
                >
                  <span
                    ref={progressRef}
                    className="absolute inset-x-0 top-0 origin-top bg-[#ff6b00]"
                    style={{ height: '100%', transform: 'scaleY(0)' }}
                  />
                </div>

                {hintVisible ? (
                  <div
                    ref={hintRef}
                    className="services-pin__hint pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4"
                    aria-hidden
                  >
                    <div className="flex items-center gap-3 rounded-full border border-white/30 bg-black/60 px-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
                      <span className="services-pin__hint-mouse relative h-6 w-3.5 rounded-full border border-white/80">
                        <span className="services-pin__hint-wheel absolute left-1/2 top-1.5 h-1.5 w-0.5 -translate-x-1/2 rounded-full bg-[#ff6b00]" />
                      </span>
                      <span className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-white">
                        Scroll to explore
                      </span>
                      <span className="services-pin__hint-chevron text-base text-[#ff6b00]" aria-hidden>
                        ↓
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ServicesShowcase({ services }) {
  const isMobile = useMediaQuery('(max-width: 767px)')

  if (!services?.length) return null

  if (isMobile) {
    return (
      <section id="services" className="w-full bg-[var(--bg-primary)] py-12 sm:py-16">
        <div className="section-pad site-shell w-full">
          <GsapReveal className="mb-8 flex flex-col items-center text-center" stagger={0.08} y={20}>
            <p
              className="mb-2 text-[10px] uppercase tracking-[0.35em] text-secondary"
              data-reveal
            >
              What we do
            </p>
            <HandwriteAccent as="h2" size="title" masked>
              Our Services
            </HandwriteAccent>
            <HandwriteAccent tone="soft" className="mt-2" masked>
              Strategy → Build → Scale
            </HandwriteAccent>
          </GsapReveal>
          <MobileServices services={services} />
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="w-full bg-[var(--bg-primary)]">
      <DesktopStickyServices services={services} />
    </section>
  )
}

export default memo(ServicesShowcase)
