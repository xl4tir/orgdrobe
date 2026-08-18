import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { staggerContainer } from '@/theme/motion'

interface ScrollRowProps {
  children: ReactNode
  /** Width of each item (CSS length). */
  itemWidth?: number | string
}

/** Horizontal, snap-scrolling row for suggestion carousels. */
export function ScrollRow({ children, itemWidth = 210 }: ScrollRowProps) {
  return (
    <Box
      component={motion.div}
      variants={staggerContainer(0.05)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth,
        gap: 2,
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        pb: 1.5,
        mx: { xs: -2, sm: 0 },
        px: { xs: 2, sm: 0 },
        '& > *': { scrollSnapAlign: 'start' },
        scrollbarWidth: 'thin',
      }}
    >
      {children}
    </Box>
  )
}
