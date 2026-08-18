import { Box, Card, Chip, IconButton, Stack, Typography } from '@mui/material'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import LoopRoundedIcon from '@mui/icons-material/LoopRounded'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Garment } from '@/types/domain'
import { GarmentVisual } from '@/components/ui/GarmentVisual'
import { CATEGORY_LABELS } from '@/lib/catalog'
import { pluralize } from '@/lib/format'
import { riseItem, spring } from '@/theme/motion'
import { useGarmentStore } from '../store'

export function GarmentCard({ garment }: { garment: Garment }) {
  const navigate = useNavigate()
  const toggleFavorite = useGarmentStore((s) => s.toggleFavorite)

  return (
    <Card
      component={motion.article}
      variants={riseItem}
      whileHover={{ y: -6, transition: spring }}
      onClick={() => navigate(`/app/garments/${garment.id}`)}
      sx={{
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow .3s',
        '&:hover': { boxShadow: (t) => t.custom.softShadows.md },
        '&:hover .garment-visual': { transform: 'scale(1.045)' },
      }}
    >
      <Box sx={{ position: 'relative', p: 1.25, pb: 0 }}>
        <Box
          className="garment-visual"
          sx={{ transition: 'transform .5s cubic-bezier(.22,1,.36,1)', transformOrigin: 'center' }}
        >
          <GarmentVisual garment={garment} />
        </Box>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(garment.id)
          }}
          aria-label={garment.favorite ? 'Remove from favourites' : 'Add to favourites'}
          sx={{
            position: 'absolute',
            top: 18,
            right: 18,
            bgcolor: 'rgba(255,255,255,0.85)',
            color: garment.favorite ? 'secondary.main' : 'grey.700',
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
          }}
        >
          {garment.favorite ? (
            <FavoriteRoundedIcon fontSize="small" />
          ) : (
            <FavoriteBorderRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      <Box sx={{ p: 2, pt: 1.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
          <Chip
            label={CATEGORY_LABELS[garment.category]}
            size="small"
            color="primary"
            variant="outlined"
          />
          {garment.brand && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {garment.brand}
            </Typography>
          )}
        </Stack>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }} noWrap>
          {garment.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="clamp-2"
          sx={{ mt: 0.5, flex: 1 }}
        >
          {garment.description}
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ mt: 1.5, color: 'text.secondary' }}
        >
          <LoopRoundedIcon sx={{ fontSize: 15 }} />
          <Typography variant="caption">worn {pluralize(garment.timesWorn, 'time')}</Typography>
        </Stack>
      </Box>
    </Card>
  )
}
