import { memo, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, ScrollTrigger, fontsReady } from '../../motion/signal'
import { readVaultFlag, deviceAllows3D } from '../../motion/vaultFlag'

/**
 * Fixed, full-viewport layer that hosts the hero's WebGL object. React only ever renders an empty,
 * aria-hidden <div> (identical on server and client); the canvas is added imperatively after
 * hydration, so there is nothing to mismatch.
 *
 * The scene is created only when ALL of these hold: home route, feature flag on, desktop-class
 * device, motion allowed, hardware WebGL. Otherwise the static SVG illustrations stay in place.
 */
function VaultStage() {
  const { pathname } = useLocation()
  const hostRef = useRef(null)
  const onHome = pathname === '/'

  useEffect(() => {
    if (!onHome) return undefined
    if (!readVaultFlag() || !deviceAllows3D()) return undefined

    let cancelled = false
    let cleanup = null
    const root = document.documentElement
    const params = new URLSearchParams(window.location.search)

    const boot = async () => {
      let mod
      try {
        // Sections create their pins once fonts are ready; wait for the same moment so the vault's
        // triggers are measured with every pin spacer in place (and the display font is loaded).
        await fontsReady(1500)
        mod = await import('../../three/vault')
      } catch {
        return
      }
      if (cancelled || !hostRef.current) return
      if (!mod.hasWebGL()) return
      // CPU-rendered WebGL: keep the static visual (QA can override with ?vault-allow-software)
      if (!params.has('vault-allow-software') && mod.isSoftwareRenderer()) return

      let vault
      try {
        vault = mod.createVault(hostRef.current)
      } catch {
        return
      }
      const { api } = vault
      // ?vault-debug exposes the scroll-driven state for QA scripts
      if (params.has('vault-debug')) window.__nvVault = api

      vault.onFirstFrame(() => root.classList.add('vault-live'))
      vault.onContextLost(() => root.classList.remove('vault-live'))

      // Scroll: the object lives in the hero only and travels WITH it: `lift` moves it up exactly as
      // fast as the page scrolls (1 screen height = 1 screen of world units), so it reads as part of
      // the hero rather than a fixed overlay. Once the hero is out of view it is hidden entirely.
      const ctx = gsap.context(() => {
        const hero = document.querySelector('#hero')

        gsap.to(api, { intro: 1, duration: 1.6, ease: 'power3.out', delay: 0.2 })
        if (!hero) return

        const sync = (self) => {
          api.lift = self.progress
          api.visibility = self.progress >= 1 ? 0 : 1
        }
        ScrollTrigger.create({
          trigger: hero,
          start: 0,
          end: () => window.innerHeight,
          invalidateOnRefresh: true,
          onUpdate: sync,
          onRefresh: sync,
        })
      })

      // re-measure in priority order: section pins first, then these triggers
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
      vault.start()

      cleanup = () => {
        ctx.revert()
        vault.dispose()
        root.classList.remove('vault-live')
        ScrollTrigger.refresh()
      }
    }

    // Wait for the first paint to settle so the three.js download never competes with LCP.
    const idle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 400))
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout
    const handle = idle(boot, { timeout: 1800 })

    return () => {
      cancelled = true
      cancelIdle(handle)
      cleanup?.()
    }
  }, [onHome])

  return <div ref={hostRef} className="at-vault" aria-hidden="true" />
}

export default memo(VaultStage)
