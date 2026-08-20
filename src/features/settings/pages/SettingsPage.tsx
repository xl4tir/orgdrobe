import { useRef, useState } from 'react'
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
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useAuthStore } from '@/features/auth/store'
import { useColorMode } from '@/theme/ColorModeContext'
import { useWeatherStore } from '@/features/dashboard/weatherStore'
import { LocationPicker } from '@/features/dashboard/components/LocationPicker'
import { initials } from '@/lib/format'

/**
 * Read an image file and return a small, square-ish JPEG data URL. Downscaling
 * keeps the avatar well under the localStorage quota (a raw phone photo can be
 * several MB) while staying crisp at the sizes we render it.
 */
function fileToAvatarDataUrl(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not load image'))
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas unavailable'))
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

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
  const { mode, setMode, design, setDesign } = useColorMode()
  const location = useWeatherStore((s) => s.location)

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [snack, setSnack] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatar = user?.avatar

  const save = () => {
    updateUser({ name, email })
    setSnack('Settings saved')
  }

  const onPickPhoto = () => fileInputRef.current?.click()

  const onPhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setSnack('Please choose an image file')
      return
    }
    try {
      const dataUrl = await fileToAvatarDataUrl(file)
      updateUser({ avatar: dataUrl })
      setSnack('Profile photo updated')
    } catch {
      setSnack('Sorry — that image could not be processed')
    }
  }

  const removePhoto = () => {
    updateUser({ avatar: undefined })
    setSnack('Profile photo removed')
  }

  const updatePassword = () => {
    if (!newPassword || !repeatPassword) {
      setSnack('Enter a new password twice')
      return
    }
    if (newPassword !== repeatPassword) {
      setSnack("Passwords don't match")
      return
    }
    setNewPassword('')
    setRepeatPassword('')
    setSnack('Password updated')
  }

  return (
    <PageContainer maxWidth="md">
      <SectionHeader overline="Account" title="Settings" subtitle="Manage your profile, security and how Роздягальня looks." />

      <Stack spacing={3}>
        <SettingsCard title="Profile" description="This is how you appear across Роздягальня.">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={avatar}
                sx={{ width: 76, height: 76, fontSize: '1.6rem', fontWeight: 700, bgcolor: 'primary.main' }}
              >
                {initials(name || 'U')}
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onPhotoSelected}
              />
              <Stack spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  startIcon={<PhotoCameraRoundedIcon />}
                  onClick={onPickPhoto}
                >
                  {avatar ? 'Change' : 'Upload'}
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={removePhoto}
                  disabled={!avatar}
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

        <SettingsCard title="Location" description="Sets the city used for your weather forecast.">
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
              <PlaceRoundedIcon fontSize="small" color="primary" />
              <Typography variant="body1" color="text.primary">
                {location.name}
                {location.country ? (
                  <Typography component="span" variant="body2" color="text.secondary">
                    {' · '}
                    {location.country}
                  </Typography>
                ) : null}
              </Typography>
            </Stack>
            <LocationPicker onSelect={() => setSnack('Location updated')} />
          </Stack>
        </SettingsCard>

        <SettingsCard title="Appearance" description="Choose how Роздягальня looks on this device.">
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Theme
              </Typography>
              <ToggleButtonGroup exclusive value={mode} onChange={(_, v) => v && setMode(v)}>
                <ToggleButton value="light" sx={{ px: 3, gap: 1 }}>
                  <LightModeRoundedIcon fontSize="small" /> Light
                </ToggleButton>
                <ToggleButton value="dark" sx={{ px: 3, gap: 1 }}>
                  <DarkModeRoundedIcon fontSize="small" /> Dark
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Design
              </Typography>
              <ToggleButtonGroup exclusive value={design} onChange={(_, v) => v && setDesign(v)}>
                <ToggleButton value="material" sx={{ px: 3, gap: 1 }}>
                  <PaletteRoundedIcon fontSize="small" /> Material
                </ToggleButton>
                <ToggleButton value="editorial" sx={{ px: 3, gap: 1 }}>
                  <AutoAwesomeRoundedIcon fontSize="small" /> Editorial
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>
        </SettingsCard>

        <SettingsCard title="Security" description="Update your password. Leave blank to keep the current one.">
          <Stack spacing={2.5}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="New password"
                  type="password"
                  fullWidth
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Repeat password"
                  type="password"
                  fullWidth
                  autoComplete="new-password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Box>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LockResetRoundedIcon />}
                onClick={updatePassword}
              >
                Update password
              </Button>
            </Box>
          </Stack>
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
