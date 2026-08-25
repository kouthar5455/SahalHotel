import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// App entry point: mounts the root <App /> component into the #root DOM node.
// StrictMode enables extra dev-only checks (e.g. double-invoking effects) to surface side-effect bugs.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
