import { useState, type FormEvent } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, Divider, Link, Stack, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../components/AuthLayout'
import { useAuthStore } from '../store'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('demo@orgdrobe.com')
  const [password, setPassword] = useState('demo1234')

  const from = (location.state as { from?: string })?.from ?? '/app'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    login(email)
    navigate(from, { replace: true })
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to pick up where your wardrobe left off.">
      <Box component="form" onSubmit={submit}>
        <Stack spacing={2.5}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Box sx={{ textAlign: 'right' }}>
            <Link component="button" type="button" underline="hover" variant="body2" color="text.secondary">
              Forgot password?
            </Link>
          </Box>
          <Button type="submit" variant="contained" size="large" fullWidth>
            Log in
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="caption" color="text.secondary">
          demo account is pre-filled
        </Typography>
      </Divider>

      <Typography variant="body2" color="text.secondary" align="center">
        New here?{' '}
        <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 700 }}>
          Create an account
        </Link>
      </Typography>
    </AuthLayout>
  )
}
