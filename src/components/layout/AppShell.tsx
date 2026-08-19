import { useState } from 'react'
import { Box, Drawer } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SidebarNav } from './SidebarNav'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { NavList } from './NavList'
import { Logo } from '@/components/ui/Logo'
import { AddGarmentDialog } from '@/features/garments/components/AddGarmentDialog'
import { useUiStore } from '@/app/uiStore'
import { pageVariants } from '@/theme/motion'

/** The authenticated app frame: sidebar (desktop), header, bottom nav (mobile). */
export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const addGarmentOpen = useUiStore((s) => s.addGarmentOpen)
  const closeAddGarment = useUiStore((s) => s.closeAddGarment)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <SidebarNav />

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{ paper: { sx: { width: 280 } } }}
        sx={{ display: { md: 'none' } }}
      >
        <Box sx={{ px: 3, py: 2.5 }}>
          <Logo />
        </Box>
        <NavList onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header onOpenMenu={() => setMobileOpen(true)} />

        <Box
          sx={{
            flex: 1,
            pb: { xs: 'calc(var(--bottom-nav-height) + 16px)', md: 0 },
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <Box
              key={location.pathname}
              component={motion.div}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </Box>
          </AnimatePresence>
        </Box>
      </Box>

      <BottomNav />

      {/* App-wide Add garment dialog — opens over any page, no navigation. */}
      <AddGarmentDialog open={addGarmentOpen} onClose={closeAddGarment} />
    </Box>
  )
}
