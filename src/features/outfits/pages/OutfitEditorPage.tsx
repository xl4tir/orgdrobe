import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid2 as Grid,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ViewModuleRoundedIcon from '@mui/icons-material/ViewModuleRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import { motion } from 'framer-motion'
import type { Garment, OutfitLayout } from '@/types/domain'
import { PageContainer } from '@/components/ui/PageContainer'
import { EmptyState } from '@/components/ui/EmptyState'
import { OutfitVisual } from '@/components/ui/OutfitVisual'
import { GarmentVisual } from '@/components/ui/GarmentVisual'
import { useGarmentStore } from '@/features/garments/store'
import { CATEGORY_LABELS, SEASON_EMOJI, SEASON_LABELS } from '@/lib/catalog'
import { staggerContainer, riseItem } from '@/theme/motion'
import { useOutfitStore } from '../store'
import { OutfitBuilder } from '../components/OutfitBuilder'

const LAYOUTS: { value: OutfitLayout; icon: React.ReactNode; label: string }[] = [
  { value: 'cover', icon: <ImageRoundedIcon fontSize="small" />, label: 'Cover' },
  { value: 'grid', icon: <ViewModuleRoundedIcon fontSize="small" />, label: 'Grid' },
  { value: 'canvas', icon: <DashboardCustomizeRoundedIcon fontSize="small" />, label: 'Canvas' },
]

export function OutfitEditorPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const outfit = useOutfitStore((s) => s.outfits.find((o) => o.id === id))
  const updateOutfit = useOutfitStore((s) => s.updateOutfit)
  const removeOutfit = useOutfitStore((s) => s.removeOutfit)
  const allGarments = useGarmentStore((s) => s.garments)

  const [tab, setTab] = useState(0)
  const [layout, setLayout] = useState<OutfitLayout>(outfit?.layout ?? 'grid')
  const [pieceIds, setPieceIds] = useState<string[]>(outfit?.garmentIds ?? [])
  const [name, setName] = useState(outfit?.name ?? '')
  const [description, setDescription] = useState(outfit?.description ?? '')
  const [coverImage, setCoverImage] = useState<string | undefined>(outfit?.coverImage)
  const [coverDrag, setCoverDrag] = useState(false)
  const [snack, setSnack] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const readCover = (file: File | null | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setCoverImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const pieces = useMemo(
    () =>
      pieceIds
        .map((pid) => allGarments.find((g) => g.id === pid))
        .filter((g): g is Garment => Boolean(g)),
    [pieceIds, allGarments],
  )

  const recommendations = useMemo(
    () => allGarments.filter((g) => !pieceIds.includes(g.id)).slice(0, 8),
    [allGarments, pieceIds],
  )

  if (!outfit) {
    return (
      <PageContainer>
        <EmptyState
          emoji="👻"
          title="Outfit not found"
          actionLabel="Back to outfits"
          onAction={() => navigate('/app/outfits')}
        />
      </PageContainer>
    )
  }

  const addPiece = (gid: string) =>
    setPieceIds((p) => (p.includes(gid) ? p : [...p, gid]))
  const shuffle = () => setPieceIds((p) => [...p].sort(() => Math.random() - 0.5))

  const handleDelete = () => {
    removeOutfit(outfit.id)
    navigate('/app/outfits')
  }

  const handleSave = () => {
    updateOutfit(outfit.id, { name, description, garmentIds: pieceIds, layout, coverImage })
    setSnack('Outfit saved')
  }

  return (
    <PageContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/app/outfits')} color="inherit">
          Back to outfits
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save outfit
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={{ xs: 3, md: 5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ position: 'sticky', top: 88 }}>
            <Box
              component={motion.div}
              key={layout}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              onClick={layout === 'cover' ? () => coverInputRef.current?.click() : undefined}
              onDragOver={
                layout === 'cover'
                  ? (e) => {
                      e.preventDefault()
                      setCoverDrag(true)
                    }
                  : undefined
              }
              onDragLeave={() => setCoverDrag(false)}
              onDrop={
                layout === 'cover'
                  ? (e) => {
                      e.preventDefault()
                      setCoverDrag(false)
                      readCover(e.dataTransfer.files?.[0])
                    }
                  : undefined
              }
              sx={{ position: 'relative', cursor: layout === 'cover' ? 'pointer' : 'default' }}
            >
              <OutfitVisual garments={pieces} layout={layout} coverImage={coverImage} ratio="1 / 1" />

              {layout === 'cover' && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '18px',
                    display: 'grid',
                    placeItems: 'center',
                    textAlign: 'center',
                    p: 2,
                    color: '#fff',
                    border: coverImage ? 'none' : '2px dashed rgba(255,255,255,0.7)',
                    bgcolor: coverDrag
                      ? 'rgba(25,118,210,0.4)'
                      : coverImage
                        ? 'rgba(0,0,0,0)'
                        : 'rgba(0,0,0,0.35)',
                    opacity: coverImage && !coverDrag ? 0 : 1,
                    transition: 'opacity .2s, background-color .2s',
                    '&:hover': { opacity: 1, bgcolor: 'rgba(0,0,0,0.45)' },
                  }}
                >
                  <Stack alignItems="center" spacing={0.75}>
                    <CloudUploadRoundedIcon />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {coverDrag
                        ? 'Drop to set cover'
                        : coverImage
                          ? 'Click or drop to replace'
                          : 'Upload a cover photo'}
                    </Typography>
                    {!coverImage && (
                      <Typography variant="caption" sx={{ opacity: 0.85 }}>
                        drag &amp; drop — the outfit’s look
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}
            </Box>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                readCover(e.target.files?.[0])
                e.target.value = ''
              }}
            />

            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
              <ToggleButtonGroup exclusive value={layout} onChange={(_, v) => v && setLayout(v)} size="small">
                {LAYOUTS.map((l) => (
                  <ToggleButton key={l.value} value={l.value} sx={{ px: 2, gap: 0.75 }}>
                    {l.icon}
                    {l.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>

            {layout === 'cover' && coverImage && (
              <Stack direction="row" justifyContent="center" sx={{ mt: 1 }}>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={() => setCoverImage(undefined)}
                >
                  Remove cover
                </Button>
              </Stack>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>
            {name || 'Untitled outfit'}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {pieces.length} pieces · worn {outfit.timesWorn} times
          </Typography>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" sx={{ mb: 3 }}>
            <Tab label="Garments" />
            <Tab label="Recommendations" />
            <Tab label="Info" />
            <Tab label="Remix" />
          </Tabs>

          {tab === 0 && (
            <OutfitBuilder pieceIds={pieceIds} setPieceIds={setPieceIds} allGarments={allGarments} />
          )}

          {tab === 1 && (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Pieces from your wardrobe that pair well with this outfit.
              </Typography>
              {recommendations.length > 0 ? (
                <Box
                  component={motion.div}
                  variants={staggerContainer(0.05)}
                  initial="initial"
                  animate="animate"
                  sx={{
                    display: 'grid',
                    gap: 1.5,
                    gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)' },
                  }}
                >
                  {recommendations.map((g) => (
                    <Box
                      key={g.id}
                      component={motion.div}
                      variants={riseItem}
                      sx={{ position: 'relative', cursor: 'pointer' }}
                      onClick={() => addPiece(g.id)}
                    >
                      <GarmentVisual garment={g} ratio="3 / 4" radius={12} showSwatches={false} />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '12px',
                          display: 'grid',
                          placeItems: 'center',
                          opacity: 0,
                          transition: 'opacity .2s',
                          '&:hover': { opacity: 1, bgcolor: 'rgba(0,0,0,0.35)' },
                        }}
                      >
                        <AddRoundedIcon sx={{ color: '#fff', fontSize: 30 }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Every piece in your wardrobe is already part of this outfit.
                </Typography>
              )}
            </Stack>
          )}

          {tab === 2 && (
            <Stack spacing={2.5}>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
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
                  Seasons
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                  {outfit.seasons.length > 0 ? (
                    outfit.seasons.map((s) => (
                      <Chip key={s} label={`${SEASON_EMOJI[s]} ${SEASON_LABELS[s]}`} variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No seasons yet
                    </Typography>
                  )}
                </Stack>
              </Box>
              <Divider />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {pieces.map((g) => (
                  <Chip key={g.id} label={`${g.name} · ${CATEGORY_LABELS[g.category]}`} variant="outlined" />
                ))}
              </Stack>
            </Stack>
          )}

          {tab === 3 && (
            <Stack spacing={3} alignItems="flex-start">
              <Typography variant="body2" color="text.secondary">
                Shuffle the arrangement to discover a fresh take on this outfit.
              </Typography>
              <Button
                variant="contained"
                startIcon={<ShuffleRoundedIcon />}
                onClick={shuffle}
                disabled={pieceIds.length < 2}
              >
                Shuffle arrangement
              </Button>
            </Stack>
          )}
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
