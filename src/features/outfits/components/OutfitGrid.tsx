import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import type { Outfit } from '@/types/domain'
import { staggerContainer } from '@/theme/motion'
import { OutfitCard } from './OutfitCard'

export function OutfitGrid({ outfits }: { outfits: Outfit[] }) {
  return (
    <Box
      component={motion.div}
      variants={staggerContainer(0.06)}
      initial="initial"
      animate="animate"
      sx={{
        display: 'grid',
        gap: { xs: 1.5, sm: 2.5 },
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
      }}
    >
      {outfits.map((o) => (
        <OutfitCard key={o.id} outfit={o} />
      ))}
    </Box>
  )
}
