import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiOutlineGlobeAlt, HiOutlineComputerDesktop } from 'react-icons/hi2'
import { FaCode, FaMobileAlt, FaBullhorn, FaPaintBrush, FaCloud } from 'react-icons/fa'
import { SCROLL_VIEWPORT } from '../components/ScrollReveal'

const Services = () => {
  const services = [
    {
      title: 'Website Development',
      icon: HiOutlineGlobeAlt,
      description: 'Custom, responsive websites built with modern technologies. From simple landing pages to complex web applications, we create digital experiences that engage and convert.',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Modern Stack'],
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Mobile Apps',
      icon: FaMobileAlt,
      description: 'Native and cross-platform mobile applications for iOS and Android. We build apps that are intuitive, performant, and deliver exceptional user experiences.',
      features: ['iOS & Android', 'Cross-Platform', 'UI/UX Design', 'App Store Optimization'],
      gradient: 'from-orange-400 to-amber-600',
    },
    {
      title: 'Marketing & Branding',
      icon: FaBullhorn,
      description: 'Complete branding solutions that tell your story. From logo design to comprehensive brand guidelines, we help you stand out in the digital landscape.',
      features: ['Brand Identity', 'Logo Design', 'Marketing Strategy', 'Content Creation'],
      gradient: 'from-orange-600 to-black',
    },
    {
      title: 'Social Media Management',
      icon: FaMobileAlt,
      description: 'Strategic social media management that grows your audience and engagement. We create compelling content and manage your presence across all platforms.',
      features: ['Content Strategy', 'Community Management', 'Analytics & Reporting', 'Campaign Management'],
      gradient: 'from-red-500 to-orange-500',
    },
    {
      title: 'UI/UX Design',
      icon: FaPaintBrush,
      description: 'User-centered design that combines aesthetics with functionality. We create interfaces that are beautiful, intuitive, and drive user engagement.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'IT & Cloud Solutions',
      icon: FaCloud,
      description: 'Scalable IT infrastructure and cloud solutions for businesses of all sizes. From cloud migration to DevOps, we ensure your technology scales with you.',
      features: ['Cloud Migration', 'DevOps', 'Infrastructure Setup', 'Security & Compliance'],
      gradient: 'from-orange-500 via-black to-orange-500',
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
            <h1 className="section-heading mb-6 gradient-text neon-glow">
              Our Services
            </h1>
            <p className="editorial-body mx-auto max-w-3xl text-base sm:text-xl">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-pad py-8 sm:py-10">
        <div className="site-shell">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={SCROLL_VIEWPORT}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass glow-hover group relative flex h-full flex-col overflow-hidden rounded-xl p-5 transition-all duration-300 hover:bg-black sm:p-8"
              >
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-4">
                    <service.icon className="text-6xl text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-primary transition-colors duration-300 group-hover:text-white sm:mb-4 sm:text-2xl">{service.title}</h3>
                  <p className="text-secondary mb-6 flex-grow group-hover:text-white transition-colors duration-300">{service.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-primary mb-2 group-hover:text-white transition-colors duration-300">Key Features:</p>
                    <ul className="space-y-1">
                      {service.features.map((feature) => (
                        <li key={feature} className="text-sm text-secondary flex items-center group-hover:text-white transition-colors duration-300">
                          <span className="text-primary mr-2 group-hover:text-white transition-colors duration-300">▸</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
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
            <h2 className="mb-6 text-2xl font-bold gradient-text sm:text-4xl md:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-base text-secondary sm:text-xl">
              Let's discuss how we can transform your digital presence
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/contact"
                className="inline-block px-8 py-4 rounded-lg font-semibold hover:shadow-2xl transition-all"
                style={{ 
                  backgroundColor: 'var(--text-accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                <span style={{ color: 'var(--bg-primary)' }}>Contact Us</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services

