import { FaBrain, FaRocket, FaCode, FaChartLine, FaBullseye } from 'react-icons/fa'
import HandwriteAccent from '../components/HandwriteAccent'
import GsapReveal from '../components/GsapReveal'

const About = () => {
  const services = [
    {
      icon: FaBrain,
      title: 'AI-Driven Marketing',
      desc: 'Data-backed strategies designed to attract, convert, and scale.',
    },
    {
      icon: FaCode,
      title: 'Web & App Development',
      desc: 'High-performance websites and applications built to scale.',
    },
    {
      icon: FaRocket,
      title: 'Custom Software',
      desc: 'Tailored systems that automate and optimize business workflows.',
    },
    {
      icon: FaChartLine,
      title: 'Growth Strategy',
      desc: 'Clear roadmaps focused on performance and long-term growth.',
    },
  ]

  const process = [
    'Understand the Vision',
    'Define the Strategy',
    'Design & Build',
    'Launch with Precision',
    'Scale with Intelligence',
  ]

  return (
    <div className="relative z-10 page-hero-pad pb-16 sm:pb-24 md:pb-32">
      {/* HERO */}
      <section className="section-pad mb-16 text-center sm:mb-24 md:mb-32">
        <GsapReveal className="mx-auto max-w-3xl" stagger={0.12} y={28} start="top 90%">
          <div className="mb-6">
            <HandwriteAccent as="h1" size="title" className="mb-2" masked>
              About the Studio
            </HandwriteAccent>
            <HandwriteAccent tone="soft" masked>
              Digital Systems That Grow Brands
            </HandwriteAccent>
          </div>
          <p className="editorial-body mx-auto max-w-3xl text-base sm:text-lg" data-reveal>
            NorthVaultStudios is an AI-driven digital studio delivering marketing, web, apps, and
            custom software — all under one roof.
          </p>
        </GsapReveal>
      </section>

      {/* WHO WE ARE */}
      <section className="section-pad mb-16 sm:mb-24 md:mb-32">
        <GsapReveal
          className="site-shell grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
          stagger={0.14}
          y={32}
        >
          <div>
            <HandwriteAccent as="h2" size="title" align="left" className="mb-2" masked>
              Who We Are
            </HandwriteAccent>
            <HandwriteAccent align="left" tone="soft" className="mb-6" masked>
              Built to Grow Brands
            </HandwriteAccent>
            <p className="editorial-body text-base leading-relaxed sm:text-lg" data-reveal>
              NorthVaultStudios was built on a simple belief — technology should feel intelligent,
              intuitive, and purposeful.
              <br />
              <br />
              We help startups and growing brands turn ideas into scalable digital systems that
              perform, adapt, and grow with the business.
            </p>
          </div>

          <div
            className="h-56 rounded-3xl bg-gradient-to-br from-black via-gray-900 to-gray-800 sm:h-72"
            data-reveal
          />
        </GsapReveal>
      </section>

      {/* WHAT WE DO */}
      <section className="section-pad mb-16 sm:mb-24 md:mb-32">
        <GsapReveal className="mb-10 text-center sm:mb-16" y={24}>
          <HandwriteAccent as="h2" size="title" masked>
            What We Do
          </HandwriteAccent>
          <HandwriteAccent tone="soft" className="mt-2" masked>
            Ideas → Systems → Scale
          </HandwriteAccent>
        </GsapReveal>

        <GsapReveal
          className="site-shell grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
          stagger={0.08}
          y={30}
        >
          {services.map((item) => (
            <div
              key={item.title}
              data-reveal
              className="group rounded-2xl border border-gray-200 p-5 transition-all duration-300 hover:bg-black hover:text-white sm:p-8"
            >
              <item.icon className="mb-4 text-3xl text-orange-500 group-hover:text-white" />
              <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </GsapReveal>
      </section>

      {/* HOW WE WORK */}
      <section className="section-pad mb-16 sm:mb-24 md:mb-32">
        <GsapReveal className="mb-10 text-center sm:mb-16" y={24}>
          <HandwriteAccent as="h2" size="title" masked>
            How We Work
          </HandwriteAccent>
          <HandwriteAccent tone="soft" className="mt-2" masked>
            Clear Steps → Sharp Delivery
          </HandwriteAccent>
        </GsapReveal>

        <GsapReveal className="site-shell space-y-6" stagger={0.08} y={22}>
          {process.map((step, index) => (
            <div
              key={step}
              data-reveal
              className="flex items-start gap-4 sm:items-center sm:gap-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black font-bold text-white">
                {index + 1}
              </div>
              <p className="text-base text-gray-700 sm:text-lg">{step}</p>
            </div>
          ))}
        </GsapReveal>
      </section>

      {/* PROMISE */}
      <section className="section-pad pb-8">
        <GsapReveal y={32} stagger={0.1}>
          <div className="site-shell rounded-3xl bg-black p-8 text-center text-white sm:p-12 md:p-16">
            <FaBullseye className="mx-auto mb-6 text-4xl text-orange-500" data-reveal />
            <HandwriteAccent as="h2" size="title" className="mb-2" masked>
              Our Promise
            </HandwriteAccent>
            <HandwriteAccent tone="soft" className="mb-6" masked>
              Systems That Last
            </HandwriteAccent>
            <p className="mx-auto max-w-3xl text-lg text-gray-300" data-reveal>
              We don’t chase trends. We build systems that last.
              <br />
              Your success isn’t a milestone — it’s our responsibility.
            </p>
          </div>
        </GsapReveal>
      </section>
    </div>
  )
}

export default About
