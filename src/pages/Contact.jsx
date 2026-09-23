import { useState, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin, HiOutlineMap } from 'react-icons/hi2'
import BrandedEmail, { MAILTO } from '../components/BrandedEmail'
import HandwriteAccent from '../components/HandwriteAccent'
import GsapReveal from '../components/GsapReveal'

const Contact = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      // Handle form submission here
      // TODO: Replace with actual form submission API call
      alert('Thank you for your message! We will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
    },
    [formData],
  )

  const contactInfo = [
    {
      icon: HiOutlineEnvelope,
      title: 'Email',
      content: <BrandedEmail />,
      link: MAILTO,
    },
    {
      icon: HiOutlinePhone,
      title: 'Phone',
      content: '+91 8219268903',
      link: 'tel:+918219268903',
    },
    {
      icon: HiOutlineMapPin,
      title: 'Location',
      content: 'Chandigarh, India',
      link: null,
    },
  ]

  return (
    <div className="relative z-10 page-hero-pad pb-12 sm:pb-20">
      {/* Hero Section */}
      <section className="section-pad py-12 sm:py-20">
        <GsapReveal className="site-shell text-center" stagger={0.1} y={28} start="top 90%">
          <HandwriteAccent as="h1" size="title" className="mb-2" masked>
            Get In Touch
          </HandwriteAccent>
          <HandwriteAccent tone="soft" className="mb-6" masked>
            Say Hello → Start Building
          </HandwriteAccent>
          <p className="editorial-body mx-auto max-w-3xl text-base sm:text-xl" data-reveal>
            Let's discuss how we can bring your digital vision to life
          </p>
        </GsapReveal>
      </section>

      {/* Contact Section */}
      <section className="section-pad py-10">
        <div className="site-shell">
          <GsapReveal className="grid grid-cols-1 gap-12 lg:grid-cols-2" stagger={0.14} y={32}>
            {/* Contact Form */}
            <div className="glass-strong rounded-2xl p-5 sm:p-8 md:p-12" data-reveal>
              <HandwriteAccent as="h2" size="title" align="left" className="mb-2">
                Send Us a Message
              </HandwriteAccent>
              <HandwriteAccent align="left" tone="soft" className="mb-6">
                We're Listening
              </HandwriteAccent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-primary">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input-mobile glass light:border-black/10 w-full rounded-lg border border-white/10 px-4 py-3 text-primary placeholder-secondary transition-all focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-white/10"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-primary">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input-mobile glass light:border-black/10 w-full rounded-lg border border-white/10 px-4 py-3 text-primary placeholder-secondary transition-all focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-white/10"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-semibold text-primary">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="form-input-mobile glass light:border-black/10 w-full resize-none rounded-lg border border-white/10 px-4 py-3 text-primary placeholder-secondary transition-all focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-white/10"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-lg px-8 py-4 font-semibold transition-all hover:shadow-2xl"
                  style={{
                    backgroundColor: 'var(--text-accent)',
                    color: 'var(--bg-primary)',
                  }}
                >
                  <span style={{ color: 'var(--bg-primary)' }}>Send Message</span>
                </motion.button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6" data-reveal>
              <div className="glass-strong rounded-2xl p-5 sm:p-8 md:p-12">
                <HandwriteAccent as="h2" size="title" align="left" className="mb-2">
                  Contact Information
                </HandwriteAccent>
                <HandwriteAccent align="left" tone="soft" className="mb-6 sm:mb-8">
                  Find Us Here
                </HandwriteAccent>
                <div className="space-y-6">
                  {contactInfo.map((info) => {
                    if (!info.link) {
                      return (
                        <div
                          key={info.title}
                          className="glass flex items-start space-x-4 rounded-xl p-6 opacity-75"
                        >
                          <div>
                            <info.icon className="text-4xl text-primary" />
                          </div>
                          <div>
                            <h3 className="mb-1 text-lg font-semibold text-primary">{info.title}</h3>
                            <p className="text-secondary">{info.content}</p>
                          </div>
                        </div>
                      )
                    }
                    return (
                      <motion.a
                        key={info.title}
                        href={info.link}
                        whileHover={{ scale: 1.05, x: 10 }}
                        className="glass glow-hover flex items-start space-x-4 rounded-xl p-6"
                      >
                        <div>
                          <info.icon className="text-4xl text-primary" />
                        </div>
                        <div>
                          <h3 className="mb-1 text-lg font-semibold text-primary">{info.title}</h3>
                          <p className="text-secondary">{info.content}</p>
                        </div>
                      </motion.a>
                    )
                  })}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="glass-strong rounded-2xl p-5 sm:p-8 md:p-12">
                <h3 className="mb-4 text-xl font-bold gradient-text sm:text-2xl">Find Us</h3>
                <div className="glass flex h-64 items-center justify-center rounded-xl p-8">
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <HiOutlineMap className="text-5xl text-primary" />
                    </div>
                    <p className="text-secondary">Google Maps Embed</p>
                    <p className="mt-2 text-sm text-secondary">
                      (Replace with actual Google Maps embed code)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GsapReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-pad py-20">
        <div className="site-shell">
          <GsapReveal y={32} stagger={0.1}>
            <div className="glass-strong rounded-2xl p-6 text-center sm:p-10 md:p-12">
              <HandwriteAccent as="h2" size="title" className="mb-2" masked>
                Ready to Start Your Project?
              </HandwriteAccent>
              <HandwriteAccent tone="soft" className="mb-6" masked>
                One Email Away
              </HandwriteAccent>
              <p className="mb-8 text-base text-secondary sm:text-xl" data-reveal>
                Let's collaborate and create something extraordinary together
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
                data-reveal
              >
                <a
                  href={MAILTO}
                  className="inline-block rounded-lg px-8 py-4 font-semibold transition-all hover:shadow-2xl"
                  style={{
                    backgroundColor: 'var(--text-accent)',
                    color: 'var(--bg-primary)',
                  }}
                >
                  <span style={{ color: 'var(--bg-primary)' }}>Schedule a Consultation</span>
                </a>
              </motion.div>
            </div>
          </GsapReveal>
        </div>
      </section>
    </div>
  )
})

Contact.displayName = 'Contact'

export default Contact
