import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { RequireAuth } from '@/components/layout/RequireAuth'

import { LandingPage } from '@/features/landing/pages/LandingPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { GarmentsPage } from '@/features/garments/pages/GarmentsPage'
import { GarmentDetailPage } from '@/features/garments/pages/GarmentDetailPage'
import { OutfitsPage } from '@/features/outfits/pages/OutfitsPage'
import { OutfitEditorPage } from '@/features/outfits/pages/OutfitEditorPage'
import { FeedPage } from '@/features/feed/pages/FeedPage'
import { CalendarPage } from '@/features/calendar/pages/CalendarPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { NotFoundPage } from '@/features/misc/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/app',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'garments', element: <GarmentsPage /> },
      { path: 'garments/:id', element: <GarmentDetailPage /> },
      { path: 'outfits', element: <OutfitsPage /> },
      { path: 'outfits/:id', element: <OutfitEditorPage /> },
      { path: 'feed', element: <FeedPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
