import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { PRIMARY_NAV } from '@/app/navigation'

/** Fixed bottom bar for mobile — the four primary destinations. */
export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const current = PRIMARY_NAV.findIndex(
    (i) => pathname === i.to || (i.to !== '/app' && pathname.startsWith(i.to)),
  )

  return (
    <Paper
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (t) => t.zIndex.appBar,
        borderTop: (t) => `1px solid ${t.palette.divider}`,
        backdropFilter: 'saturate(180%) blur(14px)',
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? 'rgba(250,248,244,0.96)' : 'rgba(20,17,25,0.96)',
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation
        showLabels
        value={current === -1 ? 0 : current}
        onChange={(_, idx) => navigate(PRIMARY_NAV[idx].to)}
        sx={{
          bgcolor: 'transparent',
          height: 'var(--bottom-nav-height)',
          '& .Mui-selected': { color: 'primary.main' },
        }}
      >
        {PRIMARY_NAV.map((item) => (
          <BottomNavigationAction
            key={item.to}
            label={item.label}
            icon={item.icon}
            sx={{ minWidth: 0 }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}
