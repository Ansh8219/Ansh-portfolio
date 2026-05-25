import { useEffect, useRef, memo } from 'react'

const AnimatedBackground = memo(() => {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const orbsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    let orbs = orbsRef.current

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resizeCanvas()
    
    // Throttle resize handler
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 250)
    }
    
    window.addEventListener('resize', handleResize, { passive: true })

    class Orb {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = Math.random() * 100 + 50
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.3 + 0.1
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x > canvas.width + this.radius) this.x = -this.radius
        if (this.x < -this.radius) this.x = canvas.width + this.radius
        if (this.y > canvas.height + this.radius) this.y = -this.radius
        if (this.y < -this.radius) this.y = canvas.height + this.radius
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        )
        gradient.addColorStop(0, `rgba(255, 107, 0, ${this.opacity})`)
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(255, 107, 0, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create orbs (reduced count for better performance)
    if (orbs.length === 0) {
      for (let i = 0; i < 4; i++) {
        orbs.push(new Orb())
      }
      orbsRef.current = orbs
    }

    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime

      if (deltaTime >= frameInterval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        orbs.forEach((orb) => {
          orb.update()
          orb.draw()
        })

        lastTime = currentTime - (deltaTime % frameInterval)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-20] opacity-30"
      style={{ background: 'transparent' }}
    />
  )
})

AnimatedBackground.displayName = 'AnimatedBackground'

export default AnimatedBackground
