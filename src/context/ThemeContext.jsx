import { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback } from 'react'

// useLayoutEffect warns when rendered on the server (prerender); it is a no-op there anyway.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Always start from 'dark' so the first client render matches the prerendered HTML
  // (hydration safety); the saved preference is applied before the first paint.
  const [theme, setTheme] = useState('dark')

  useIsomorphicLayoutEffect(() => {
    try {
      const savedTheme = localStorage.getItem('nvs-theme')
      if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme)
    } catch {
      /* storage unavailable — keep default */
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#EFEBE2' : '#0A0B10')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const next = prevTheme === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('nvs-theme', next)
      } catch {
        /* storage unavailable — theme still switches for this session */
      }
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
