import { useEffect, useState } from 'react'

/**
 * Highlights the nav link for the section most visible in the viewport (Lenis-safe).
 */
export function useActiveSection(sectionIds, defaultId = sectionIds[0]) {
  const [activeId, setActiveId] = useState(defaultId)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-42% 0px -48% 0px', threshold: [0, 0.15, 0.35, 0.55] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
