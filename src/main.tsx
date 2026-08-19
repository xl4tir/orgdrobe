import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Material design uses Roboto; the Editorial design uses Fraunces + Manrope.
// Both are bundled so switching between designs needs no network.
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource-variable/manrope'
import '@fontsource-variable/fraunces'

import './styles/global.css'
import { AppProviders } from './app/providers/AppProviders'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
