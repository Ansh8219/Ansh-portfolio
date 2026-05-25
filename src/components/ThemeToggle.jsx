import { memo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = memo(() => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative w-14 h-8 glass rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-white/20 dark:border-white/20 light:border-black/20"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-nvs-orange flex items-center justify-center"
        animate={{
          x: theme === 'dark' ? 0 : 24,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <span className="text-black dark:text-white text-sm">
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
      </motion.div>
    </motion.button>
  )
})

ThemeToggle.displayName = 'ThemeToggle'

export default ThemeToggle

