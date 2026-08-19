import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid2 as Grid,
  IconButton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { EmptyState } from '@/components/ui/EmptyState'
import { GarmentVisual } from '@/components/ui/GarmentVisual'
import { OutfitCard } from '@/features/outfits/components/OutfitCard'
import { useOutfitStore } from '@/features/outfits/store'
import { CATEGORY_LABELS, SEASON_EMOJI, SEASON_LABELS } from '@/lib/catalog'
import { getColor } from '@/lib/colors'
import { fromNow } from '@/lib/format'
import { staggerContainer } from '@/theme/motion'
import { useGarmentStore } from '../store'
import { GarmentCard } from '../components/GarmentCard'

export function GarmentDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const garment = useGarmentStore((s) => s.garments.find((g) => g.id === id))
  const garments = useGarmentStore((s) => s.garments)
  const toggleFavorite = useGarmentStore((s) => s.toggleFavorite)
  const removeGarment = useGarmentStore((s) => s.removeGarment)
  const outfits = useOutfitStore((s) => s.outfits)

  const [tab, setTab] = useState(0)
  const [snack, setSnack] = useState<string | null>(null)
  const [name, setName] = useState(garment?.name ?? '')
  const [description, setDescription] = useState(garment?.description ?? '')

  const usedIn = useMemo(
    () => outfits.filter((o) => o.garmentIds.includes(id)),
    [outfits, id],
  )
  const similar = useMemo(() => {
    if (!garment) return []
    return garments
      .filter(
        (g) =>
          g.id !== garment.id &&
          (g.category === garment.category ||
            g.colors.some((c) => garment.colors.includes(c))),
      )
      .slice(0, 4)
  }, [garments, garment])

  if (!garment) {
    return (
      <PageContainer>
        <EmptyState
          emoji="👻"
          title="Garment not found"
          description="It may have been removed from your wardrobe."
          actionLabel="Back to garments"
          onAction={() => navigate('/app/garments')}
        />
      </PageContainer>
    )
  }

  const handleDelete = () => {
    removeGarment(garment.id)
    navigate('/app/garments')
  }

  return (
    <PageContainer>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate('/app/garments')}
        color="inherit"
        sx={{ mb: 2 }}
      >
        Back to garments
      </Button>

      <Grid container spacing={{ xs: 3, md: 5 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            sx={{ position: 'sticky', top: 88 }}
          >
            <GarmentVisual garment={garment} ratio="4 / 5" radius={24} />
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                startIcon={<PhotoCameraRoundedIcon />}
                onClick={() => setSnack('Photo upload is coming soon — pieces show as colour silhouettes for now')}
              >
                Change image
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={() => setSnack('Photo upload is coming soon')}
              >
                Delete image
              </Button>
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={CATEGORY_LABELS[garment.category]} color="primary" />
              {garment.brand && <Chip label={garment.brand} variant="outlined" />}
              {garment.material && <Chip label={garment.material} variant="outlined" />}
            </Stack>
            <IconButton
              onClick={() => toggleFavorite(garment.id)}
              color={garment.favorite ? 'secondary' : 'default'}
              sx={{ border: (t) => `1px solid ${t.palette.divider}` }}
            >
              {garment.favorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ my: 3 }}>
            <Stat label="Times worn" value={garment.timesWorn} />
            <Stat label="Last worn" value={fromNow(garment.lastWorn)} />
            <Stat label="In outfits" value={usedIn.length} />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="Info" />
            <Tab label={`Used in · ${usedIn.length}`} />
            <Tab label={`Similar · ${similar.length}`} />
          </Tabs>

          {tab === 0 && (
            <Stack spacing={2.5}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Colours
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {garment.colors.map((c) => (
                    <Chip
                      key={c}
                      label={getColor(c).name}
                      avatar={
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            bgcolor: getColor(c).hex,
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                          }}
                        />
                      }
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Seasons
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {garment.seasons.map((s) => (
                    <Chip key={s} label={`${SEASON_EMOJI[s]} ${SEASON_LABELS[s]}`} variant="outlined" />
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button variant="contained" onClick={() => setSnack('Changes saved')}>
                  Save changes
                </Button>
              </Stack>
            </Stack>
          )}

          {tab === 1 &&
            (usedIn.length ? (
              <Box
                component={motion.div}
                variants={staggerContainer()}
                initial="initial"
                animate="animate"
                sx={{
                  display: 'grid',
                  gap: 2.5,
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                }}
              >
                {usedIn.map((o) => (
                  <OutfitCard key={o.id} outfit={o} />
                ))}
              </Box>
            ) : (
              <EmptyState emoji="🧩" title="Not in any outfit yet" description="Add this piece to an outfit to see it here." />
            ))}

          {tab === 2 &&
            (similar.length ? (
              <Box
                component={motion.div}
                variants={staggerContainer()}
                initial="initial"
                animate="animate"
                sx={{
                  display: 'grid',
                  gap: 2.5,
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                }}
              >
                {similar.map((g) => (
                  <GarmentCard key={g.id} garment={g} />
                ))}
              </Box>
            ) : (
              <EmptyState emoji="✨" title="Nothing similar found" />
            ))}
        </Grid>
      </Grid>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2400}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </PageContainer>
  )
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="h5">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  )
}
