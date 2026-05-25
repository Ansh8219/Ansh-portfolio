import { useRef, useEffect, useState, type TouchEvent } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Card, CardContent } from './card'
import { useIsMobile } from '../hooks/use-mobile'
import { scrollToSection } from '../../utils/scrollToSection'

export interface ThreeDCarouselItem {
  id: number
  title: string
  brand: string
  description: string
  tags: string[]
  imageUrl: string
  link: string
}

interface ThreeDCarouselProps {
  items: ThreeDCarouselItem[]
  autoRotate?: boolean
  rotateInterval?: number
  cardHeight?: number
  isMobileSwipe?: boolean
}

const ThreeDCarousel = ({
  items,
  autoRotate = true,
  rotateInterval = 5000,
  cardHeight = 480,
  isMobileSwipe = true,
}: ThreeDCarouselProps) => {
  const [active, setActive] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const isMobile = useIsMobile()
  const minSwipeDistance = 50

  useEffect(() => {
    if (!autoRotate || !isInView || isHovering || items.length < 2) return
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length)
    }, rotateInterval)
    return () => clearInterval(interval)
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length])

  useEffect(() => {
    const node = carouselRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const onTouchStart = (e: TouchEvent) => {
    if (!isMobileSwipe) return
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(null)
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!isMobileSwipe) return
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!isMobileSwipe || touchStart === null || touchEnd === null) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length)
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length)
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  const getCardAnimationClass = (index: number) => {
    if (index === active) return 'scale-100 opacity-100 z-20'
    if (index === (active + 1) % items.length) {
      return 'translate-x-[40%] scale-95 opacity-60 z-10 pointer-events-none'
    }
    if (index === (active - 1 + items.length) % items.length) {
      return 'translate-x-[-40%] scale-95 opacity-60 z-10 pointer-events-none'
    }
    return 'scale-90 opacity-0 pointer-events-none'
  }

  if (!items.length) return null

  return (
    <section
      id="ThreeDCarousel"
      className="flex min-w-full items-center justify-center bg-transparent"
      aria-label="Featured projects carousel"
    >
      <div className="w-full min-w-0 max-w-none px-0">
        <div
          className="relative h-[min(380px,72vh)] overflow-hidden sm:h-[460px] md:h-[580px] lg:h-[600px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          ref={carouselRef}
        >
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`absolute top-0 w-[calc(100%-1.5rem)] max-w-lg transform transition-all duration-500 ease-out sm:w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl ${getCardAnimationClass(index)}`}
              >
                <Card
                  bordered
                  hoverable
                  className="glass-card flex flex-col overflow-hidden border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] shadow-lg"
                  style={{ height: cardHeight }}
                >
                  <div
                    className="relative flex h-36 items-center justify-center overflow-hidden p-4 sm:h-44 sm:p-5 md:h-48 md:p-6"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/55" aria-hidden />
                    <div className="relative z-10 text-center text-white">
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--text-accent)]">
                        {item.brand}
                      </p>
                      <div className="mx-auto mb-2 h-px w-12 bg-[var(--text-accent)]" />
                      <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{item.title}</h3>
                    </div>
                  </div>

                  <CardContent
                    className="flex flex-grow flex-col p-4 text-[var(--text-primary)] sm:p-5 md:p-6"
                    removeTopPadding={false}
                  >
                    <h3 className="mb-1 text-lg font-bold text-[var(--text-primary)] sm:text-xl">{item.title}</h3>
                    <p className="mb-2 text-xs font-medium text-[var(--text-secondary)] sm:text-sm">{item.brand}</p>
                    <p className="flex-grow text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                      {item.description}
                    </p>

                    <div className="mt-4">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[var(--glass-border)] bg-[var(--bg-secondary)] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[var(--text-secondary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={item.link}
                        className="group relative flex items-center text-[var(--text-secondary)] transition-colors hover:text-[var(--text-accent)]"
                        onClick={(e) => {
                          if (item.link.startsWith('#')) {
                            e.preventDefault()
                            scrollToSection(item.link.slice(1), 80)
                          }
                        }}
                      >
                        <span className="relative z-10 text-sm font-medium uppercase tracking-wider">
                          View project
                        </span>
                        <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-[var(--text-accent)] transition-all duration-300 group-hover:w-full" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {!isMobile && items.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)]/90 text-[var(--text-primary)] shadow-md backdrop-blur-md transition-all hover:scale-110 hover:border-[var(--text-accent)] hover:text-[var(--text-accent)] sm:left-4"
                onClick={() => setActive((prev) => (prev - 1 + items.length) % items.length)}
                aria-label="Previous project"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--text-accent)] bg-[var(--text-accent)] text-[#0a0a0a] shadow-md transition-all hover:scale-110 hover:brightness-110 sm:right-4"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                aria-label="Next project"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {items.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-3">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active === idx
                      ? 'w-5 bg-[var(--text-accent)]'
                      : 'w-2 bg-[var(--glass-border)] hover:bg-[var(--text-accent)]/40'
                  }`}
                  onClick={() => setActive(idx)}
                  aria-label={`Go to project ${idx + 1}`}
                  aria-current={active === idx ? 'true' : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ThreeDCarousel
