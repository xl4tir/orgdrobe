import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { GradientText } from '@/components/ui/GradientText'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h1">
          <GradientText>404</GradientText>
        </Typography>
        <Typography variant="h5">This hanger is empty</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 360 }}>
          The page you’re looking for isn’t in the wardrobe. Let’s get you back to something you can wear.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/app')}>
          Back to dashboard
        </Button>
      </Stack>
    </Box>
  )
}
