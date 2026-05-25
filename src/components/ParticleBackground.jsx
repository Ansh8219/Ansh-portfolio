import { useEffect, useRef, memo } from 'react'

const ParticleBackground = memo(() => {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    let particles = particlesRef.current

    // Define Particle class first before it's used
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = `rgba(255, 107, 0, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      
      // Recreate particles on resize for better performance
      particles = []
      const particleCount = Math.floor((rect.width * rect.height) / 20000) // Slightly reduced for performance
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
      particlesRef.current = particles
    }

    resizeCanvas()
    
    // Throttle resize handler
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 250)
    }
    
    window.addEventListener('resize', handleResize, { passive: true })

    // Create particles
    if (particles.length === 0) {
      const particleCount = Math.floor((canvas.width * canvas.height) / 20000)
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
      particlesRef.current = particles
    }

    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime

      if (deltaTime >= frameInterval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Update and draw particles
        particles.forEach((particle) => {
          particle.update()
          particle.draw()
        })

        // Optimize connection drawing - only draw connections for nearby particles
        const maxDistance = 150
        const maxDistanceSq = maxDistance * maxDistance
        
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i]
          for (let j = i + 1; j < particles.length; j++) {
            const otherParticle = particles[j]
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distanceSq = dx * dx + dy * dy

            if (distanceSq < maxDistanceSq) {
              const distance = Math.sqrt(distanceSq)
              ctx.strokeStyle = `rgba(255, 107, 0, ${0.1 * (1 - distance / maxDistance)})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.stroke()
            }
          }
        }

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
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-20]"
      style={{ background: 'transparent' }}
    />
  )
})

ParticleBackground.displayName = 'ParticleBackground'

export default ParticleBackground
