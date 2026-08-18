import { Box, type BoxProps, useTheme } from '@mui/material'

/** Text painted with the brand gradient. Use sparingly, for hero moments. */
export function GradientText({ children, sx, ...rest }: BoxProps) {
  const theme = useTheme()
  return (
    <Box
      component="span"
      sx={{
        background: theme.custom.gradients.brandVivid,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  )
}
