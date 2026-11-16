import { useEffect, useState } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { ScrollTrigger } from '../motion/signal'
import { DISCIPLINES } from '../content/site'

const pad = (n) => String(n).padStart(2, '0')

/** One compact row. The detail panel stays in the DOM (readable without JS) and opens on demand. */
function Row({ item, index, open, onToggle }) {
  const panelId = `work-panel-${item.key}`
  const hue = DISCIPLINES[item.lead]?.cls ?? ''
  return (
    <li id={item.key} className={`wk-row ${hue} ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="wk-row__head"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="wk-row__n">{pad(index + 1)}</span>
        <span className="wk-row__main">
          <span className="wk-row__title">{item.title}</span>
          <span className="wk-row__cat">{item.category}</span>
        </span>
        <span className={`wk-badge wk-badge--${item.status.tone}`}>{item.status.label}</span>
        <span className="wk-row__cta">
          <span>{open ? 'Close' : 'View details'}</span>
          <Plus aria-hidden="true" size={18} className="wk-row__plus" />
        </span>
      </button>
      <p className="wk-row__summary">{item.summary}</p>

      <div id={panelId} className="wk-panel" role="region" aria-label={`${item.title} details`}>
        <div className="wk-panel__clip">
          <div className="wk-panel__body">
            <p className="wk-panel__about">{item.about}</p>

            {item.parts.length > 0 && (
              <div className="wk-col">
                <h3 className="wk-col__h">What we built</h3>
                <ul className="wk-parts">
                  {item.parts.map((part) => (
                    <li key={part.name}>
                      <b>{part.name}</b>
                      <span>{part.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="wk-col">
              {item.roles.length > 0 && (
                <>
                  <h3 className="wk-col__h">Roles</h3>
                  <ul className="wk-chips">
                    {item.roles.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </>
              )}
              {item.backend.length > 0 && (
                <>
                  <h3 className="wk-col__h">Backend</h3>
                  <ul className="wk-plain">
                    {item.backend.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </>
              )}
              {item.stack.length > 0 && (
                <>
                  <h3 className="wk-col__h">Stack</h3>
                  <ul className="wk-chips wk-chips--mono">
                    {item.stack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {item.links.length > 0 && (
              <ul className="wk-links">
                {item.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="at-arrow-link">
                      {l.label}
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

/** The animated project list used on the home page and on /work. Rows open in place; one at a time. */
export default function WorkRows({ items, defaultOpen = null }) {
  const [openKey, setOpenKey] = useState(defaultOpen)

  // Opening a row changes the page height: re-measure every scroll trigger below it once the panel has settled.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 650)
    return () => window.clearTimeout(id)
  }, [openKey])

  return (
    <ol className="wk-rows" data-fx="stagger">
      {items.map((item, index) => (
        <Row key={item.key} item={item} index={index} open={openKey === item.key} onToggle={() => setOpenKey((k) => (k === item.key ? null : item.key))} />
      ))}
    </ol>
  )
}
