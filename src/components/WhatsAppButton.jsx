import { memo } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

const WhatsAppButton = memo(() => {
  const whatsappNumber = '15551234567'
  const message = encodeURIComponent('Hello! I would like to know more about your services.')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--bg-primary)]/90 text-[#25D366] shadow-lg backdrop-blur-md bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </motion.a>
  )
})

WhatsAppButton.displayName = 'WhatsAppButton'

export default WhatsAppButton
