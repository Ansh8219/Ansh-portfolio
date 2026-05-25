import { useEffect, useState } from 'react'

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.innerWidth < 768) return

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e) => {
      if (e.target.closest('a, button, .glow-hover, .card-3d, .premium-button, .premium-card')) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest('a, button, .glow-hover, .card-3d, .premium-button, .premium-card')) {
      setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('mouseover', handleMouseEnter, true)
    document.addEventListener('mouseout', handleMouseLeave, true)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mouseover', handleMouseEnter, true)
      document.removeEventListener('mouseout', handleMouseLeave, true)
    }
  }, [])

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null
  }

  return (
    <>
      <div
        className={`fixed pointer-events-none z-[9999] transition-all duration-300 ease-out ${
          isHovering ? 'scale-150 opacity-100' : 'scale-100 opacity-40'
        }`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className={`w-8 h-8 rounded-full border-2 transition-colors duration-300 ${
          isHovering ? 'border-nvs-orange bg-nvs-orange/10' : 'border-white/60 bg-white/5'
        } backdrop-blur-[2px]`}></div>
      </div>
      <div
        className="fixed pointer-events-none z-[9999] transition-all duration-150 ease-out"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          isHovering ? 'bg-nvs-orange scale-[2.5]' : 'bg-white'
        }`}></div>
      </div>
    </>
  )
}

export default CustomCursor

