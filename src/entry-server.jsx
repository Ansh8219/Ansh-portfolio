import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'
import LenisProvider from './components/LenisProvider.jsx'

/**
 * Server entry used ONLY at build time by scripts/prerender.mjs.
 * Mirrors the provider tree in main.jsx so the markup matches what the client hydrates.
 * @param {string} url pathname to render, e.g. "/about"
 * @returns {string} HTML for the #root container
 */
export function render(url) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <LenisProvider>
          <App />
        </LenisProvider>
      </StaticRouter>
    </React.StrictMode>,
  )
}
