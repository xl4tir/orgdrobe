import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import type { Garment } from '@/types/domain'
import { staggerContainer } from '@/theme/motion'
import { GarmentCard } from './GarmentCard'

export function GarmentGrid({ garments }: { garments: Garment[] }) {
  return (
    <Box
      component={motion.div}
      variants={staggerContainer(0.05)}
      initial="initial"
      animate="animate"
      sx={{
        display: 'grid',
        gap: { xs: 1.5, sm: 2.5 },
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {garments.map((g) => (
        <GarmentCard key={g.id} garment={g} />
      ))}
    </Box>
  )
}
