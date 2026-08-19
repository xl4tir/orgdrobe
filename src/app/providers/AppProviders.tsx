import { RouterProvider } from 'react-router-dom'
import { ColorModeProvider } from '@/theme/ColorModeContext'
import { VersionSwitcher } from '@/components/ui/VersionSwitcher'
import { router } from '@/app/router'

/** Composition root — every global provider is wired up here, once. */
export function AppProviders() {
  return (
    <ColorModeProvider>
      <RouterProvider router={router} />
      <VersionSwitcher />
    </ColorModeProvider>
  )
}
