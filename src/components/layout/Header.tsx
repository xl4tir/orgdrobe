import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { UserMenu } from '@/components/ui/UserMenu'
import { NAV_ITEMS } from '@/app/navigation'

function usePageTitle(): string {
  const { pathname } = useLocation()
  const match = [...NAV_ITEMS]
    .sort((a, b) => b.to.length - a.to.length)
    .find((i) => pathname === i.to || pathname.startsWith(i.to + '/'))
  return match?.label ?? 'OrgDrobe'
}

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const title = usePageTitle()
  const navigate = useNavigate()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: 'saturate(180%) blur(14px)',
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? 'rgba(250,248,244,0.94)' : 'rgba(20,17,25,0.94)',
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
        width: '100%',
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: 'var(--header-height) !important' }}>
        <IconButton
          edge="start"
          onClick={onOpenMenu}
          sx={{ display: { md: 'none' } }}
          aria-label="Open navigation"
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <Logo showWordmark={false} size={32} />
        </Box>

        <Typography
          variant="h5"
          component="h1"
          sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 700 }}
        >
          {title}
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Search">
          <IconButton onClick={() => navigate('/app/garments')} aria-label="Search">
            <SearchRoundedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Activity">
          <IconButton onClick={() => navigate('/app/feed')} aria-label="Activity">
            <NotificationsNoneRoundedIcon />
          </IconButton>
        </Tooltip>
        <ThemeToggle />
        <UserMenu />
      </Toolbar>
    </AppBar>
  )
}
