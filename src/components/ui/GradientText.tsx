import { Box, type BoxProps, useTheme } from '@mui/material'

/** Emphasis text. Painted with the brand gradient (editorial) or a solid primary colour (material). Use sparingly, for hero moments. */
export function GradientText({ children, sx, ...rest }: BoxProps) {
  const theme = useTheme()
  const editorial = theme.custom.design === 'editorial'
  return (
    <Box
      component="span"
      sx={{
        ...(editorial
          ? {
              background: theme.custom.gradients.brandVivid,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }
          : { color: 'primary.main' }),
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  )
}
