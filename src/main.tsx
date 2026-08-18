import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Bundled variable fonts — no network needed, no layout shift.
import '@fontsource-variable/manrope'
import '@fontsource-variable/fraunces'

import './styles/global.css'
import { AppProviders } from './app/providers/AppProviders'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
