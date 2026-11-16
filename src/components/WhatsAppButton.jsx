import { memo } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { CINEMATIC_EASE, UI_HOVER_SCALE, UI_TAP_SCALE, UI_HOVER_TRANSITION } from '../motion/cinematic'

const WhatsAppButton = memo(() => {
  const whatsappNumber = '918219698580'
  const message = encodeURIComponent('Hello! I would like to know more about your services.')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-fab fixed z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--bg-primary)]/95 text-[#25D366] shadow-lg bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]"
      whileHover={{ scale: UI_HOVER_SCALE, transition: UI_HOVER_TRANSITION }}
      whileTap={{ scale: UI_TAP_SCALE, transition: UI_HOVER_TRANSITION }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.55, ease: CINEMATIC_EASE }}
      aria-label="Message Ansh on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </motion.a>
  )
})

WhatsAppButton.displayName = 'WhatsAppButton'

export default WhatsAppButton
