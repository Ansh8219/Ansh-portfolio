import { motion } from "framer-motion"
import { FaBrain, FaRocket, FaCode, FaChartLine, FaBullseye } from "react-icons/fa"
import { SCROLL_VIEWPORT } from '../components/ScrollReveal'

const About = () => {
  const services = [
    {
      icon: FaBrain,
      title: "AI-Driven Marketing",
      desc: "Data-backed strategies designed to attract, convert, and scale.",
    },
    {
      icon: FaCode,
      title: "Web & App Development",
      desc: "High-performance websites and applications built to scale.",
    },
    {
      icon: FaRocket,
      title: "Custom Software",
      desc: "Tailored systems that automate and optimize business workflows.",
    },
    {
      icon: FaChartLine,
      title: "Growth Strategy",
      desc: "Clear roadmaps focused on performance and long-term growth.",
    },
  ]

  const process = [
    "Understand the Vision",
    "Define the Strategy",
    "Design & Build",
    "Launch with Precision",
    "Scale with Intelligence",
  ]

  return (
    <div className="relative z-10 page-hero-pad pb-16 sm:pb-24 md:pb-32">

      {/* HERO */}
      <section className="section-pad mb-16 text-center sm:mb-24 md:mb-32">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-[clamp(2rem,7vw,4.5rem)] font-bold leading-tight"
        >
          Building Digital Systems<br />
          <span className="gradient-text">That Grow Brands</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="editorial-body mx-auto max-w-3xl text-base sm:text-lg"
        >
          NorthVaultStudios is an AI-driven digital studio delivering marketing,
          web, apps, and custom software — all under one roof.
        </motion.p>
      </section>

      {/* WHO WE ARE */}
      <section className="section-pad mb-16 sm:mb-24 md:mb-32">
        <div className="site-shell grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={SCROLL_VIEWPORT}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-heading mb-6">Who We Are</h2>
            <p className="editorial-body text-base leading-relaxed sm:text-lg">
              NorthVaultStudios was built on a simple belief — technology should
              feel intelligent, intuitive, and purposeful.
              <br /><br />
              We help startups and growing brands turn ideas into scalable
              digital systems that perform, adapt, and grow with the business.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={SCROLL_VIEWPORT}
            transition={{ duration: 0.8 }}
            className="h-56 rounded-3xl bg-gradient-to-br from-black via-gray-900 to-gray-800 sm:h-72"
          />
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section-pad mb-16 sm:mb-24 md:mb-32">
        <h2 className="section-heading mb-10 text-center sm:mb-16">What We Do</h2>

        <div className="site-shell grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {services.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={SCROLL_VIEWPORT}
              transition={{ delay: index * 0.1 }}
              className="group rounded-2xl border border-gray-200 p-5 transition-all duration-300 hover:bg-black hover:text-white sm:p-8"
            >
              <item.icon className="text-3xl mb-4 text-orange-500 group-hover:text-white" />
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-300">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="section-pad mb-16 sm:mb-24 md:mb-32">
        <h2 className="section-heading mb-10 text-center sm:mb-16">How We Work</h2>

        <div className="site-shell space-y-6">
          {process.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={SCROLL_VIEWPORT}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 sm:items-center sm:gap-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black font-bold text-white">
                {index + 1}
              </div>
              <p className="text-base text-gray-700 sm:text-lg">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROMISE */}
      <section className="section-pad pb-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={SCROLL_VIEWPORT}
          transition={{ duration: 0.8 }}
          className="site-shell rounded-3xl bg-black p-8 text-center text-white sm:p-12 md:p-16"
        >
          <FaBullseye className="mx-auto mb-6 text-4xl text-orange-500" />
          <h2 className="section-heading mb-6">
            Our Promise
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We don’t chase trends. We build systems that last.
            <br />
            Your success isn’t a milestone — it’s our responsibility.
          </p>
        </motion.div>
      </section>

    </div>
  )
}

export default About
