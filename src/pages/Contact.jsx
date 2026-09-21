import { useState, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin, HiOutlineMap } from 'react-icons/hi2'
import BrandedEmail, { MAILTO } from '../components/BrandedEmail'
import { SCROLL_VIEWPORT } from '../components/ScrollReveal'
import HandwriteAccent from '../components/HandwriteAccent'

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

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    // Handle form submission here
    // TODO: Replace with actual form submission API call
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }, [formData])

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
      link: null, // Placeholder - set actual map link when available
    },
  ]

  return (
    <div className="relative z-10 page-hero-pad pb-12 sm:pb-20">
      {/* Hero Section */}
      <section className="section-pad py-12 sm:py-20">
        <div className="site-shell text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HandwriteAccent as="h1" size="title" className="mb-2">
              Get In Touch
            </HandwriteAccent>
            <HandwriteAccent tone="soft" className="mb-6">
              Say Hello → Start Building
            </HandwriteAccent>
            <p className="editorial-body mx-auto max-w-3xl text-base sm:text-xl">
              Let's discuss how we can bring your digital vision to life
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-pad py-10">
        <div className="site-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={SCROLL_VIEWPORT}
              transition={{ duration: 0.8 }}
              className="glass-strong rounded-2xl p-5 sm:p-8 md:p-12"
            >
              <HandwriteAccent as="h2" size="title" align="left" className="mb-2">
                Send Us a Message
              </HandwriteAccent>
              <HandwriteAccent align="left" tone="soft" className="mb-6">
                We're Listening
              </HandwriteAccent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2 text-primary">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input-mobile w-full rounded-lg border border-white/10 px-4 py-3 glass text-primary placeholder-secondary transition-all focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-white/10 light:border-black/10"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-primary">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input-mobile w-full rounded-lg border border-white/10 px-4 py-3 glass text-primary placeholder-secondary transition-all focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-white/10 light:border-black/10"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2 text-primary">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="form-input-mobile w-full resize-none rounded-lg border border-white/10 px-4 py-3 glass text-primary placeholder-secondary transition-all focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-white/10 light:border-black/10"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 rounded-lg font-semibold hover:shadow-2xl transition-all"
                  style={{ 
                    backgroundColor: 'var(--text-accent)',
                    color: 'var(--bg-primary)'
                  }}
                >
                  <span style={{ color: 'var(--bg-primary)' }}>Send Message</span>
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={SCROLL_VIEWPORT}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="glass-strong rounded-2xl p-5 sm:p-8 md:p-12">
                <HandwriteAccent as="h2" size="title" align="left" className="mb-2">
                  Contact Information
                </HandwriteAccent>
                <HandwriteAccent align="left" tone="soft" className="mb-6 sm:mb-8">
                  Find Us Here
                </HandwriteAccent>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    if (!info.link) {
                      return (
                        <motion.div
                          key={info.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={SCROLL_VIEWPORT}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-start space-x-4 glass rounded-xl p-6 opacity-75"
                        >
                          <div>
                            <info.icon className="text-4xl text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-primary mb-1">{info.title}</h3>
                            <p className="text-secondary">{info.content}</p>
                          </div>
                        </motion.div>
                      )
                    }
                    return (
                      <motion.a
                        key={info.title}
                        href={info.link}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={SCROLL_VIEWPORT}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, x: 10 }}
                        className="flex items-start space-x-4 glass rounded-xl p-6 glow-hover"
                      >
                        <div>
                          <info.icon className="text-4xl text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary mb-1">{info.title}</h3>
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
                <div className="glass rounded-xl p-8 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <HiOutlineMap className="text-5xl text-primary" />
                    </div>
                    <p className="text-secondary">Google Maps Embed</p>
                    <p className="text-sm text-secondary mt-2">
                      (Replace with actual Google Maps embed code)
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-pad py-20">
        <div className="site-shell">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={SCROLL_VIEWPORT}
            transition={{ duration: 0.8 }}
            className="glass-strong rounded-2xl p-6 text-center sm:p-10 md:p-12"
          >
            <HandwriteAccent as="h2" size="title" className="mb-2">
              Ready to Start Your Project?
            </HandwriteAccent>
            <HandwriteAccent tone="soft" className="mb-6">
              One Email Away
            </HandwriteAccent>
            <p className="mb-8 text-base text-secondary sm:text-xl">
              Let's collaborate and create something extraordinary together
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a
                href={MAILTO}
                className="inline-block px-8 py-4 rounded-lg font-semibold hover:shadow-2xl transition-all"
                style={{ 
                  backgroundColor: 'var(--text-accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                <span style={{ color: 'var(--bg-primary)' }}>Schedule a Consultation</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
})

Contact.displayName = 'Contact'

export default Contact

