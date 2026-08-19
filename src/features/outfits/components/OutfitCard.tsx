import { Box, Card, Chip, IconButton, Stack, Typography } from '@mui/material'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Outfit } from '@/types/domain'
import { OutfitVisual } from '@/components/ui/OutfitVisual'
import { useGarmentStore } from '@/features/garments/store'
import { pluralize } from '@/lib/format'
import { riseItem, spring } from '@/theme/motion'
import { useOutfitStore } from '../store'

const LAYOUT_LABEL: Record<Outfit['layout'], string> = {
  cover: 'Cover',
  grid: 'Grid',
  canvas: 'Canvas',
}

export function OutfitCard({ outfit }: { outfit: Outfit }) {
  const navigate = useNavigate()
  const garments = useGarmentStore((s) => s.garments)
  const toggleFavorite = useOutfitStore((s) => s.toggleFavorite)

  const items = outfit.garmentIds
    .map((gid) => garments.find((g) => g.id === gid))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  return (
    <Card
      component={motion.article}
      variants={riseItem}
      whileHover={{ y: -6, transition: spring }}
      onClick={() => navigate(`/app/outfits/${outfit.id}`)}
      sx={{
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow .3s',
        '&:hover': { boxShadow: (t) => t.shadows[6] },
      }}
    >
      <Box sx={{ position: 'relative', p: 1.25, pb: 0 }}>
        <OutfitVisual garments={items} layout={outfit.layout} coverImage={outfit.coverImage} />
        <Chip
          label={LAYOUT_LABEL[outfit.layout]}
          size="small"
          sx={{
            position: 'absolute',
            top: 18,
            left: 18,
            bgcolor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
            fontWeight: 700,
          }}
        />
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(outfit.id)
          }}
          aria-label="Toggle favourite"
          sx={{
            position: 'absolute',
            top: 18,
            right: 18,
            bgcolor: 'rgba(255,255,255,0.85)',
            color: outfit.favorite ? 'secondary.main' : 'grey.700',
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
          }}
        >
          {outfit.favorite ? (
            <FavoriteRoundedIcon fontSize="small" />
          ) : (
            <FavoriteBorderRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      <Box sx={{ p: 2, pt: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
          {outfit.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="clamp-1" sx={{ mt: 0.25 }}>
          {outfit.description}
        </Typography>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.25, color: 'text.secondary' }}>
          <CheckroomRoundedIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">{pluralize(items.length, 'piece')}</Typography>
          <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled', mx: 0.5 }} />
          <Typography variant="caption">worn {pluralize(outfit.timesWorn, 'time')}</Typography>
        </Stack>
      </Box>
    </Card>
  )
}
