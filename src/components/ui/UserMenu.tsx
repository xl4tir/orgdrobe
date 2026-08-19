import { useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import { useAuthStore } from '@/features/auth/store'
import { initials } from '@/lib/format'

export function UserMenu() {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const open = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)
  const close = () => setAnchor(null)

  const name = user?.name ?? 'Guest'

  return (
    <>
      <IconButton onClick={open} sx={{ p: 0.5 }} aria-label="Account menu">
        <Avatar
          sx={{
            width: 36,
            height: 36,
            fontSize: '0.85rem',
            fontWeight: 700,
            bgcolor: 'primary.main',
          }}
        >
          {initials(name)}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        slotProps={{ paper: { sx: { minWidth: 220 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2">{name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email ?? 'not signed in'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { close(); navigate('/app/settings') }}>
          <ListItemIcon><PersonRoundedIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { close(); navigate('/app/settings') }}>
          <ListItemIcon><SettingsRoundedIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => { close(); logout(); navigate('/') }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon><LogoutRoundedIcon fontSize="small" color="error" /></ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </>
  )
}
