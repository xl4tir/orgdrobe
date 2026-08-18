import { Container, type ContainerProps } from '@mui/material'

/** Consistent page gutter + max width across every app screen. */
export function PageContainer({ children, sx, maxWidth = 'lg', ...rest }: ContainerProps) {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 }, ...sx }}
      {...rest}
    >
      {children}
    </Container>
  )
}
