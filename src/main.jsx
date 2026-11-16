import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

import LenisProvider from './components/LenisProvider.jsx'
import 'lenis/dist/lenis.css'
import './index.css'
import './styles/signal.css'
import './styles/atlas.css'
import './styles/work.css'
import './styles/services.css'

const container = document.getElementById('root')

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <LenisProvider>
        <App />
      </LenisProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// Production pages are prerendered (see scripts/prerender.mjs): hydrate the existing markup.
// In `vite dev` the root only holds a placeholder comment, so render from scratch.
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, app)
} else {
  ReactDOM.createRoot(container).render(app)
}
