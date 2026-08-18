import { useState, type FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Button, Link, Stack, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthLayout } from '../components/AuthLayout'
import { useAuthStore } from '../store'

const STEPS = ['Your details', 'Set a password']

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const next = (e: FormEvent) => {
    e.preventDefault()
    if (step === 0) {
      if (name && email) setStep(1)
      return
    }
    if (password && password === confirm) {
      register(name, email)
      navigate('/app', { replace: true })
    }
  }

  const passwordError = confirm.length > 0 && confirm !== password

  return (
    <AuthLayout title="Create your account" subtitle="Two quick steps and your wardrobe is ready.">
      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box component="form" onSubmit={next}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 ? (
              <Stack spacing={2.5}>
                <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth autoFocus />
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
              </Stack>
            ) : (
              <Stack spacing={2.5}>
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth autoFocus />
                <TextField
                  label="Repeat password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  error={passwordError}
                  helperText={passwordError ? 'Passwords don’t match' : ' '}
                  fullWidth
                />
              </Stack>
            )}
          </motion.div>
        </AnimatePresence>

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          {step === 1 && (
            <Button color="inherit" onClick={() => setStep(0)} fullWidth>
              Back
            </Button>
          )}
          <Button type="submit" variant="contained" size="large" fullWidth>
            {step === 0 ? 'Continue' : 'Create account'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 700 }}>
          Log in
        </Link>
      </Typography>
    </AuthLayout>
  )
}
