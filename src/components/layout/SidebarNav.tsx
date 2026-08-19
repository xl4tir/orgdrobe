import { Box, Button, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { Logo } from '@/components/ui/Logo'
import { useUiStore } from '@/app/uiStore'
import { NavList } from './NavList'

export const SIDEBAR_WIDTH = 264

/** Permanent left navigation for desktop (md and up). */
export function SidebarNav() {
  const openAddGarment = useUiStore((s) => s.openAddGarment)
  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        borderRight: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ px: 3, py: 2.5 }}>
        <Logo />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <NavList />
      </Box>

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openAddGarment}
          sx={{ py: 1.2 }}
        >
          Add garment
        </Button>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 2 }}
        >
          Роздягальня · v0.1
        </Typography>
      </Box>
    </Box>
  )
}
