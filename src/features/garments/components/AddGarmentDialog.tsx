import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ColorizeRoundedIcon from '@mui/icons-material/ColorizeRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import { AnimatePresence, motion } from 'framer-motion'
import { GarmentVisual } from '@/components/ui/GarmentVisual'
import { getColor } from '@/lib/colors'
import { detectDominantColors, normalizeHex, eyedropperSupported } from '@/lib/imageColor'
import { removeBackground } from '@/lib/removeBackground'
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  ALL_SEASONS,
  SEASON_LABELS,
  SEASON_EMOJI,
} from '@/lib/catalog'
import type { GarmentCategory, Season } from '@/types/domain'
import { useGarmentStore } from '../store'

interface AddGarmentDialogProps {
  open: boolean
  onClose: () => void
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {children}
    </Typography>
  )
}

const toggleValue = <T,>(arr: T[], value: T): T[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]

export function AddGarmentDialog({ open, onClose }: AddGarmentDialogProps) {
  const navigate = useNavigate()
  const addGarment = useGarmentStore((s) => s.addGarment)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<GarmentCategory | null>(null)
  const [colors, setColors] = useState<string[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [brand, setBrand] = useState('')
  const [material, setMaterial] = useState('')
  const [image, setImage] = useState<string | undefined>(undefined)
  const [dragOver, setDragOver] = useState(false)
  const [autoDetected, setAutoDetected] = useState(false)
  const [processing, setProcessing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Reset the form each time the dialog is (re)opened.
  useEffect(() => {
    if (open) {
      setName('')
      setDescription('')
      setCategory(null)
      setColors([])
      setSeasons([])
      setBrand('')
      setMaterial('')
      setImage(undefined)
      setDragOver(false)
      setAutoDetected(false)
      setProcessing(false)
    }
  }, [open])

  const readFile = (file: File | null | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      const url = reader.result
      setImage(url)
      setProcessing(true)
      // Strip the background to a transparent cutout, then detect colours from it.
      removeBackground(url).then((clean) => {
        setImage(clean)
        setProcessing(false)
        detectDominantColors(clean, 3).then((hexes) => {
          if (hexes.length) {
            setColors(hexes)
            setAutoDetected(true)
          }
        })
      })
    }
    reader.readAsDataURL(file)
  }

  const canEyedrop = eyedropperSupported()
  const pickWithEyedropper = async () => {
    try {
      const EyeDropperCtor = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper
      const { sRGBHex } = await new EyeDropperCtor().open()
      const hex = normalizeHex(sRGBHex)
      setColors((prev) => (prev.includes(hex) ? prev : [...prev, hex]))
      setAutoDetected(false)
    } catch {
      /* user cancelled the eyedropper */
    }
  }

  const openFilePicker = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    readFile(e.target.files?.[0])
    // allow choosing the same file again after removing it
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    readFile(e.dataTransfer.files?.[0])
  }

  const hasImage = Boolean(image)
  const canSubmit = name.trim().length > 0 && category !== null

  const dominantHex = colors.length ? getColor(colors[0]).hex : undefined

  const previewGarment = {
    name: name.trim() || 'New garment',
    category: category ?? ('tops' as GarmentCategory),
    colors: colors.length ? colors : ['stone'],
    image,
  }

  const handleSubmit = () => {
    if (!canSubmit || category === null) return
    const id = addGarment({
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      colors,
      seasons,
      brand: brand.trim() || undefined,
      material: material.trim() || undefined,
      image,
    })
    onClose()
    navigate('/app/garments/' + id)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 5, overflow: 'hidden' } } }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* ---- Left: live preview + photo upload on a calm neutral surface ---- */}
        <Box
          sx={{
            width: { xs: '100%', md: '42%' },
            flexShrink: 0,
            p: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2.5,
            borderRight: { md: (t) => `1px solid ${t.palette.divider}` },
            borderBottom: { xs: (t) => `1px solid ${t.palette.divider}`, md: 'none' },
            bgcolor: (t) =>
              dominantHex
                ? alpha(dominantHex, t.palette.mode === 'light' ? 0.07 : 0.12)
                : t.palette.mode === 'light'
                  ? t.palette.grey[50]
                  : alpha('#ffffff', 0.02),
            transition: 'background-color .3s ease',
          }}
        >
          {/* dropzone wrapping the live preview */}
          <Box
            onClick={openFilePicker}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            aria-label={hasImage ? 'Replace photo' : 'Upload photo'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openFilePicker()
              }
            }}
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 240,
              p: 0.75,
              borderRadius: 3,
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: dragOver
                ? 'primary.main'
                : hasImage
                  ? 'transparent'
                  : 'divider',
              bgcolor: (t) => (dragOver ? alpha(t.palette.primary.main, 0.06) : 'transparent'),
              transition: 'border-color .18s ease, background-color .18s ease',
              '&:hover': { borderColor: hasImage ? 'divider' : 'primary.light' },
              '&:hover .dropzone-hint': { opacity: 1 },
              '&:focus-visible': {
                outline: (t) => `2px solid ${t.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <Box
                key={hasImage ? 'photo' : 'silhouette'}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <GarmentVisual garment={previewGarment} ratio="3 / 4" radius={18} />
              </Box>
            </AnimatePresence>

            {processing && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 6,
                  borderRadius: '18px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: (t) =>
                    t.palette.mode === 'light' ? 'rgba(255,255,255,0.62)' : 'rgba(20,17,25,0.6)',
                  backdropFilter: 'blur(2px)',
                  zIndex: 2,
                }}
              >
                <Stack alignItems="center" spacing={1}>
                  <CircularProgress size={26} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Removing background…
                  </Typography>
                </Stack>
              </Box>
            )}

            {/* hover / drag hint (only while there is no photo) */}
            {!hasImage && (
              <Box
                className="dropzone-hint"
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 6,
                  borderRadius: '18px',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  bgcolor: 'rgba(15,12,20,0.32)',
                  opacity: dragOver ? 1 : 0,
                  transition: 'opacity .18s ease',
                  pointerEvents: 'none',
                }}
              >
                <Stack alignItems="center" spacing={0.75}>
                  <CloudUploadRoundedIcon />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {dragOver ? 'Drop to upload' : 'Upload photo'}
                  </Typography>
                </Stack>
              </Box>
            )}
          </Box>

          {/* controls */}
          {hasImage ? (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                startIcon={<PhotoCameraRoundedIcon />}
                onClick={openFilePicker}
              >
                Replace
              </Button>
              <Button
                size="small"
                color="inherit"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={() => setImage(undefined)}
              >
                Remove
              </Button>
            </Stack>
          ) : (
            <Stack alignItems="center" spacing={0.5}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CloudUploadRoundedIcon />}
                onClick={openFilePicker}
              >
                Upload photo
              </Button>
              <Typography variant="caption" color="text.secondary">
                or drag &amp; drop an image
              </Typography>
            </Stack>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Box>

        {/* ---- Right: the form ---- */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: { md: '86vh' },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ px: { xs: 3, md: 4 }, pt: 3, pb: 1 }}
          >
            <Box>
              <Typography variant="overline" color="text.secondary">
                New piece
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Add garment
              </Typography>
            </Box>
            <IconButton onClick={onClose} aria-label="Close" size="small" sx={{ mt: -0.5, mr: -0.5 }}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          <Box sx={{ px: { xs: 3, md: 4 }, pt: 2, pb: 2, overflowY: 'auto', flex: 1 }}>
            <Stack spacing={3}>
              <TextField
                label="Name"
                required
                autoFocus
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ribbed wool sweater"
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short note about the piece…"
              />

              <Box>
                <FieldLabel>Category</FieldLabel>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {CATEGORY_ORDER.map((cat) => {
                    const active = category === cat
                    return (
                      <Chip
                        key={cat}
                        label={CATEGORY_LABELS[cat]}
                        onClick={() => setCategory(cat)}
                        color={active ? 'primary' : 'default'}
                        variant={active ? 'filled' : 'outlined'}
                      />
                    )
                  })}
                </Stack>
              </Box>

              <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    Colours
                  </Typography>
                  {canEyedrop && (
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<ColorizeRoundedIcon sx={{ fontSize: 18 }} />}
                      onClick={pickWithEyedropper}
                      disabled={!image}
                      sx={{ minWidth: 0, py: 0.25 }}
                    >
                      Pick from photo
                    </Button>
                  )}
                </Stack>
                {colors.length > 0 ? (
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {colors.map((hex) => (
                      <Box
                        key={hex}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                          pl: 0.75,
                          pr: 0.75,
                          py: 0.5,
                          borderRadius: 999,
                          border: (t) => `1px solid ${t.palette.divider}`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: getColor(hex).hex,
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                          }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          {getColor(hex).hex.toUpperCase()}
                        </Typography>
                        <Box
                          component="button"
                          type="button"
                          aria-label={`Remove ${hex}`}
                          onClick={() => setColors((prev) => prev.filter((c) => c !== hex))}
                          sx={{
                            display: 'grid',
                            placeItems: 'center',
                            width: 18,
                            height: 18,
                            p: 0,
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            bgcolor: 'transparent',
                            color: 'text.secondary',
                            '&:hover': { color: 'text.primary' },
                          }}
                        >
                          <CloseRoundedIcon sx={{ fontSize: 14 }} />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Upload a photo to detect colours automatically
                    {canEyedrop ? ', or use the eyedropper to pick one' : ''}.
                  </Typography>
                )}
                <Box sx={{ minHeight: 20, mt: 1 }}>
                  {autoDetected && colors.length > 0 && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        Auto-detected from your photo — remove any, or add more with the eyedropper.
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Box>

              <Box>
                <FieldLabel>Seasons</FieldLabel>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {ALL_SEASONS.map((s) => {
                    const active = seasons.includes(s)
                    return (
                      <Chip
                        key={s}
                        label={`${SEASON_EMOJI[s]}  ${SEASON_LABELS[s]}`}
                        onClick={() => setSeasons((prev) => toggleValue(prev, s))}
                        color={active ? 'secondary' : 'default'}
                        variant={active ? 'filled' : 'outlined'}
                      />
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Brand" fullWidth value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Optional" />
                <TextField label="Material" fullWidth value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Optional" />
              </Stack>
            </Stack>
          </Box>

          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="flex-end"
            sx={{ px: { xs: 3, md: 4 }, py: 2.5, borderTop: (t) => `1px solid ${t.palette.divider}` }}
          >
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" disabled={!canSubmit} startIcon={<AddRoundedIcon />}>
              Add garment
            </Button>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  )
}
