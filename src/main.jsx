import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LenisProvider from './components/LenisProvider.jsx'
import 'lenis/dist/lenis.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LenisProvider>
      <App />
    </LenisProvider>
  </React.StrictMode>,
)
