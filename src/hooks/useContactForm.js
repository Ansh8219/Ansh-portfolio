import { useCallback, useState } from 'react'
import { MAILTO } from '../components/BrandedEmail'

// Set VITE_CONTACT_ENDPOINT to a JSON-accepting form endpoint to enable in-page submission.
// Without it the form never claims success: it composes an email in the visitor's mail app.
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT

const EMPTY = { name: '', company: '', email: '', message: '', service: '', purpose: '', timing: '' }

/**
 * Contact form state.
 * status: 'idle' | 'submitting' | 'success' | 'error' | 'mailto'
 */
export function useContactForm() {
  const [formData, setFormData] = useState(EMPTY)
  const [formStatus, setFormStatus] = useState('idle')

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormStatus((status) => (status === 'submitting' ? status : 'idle'))
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      if (!CONTACT_ENDPOINT) {
        const subject = `Project enquiry from ${formData.name}`
        const brief = [
          formData.service ? `Looking for: ${formData.service}` : '',
          formData.purpose ? `For: ${formData.purpose}` : '',
          formData.timing ? `Timing: ${formData.timing}` : '',
        ]
          .filter(Boolean)
          .join('\n')
        const who = formData.company ? `${formData.name}, ${formData.company}` : formData.name
        const body = `${brief ? `${brief}\n\n` : ''}${formData.message}\n\n${who} (${formData.email})`
        window.location.href = `${MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        setFormStatus('mailto')
        return
      }

      setFormStatus('submitting')
      try {
        const response = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(formData),
        })
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        setFormStatus('success')
        setFormData(EMPTY)
      } catch {
        setFormStatus('error')
      }
    },
    [formData],
  )

  return { formData, formStatus, handleChange, handleSubmit }
}
