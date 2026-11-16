import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { CINEMATIC_EASE, UI_HOVER_SCALE, UI_TAP_SCALE, UI_HOVER_TRANSITION } from '../motion/cinematic'

const WhatsAppButton = memo(() => {
  const whatsappNumber = '918219698580'
  const message = encodeURIComponent('Hi Ansh! I saw your portfolio and would like to talk about a project.')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  // Hidden until the visitor scrolls a little, so it never covers the hero buttons on phones.
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-fab fixed z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--bg-primary)]/95 text-[#25D366] shadow-lg bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]"
      whileHover={{ scale: UI_HOVER_SCALE, transition: UI_HOVER_TRANSITION }}
      whileTap={{ scale: UI_TAP_SCALE, transition: UI_HOVER_TRANSITION }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      style={{ pointerEvents: shown ? 'auto' : 'none' }}
      tabIndex={shown ? 0 : -1}
      transition={{ duration: 0.4, ease: CINEMATIC_EASE }}
      aria-label="Message Ansh on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </motion.a>
  )
})

WhatsAppButton.displayName = 'WhatsAppButton'

export default WhatsAppButton
