import { useCallback, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ToggleTheme({ className = '', duration = 400, ...props }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const buttonRef = useRef(null)

  const handleToggle = useCallback(async () => {
    if (!buttonRef.current) return

    if (!document.startViewTransition) {
      toggleTheme()
      return
    }

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    )

    await document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme()
      })
    }).ready

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  }, [toggleTheme, duration])

  return (
    <button
      {...props}
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      className={`interactive-tap flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] text-[var(--text-primary)] transition-[color,border-color,transform] duration-200 hover:border-[var(--text-accent)] hover:text-[var(--text-accent)] active:scale-95 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  )
}
