import { memo, useState, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from './lib/utils'
import { CINEMATIC_EASE, MOTION_DURATION } from '../motion/cinematic'
import { useMediaQuery } from '../hooks/useMediaQuery'
import ResponsivePicture from './ResponsivePicture'

const GRID_SIZE = 3
const CELL_COUNT = GRID_SIZE * GRID_SIZE

function ServicesBento({ services, className }) {
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [activeRow, setActiveRow] = useState(1)
  const [activeCol, setActiveCol] = useState(1)
  const [mobileActive, setMobileActive] = useState(0)

  const cells = useMemo(
    () => Array.from({ length: CELL_COUNT }, (_, i) => services[i % services.length]),
    [services],
  )

  const gridTemplateRows = [0, 1, 2]
    .map((r) => (activeRow === r ? '3fr' : '1fr'))
    .join(' ')

  const gridTemplateColumns = [0, 1, 2]
    .map((c) => (activeCol === c ? '3fr' : '1fr'))
    .join(' ')

  const resetActive = () => {
    setActiveRow(1)
    setActiveCol(1)
  }

  if (isMobile) {
    return (
      <div className={cn('w-full', className)}>
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4">
          {services.map((service, i) => {
            const isActive = mobileActive === i
            const Icon = service.icon
            const number = String(i + 1).padStart(2, '0')

            return (
              <button
                key={service.name}
                type="button"
                className={cn(
                  'services-bento-mobile-card interactive-tap group relative w-full overflow-hidden rounded-xl border text-left shadow-lg transition-[opacity,transform,box-shadow] duration-200 sm:rounded-2xl',
                  'border-[var(--glass-border)]',
                  isActive
                    ? 'ring-2 ring-[#ff6b00]/55'
                    : 'opacity-90',
                  'active:scale-[0.99]',
                )}
                onClick={() => setMobileActive(i)}
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
                  sizes="(max-width: 767px) 100vw, 33vw"
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
      </div>
    )
  }

  return (
    <div className={cn('flex w-full min-w-0 items-center justify-center', className)}>
      <motion.div
        className="services-bento-grid grid h-[min(68vh,780px)] w-full min-w-0 max-w-full gap-2 sm:gap-3 md:gap-4"
        animate={{ gridTemplateRows, gridTemplateColumns }}
        onMouseLeave={resetActive}
        transition={
          prefersReducedMotion
            ? { duration: 0.2 }
            : { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }
        }
      >
        {cells.map((service, i) => {
          const row = Math.floor(i / GRID_SIZE)
          const col = i % GRID_SIZE
          const isActive = activeRow === row && activeCol === col
          const serviceIndex = services.findIndex((s) => s.name === service.name)
          const number = String((serviceIndex >= 0 ? serviceIndex : i % services.length) + 1).padStart(
            2,
            '0',
          )
          const Icon = service.icon

          return (
            <motion.div
              key={`${service.name}-${i}`}
              className={cn(
                'group relative cursor-pointer overflow-hidden rounded-2xl border shadow-lg transition-[opacity,filter,box-shadow] duration-500',
                'border-[var(--glass-border)]',
                isActive
                  ? 'z-20 scale-[1.02] shadow-[0_24px_80px_rgba(255,107,0,0.18)]'
                  : 'z-0 opacity-75 grayscale-[0.35] hover:opacity-100 hover:grayscale-0',
              )}
              onMouseEnter={() => {
                setActiveRow(row)
                setActiveCol(col)
              }}
              onClick={() => {
                setActiveRow(row)
                setActiveCol(col)
              }}
              onFocus={() => {
                setActiveRow(row)
                setActiveCol(col)
              }}
              tabIndex={0}
              role="button"
              aria-label={service.title}
            >
              <ResponsivePicture
                src={service.image}
                alt=""
                width={960}
                height={720}
                loading="eager"
                sizes="33vw"
                preferWebp={false}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-t transition-opacity duration-500',
                  isActive
                    ? 'from-black via-black/70 to-black/20 opacity-95'
                    : 'from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-50',
                )}
                aria-hidden
              />

              <div
                className={cn(
                  'absolute inset-x-0 bottom-0 z-30 flex flex-col p-3 transition-all duration-500 sm:p-4 md:p-5',
                  isActive
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
                )}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b00]">
                    {number}
                  </span>
                  {Icon ? <Icon className="text-sm text-[#ff6b00]" aria-hidden /> : null}
                </div>

                <h3 className="type-display-sm text-sm leading-tight text-white sm:text-base md:text-lg">
                  {service.title}
                </h3>

                {isActive ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: MOTION_DURATION, ease: CINEMATIC_EASE, delay: 0.04 }}
                    className="mt-3 space-y-3"
                  >
                    <p className="text-xs leading-relaxed text-white/80 sm:text-sm">{service.description}</p>
                    <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="list-none rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/90 sm:px-2.5 sm:py-1 sm:text-[10px]"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
              </div>

              {isActive ? (
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[#ff6b00]/55"
                  aria-hidden
                />
              ) : null}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default memo(ServicesBento)
