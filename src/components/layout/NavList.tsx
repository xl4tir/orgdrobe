import { NavLink } from 'react-router-dom'
import { List, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material'
import { motion } from 'framer-motion'
import { NAV_ITEMS } from '@/app/navigation'

interface NavListProps {
  onNavigate?: () => void
}

/** Shared vertical nav used by the desktop sidebar and the mobile drawer. */
export function NavList({ onNavigate }: NavListProps) {
  return (
    <List sx={{ px: 1.5, py: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/app'}
          onClick={onNavigate}
          style={{ display: 'block' }}
        >
          {({ isActive }) => (
            <ListItemButton
              component={motion.div}
              whileTap={{ scale: 0.97 }}
              selected={isActive}
              sx={{
                position: 'relative',
                py: 1.1,
                px: 1.5,
                color: isActive ? 'primary.main' : 'text.secondary',
                fontWeight: 700,
                '&.Mui-selected, &.Mui-selected:hover': {
                  bgcolor: (t) =>
                    t.palette.mode === 'light' ? 'primary.50' : 'rgba(142,123,255,0.14)',
                },
                '&:hover': { color: 'text.primary' },
              }}
            >
              {isActive && (
                <Box
                  component={motion.span}
                  layoutId="nav-active-pill"
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: 3.5,
                    borderRadius: 4,
                    bgcolor: 'primary.main',
                  }}
                />
              )}
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '0.95rem' } } }}
              />
            </ListItemButton>
          )}
        </NavLink>
      ))}
    </List>
  )
}
