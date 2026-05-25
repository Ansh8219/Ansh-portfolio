import { useMemo, memo } from 'react'
import { useReducedMotion } from 'framer-motion'
import ThreeDCarousel from './lightswind/3d-carousel'
import { useMediaQuery } from '../hooks/useMediaQuery'

function mapProjectsToCarouselItems(projects) {
  return projects.map((project, index) => ({
    id: index + 1,
    title: project.title,
    brand: project.category,
    description: project.description,
    tags: [project.year, ...project.tech.split(', ')],
    imageUrl: project.image,
    link: '#contact',
  }))
}

function FeaturedWorkCarousel({ projects }) {
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(max-width: 1023px)')
  const items = useMemo(() => mapProjectsToCarouselItems(projects), [projects])

  const cardHeight = isMobile ? 360 : isTablet ? 440 : 520

  if (!items.length) return null

  return (
    <ThreeDCarousel
      items={items}
      autoRotate={!prefersReducedMotion && items.length > 1}
      rotateInterval={5000}
      cardHeight={cardHeight}
    />
  )
}

export default memo(FeaturedWorkCarousel)
