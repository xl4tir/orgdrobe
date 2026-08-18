import type { ReactNode } from 'react'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import ViewTimelineRoundedIcon from '@mui/icons-material/ViewTimelineRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'

export interface NavItem {
  label: string
  to: string
  icon: ReactNode
  /** Show in the mobile bottom bar (space is limited to the essentials). */
  primary?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/app', icon: <GridViewRoundedIcon />, primary: true },
  { label: 'Garments', to: '/app/garments', icon: <CheckroomRoundedIcon />, primary: true },
  { label: 'Outfits', to: '/app/outfits', icon: <AutoAwesomeRoundedIcon />, primary: true },
  { label: 'Feed', to: '/app/feed', icon: <ViewTimelineRoundedIcon />, primary: true },
  { label: 'Calendar', to: '/app/calendar', icon: <CalendarMonthRoundedIcon /> },
  { label: 'Settings', to: '/app/settings', icon: <SettingsRoundedIcon /> },
]

export const PRIMARY_NAV = NAV_ITEMS.filter((i) => i.primary)
