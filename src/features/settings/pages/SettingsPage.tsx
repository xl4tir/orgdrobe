import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid2 as Grid,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useAuthStore } from '@/features/auth/store'
import { useColorMode } from '@/theme/ColorModeContext'
import { initials } from '@/lib/format'

function SettingsCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card sx={{ p: { xs: 2.5, sm: 3 } }}>
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
          {description}
        </Typography>
      )}
      <Box sx={{ mt: description ? 0 : 2.5 }}>{children}</Box>
    </Card>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const logout = useAuthStore((s) => s.logout)
  const { mode, setMode } = useColorMode()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [snack, setSnack] = useState<string | null>(null)

  const save = () => {
    updateUser({ name, email })
    setSnack('Settings saved')
  }

  return (
    <PageContainer maxWidth="md">
      <SectionHeader overline="Account" title="Settings" subtitle="Manage your profile, security and how Роздягальня looks." />

      <Stack spacing={3}>
        <SettingsCard title="Profile" description="This is how you appear across Роздягальня.">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{ width: 76, height: 76, fontSize: '1.6rem', fontWeight: 700, background: (t) => t.custom.gradients.brand }}
              >
                {initials(name || 'U')}
              </Avatar>
              <Stack spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  startIcon={<PhotoCameraRoundedIcon />}
                  onClick={() => setSnack('Avatar upload is coming soon')}
                >
                  Change
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={() => setSnack('Avatar removed')}
                >
                  Remove
                </Button>
              </Stack>
            </Stack>
            <Stack spacing={2} sx={{ flex: 1 }}>
              <TextField label="Display name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            </Stack>
          </Stack>
        </SettingsCard>

        <SettingsCard title="Security" description="Update your password. Leave blank to keep the current one.">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="New password" type="password" fullWidth autoComplete="new-password" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Repeat password" type="password" fullWidth autoComplete="new-password" />
            </Grid>
          </Grid>
        </SettingsCard>

        <SettingsCard title="Appearance" description="Choose how Роздягальня looks on this device.">
          <ToggleButtonGroup exclusive value={mode} onChange={(_, v) => v && setMode(v)}>
            <ToggleButton value="light" sx={{ px: 3, gap: 1 }}>
              <LightModeRoundedIcon fontSize="small" /> Light
            </ToggleButton>
            <ToggleButton value="dark" sx={{ px: 3, gap: 1 }}>
              <DarkModeRoundedIcon fontSize="small" /> Dark
            </ToggleButton>
          </ToggleButtonGroup>
        </SettingsCard>

        <SettingsCard title="Account">
          <Button
            color="error"
            variant="outlined"
            startIcon={<LogoutRoundedIcon />}
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Log out
          </Button>
        </SettingsCard>

        <Divider />

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button color="inherit" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={save}>
            Save changes
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2400}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </PageContainer>
  )
}
