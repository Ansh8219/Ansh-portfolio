import { useEffect, useState } from 'react'

/** Chandigarh local time ("HH:MM"). Empty on the server and on the first render, so no hydration mismatch. */
export function useStudioTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    let format
    try {
      format = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })
    } catch {
      return undefined
    }
    const tick = () => setTime(format.format(new Date()))
    tick()
    const id = window.setInterval(tick, 20000)
    return () => window.clearInterval(id)
  }, [])
  return time
}
