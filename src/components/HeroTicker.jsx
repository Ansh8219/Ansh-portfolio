import { memo } from 'react'

const TICKER_ITEMS = [
  'Web Development',
  'Mobile Apps',
  'AI & Automation',
  'Brand Identity',
  'Digital Marketing',
  'UI/UX Design',
  'Cloud Solutions',
  'Custom Software',
  'Social Media',
  'Performance Growth',
]

function HeroTicker() {
  const loopItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="hero-ticker mt-10 w-full lg:mt-12" aria-hidden>
      <div className="hero-ticker-viewport">
        <div className="hero-ticker-track">
          {loopItems.map((item, index) => (
            <span key={`${item}-${index}`} className="hero-ticker-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(HeroTicker)
