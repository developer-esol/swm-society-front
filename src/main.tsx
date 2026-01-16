import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startTokenRefreshInterval } from './utils/tokenRefreshInterval'

// Start periodic token refresh when app loads
startTokenRefreshInterval();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
