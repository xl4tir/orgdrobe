import { Box, Typography, useTheme } from '@mui/material'

interface LogoProps {
  size?: number
  showWordmark?: boolean
  onDark?: boolean
}

/** The OrgDrobe mark + wordmark. The "O" hanger echoes the favicon. */
export function Logo({ size = 34, showWordmark = true, onDark = false }: LogoProps) {
  const theme = useTheme()
  const editorial = theme.custom.design === 'editorial'
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.1 }}>
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: `${size * 0.32}px`,
          ...(editorial
            ? {
                background: theme.custom.gradients.brand,
                boxShadow: '0 6px 16px rgba(102,80,230,0.35)',
              }
            : { bgcolor: 'primary.main' }),
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 64 64" fill="none">
          <path
            d="M32 16c-3.6 0-6.5 2.6-6.5 6 0 1.2.4 2.3 1 3.2L16 34.5c-1 .8-1.5 1.9-1.5 3 0 2.2 1.8 4 4 4h27c2.2 0 4-1.8 4-4 0-1.1-.5-2.2-1.5-3l-10.5-9.3c.6-.9 1-2 1-3.2 0-3.4-2.9-6-6.5-6h-.5Z"
            fill="#fff"
            fillOpacity="0.96"
          />
        </svg>
      </Box>
      {showWordmark && (
        <Typography
          component="span"
          sx={{
            ...(editorial && { fontFamily: '"Fraunces Variable", serif' }),
            fontWeight: 600,
            fontSize: size * 0.62,
            letterSpacing: '-0.02em',
            color: onDark ? '#fff' : 'text.primary',
            lineHeight: 1,
          }}
        >
          Роздя
          <Box
            component="span"
            sx={{ color: onDark ? (editorial ? 'secondary.light' : '#fff') : 'primary.main' }}
          >
            гальня
          </Box>
        </Typography>
      )}
    </Box>
  )
}
