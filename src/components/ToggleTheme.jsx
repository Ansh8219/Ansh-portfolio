import { useCallback, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const VIEW_TRANSITION_RESET = `
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }
`

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
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] text-[var(--text-primary)] transition-colors hover:border-[var(--text-accent)] hover:text-[var(--text-accent)] ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        {...props}
      >
        {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
      </button>
      <style dangerouslySetInnerHTML={{ __html: VIEW_TRANSITION_RESET }} />
    </>
  )
}
