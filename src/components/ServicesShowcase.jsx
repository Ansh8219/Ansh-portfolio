import { memo } from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import ServicesBento from './ServicesBento'
import HandwriteAccent from './HandwriteAccent'
import {
  SCROLL_VIEWPORT,
  revealUp,
  staggerContainer as scrollStaggerContainer,
} from './ScrollReveal'

function ServicesShowcase({ services }) {
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <section id="services" className="w-full bg-[var(--bg-primary)] py-12 sm:py-16 md:py-20">
      <motion.div
        className="section-pad site-shell w-full"
        variants={scrollStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={SCROLL_VIEWPORT}
      >
        <motion.div
          className="mb-8 flex flex-col items-center text-center md:mb-10"
          variants={revealUp}
        >
          <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-secondary md:text-xs">What we do</p>
          <HandwriteAccent as="h2" size="title">
            Our Services
          </HandwriteAccent>
          <HandwriteAccent tone="soft" className="mt-2 md:mt-3">
            Strategy → Build → Scale
          </HandwriteAccent>
        </motion.div>

        <motion.div className="w-full max-w-none" variants={revealUp}>
          <p className="mb-4 text-center text-[10px] font-medium uppercase tracking-[0.35em] text-secondary">
            {isMobile ? 'Tap a tile to explore' : 'Hover a tile to explore'}
          </p>
          <ServicesBento services={services} className="w-full md:min-h-[520px]" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default memo(ServicesShowcase)
