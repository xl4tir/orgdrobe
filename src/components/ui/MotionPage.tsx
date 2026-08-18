import { motion } from 'framer-motion'
import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { pageVariants } from '@/theme/motion'

/** Wraps a route in a consistent enter/exit transition. */
export function MotionPage({ children }: { children: ReactNode }) {
  return (
    <Box
      component={motion.main}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      sx={{ width: '100%' }}
    >
      {children}
    </Box>
  )
}
