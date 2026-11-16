import { useEffect, useState } from 'react'

/**
 * The section that currently crosses a thin band around the middle of the viewport (Lenis-safe).
 *
 * Tracks every section inside the band, not only the entries of the latest callback: very tall or
 * pinned sections (which never cross a ratio threshold) used to leave the previous section active.
 * When two sections share the band, the later one in page order wins.
 */
export function useActiveSection(sectionIds, defaultId = sectionIds[0], resetKey) {
  const [activeId, setActiveId] = useState(defaultId)

  useEffect(() => {
    // `resetKey` (e.g. the route) re-runs the observer when a different page mounts.
    setActiveId(defaultId)
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    if (!elements.length) return undefined

    const inBand = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target.id)
          else inBand.delete(entry.target.id)
        })
        const current = [...sectionIds].reverse().find((id) => inBand.has(id))
        if (current) setActiveId(current)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds, defaultId, resetKey])

  return activeId
}
