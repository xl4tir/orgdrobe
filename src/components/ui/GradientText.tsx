import { Box, type BoxProps } from '@mui/material'

/** Emphasis text painted in a solid primary colour. Use sparingly, for hero moments. */
export function GradientText({ children, sx, ...rest }: BoxProps) {
  return (
    <Box
      component="span"
      sx={{
        color: 'primary.main',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  )
}
