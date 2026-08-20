import { useEffect, useState } from 'react'
import { Box, useTheme, type SxProps, type Theme } from '@mui/material'
import type { Garment } from '@/types/domain'
import { getColor } from '@/lib/colors'
import { lighten, mix, readableOn } from '@/lib/colorUtils'
import { GarmentIcon } from './GarmentIcon'

interface GarmentVisualProps {
  garment: Pick<Garment, 'colors' | 'category' | 'name' | 'image'>
  /** CSS aspect-ratio, e.g. '3 / 4'. */
  ratio?: string
  radius?: number
  /** Draw the garment silhouette when there is no photo (default true). */
  showIcon?: boolean
  /** Draw the little colour dots (default true, hidden automatically when a photo shows). */
  showSwatches?: boolean
  sx?: SxProps<Theme>
}

/**
 * A garment tile. Shows the real photo when available; otherwise (or if the photo
 * fails to load) falls back to a coloured silhouette on a colour-matched ground —
 * so the card is always on-brand and never appears broken.
 */
export function GarmentVisual({
  garment,
  ratio = '3 / 4',
  radius = 18,
  showIcon = true,
  showSwatches = true,
  sx,
}: GarmentVisualProps) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const editorial = theme.custom.design === 'editorial'
  const primary = getColor(garment.colors[0]).hex
  const secondary = garment.colors[1] ? getColor(garment.colors[1]).hex : undefined

  const [imgOk, setImgOk] = useState(Boolean(garment.image))
  useEffect(() => setImgOk(Boolean(garment.image)), [garment.image])
  const showPhoto = Boolean(garment.image) && imgOk
  // Every garment image is a transparent product cut-out (a single item on a
  // clear background) — show the whole piece on its colour-matched card.
  const isCutout = Boolean(garment.image)

  // Material: a flat, solid wash of the garment's own colour — pale in light mode, deep in dark.
  const materialBg = isLight ? mix(primary, '#ffffff', 0.82) : mix(primary, '#211F26', 0.7)
  // Editorial: a gentle colour-wash gradient of the garment's own colour.
  const editorialBg = isLight
    ? `linear-gradient(160deg, ${lighten(primary, 0.84)} 0%, ${lighten(primary, 0.6)} 100%)`
    : `linear-gradient(160deg, ${mix(primary, '#17151C', 0.7)} 0%, ${mix(primary, '#17151C', 0.88)} 100%)`

  const swatchRing = isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.35)'

  return (
    <Box
      aria-label={garment.name}
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: ratio,
        borderRadius: `${radius}px`,
        overflow: 'hidden',
        ...(editorial ? { background: editorialBg } : { bgcolor: materialBg }),
        display: 'grid',
        placeItems: 'center',
        boxShadow: isLight ? 'inset 0 0 0 1px rgba(0,0,0,0.04)' : 'inset 0 0 0 1px rgba(255,255,255,0.05)',
        ...sx,
      }}
    >
      {/* soft radial highlight for depth (editorial only, visible behind the silhouette) */}
      {editorial && !showPhoto && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(120% 80% at 26% 12%, ${
              isLight ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.08)'
            } 0%, transparent 60%)`,
          }}
        />
      )}

      {/* real photo */}
      {garment.image && (
        <Box
          component="img"
          src={garment.image}
          alt={garment.name}
          loading="lazy"
          onError={() => setImgOk(false)}
          sx={{
            position: 'absolute',
            inset: isCutout ? '8%' : 0,
            width: isCutout ? '84%' : '100%',
            height: isCutout ? '84%' : '100%',
            objectFit: isCutout ? 'contain' : 'cover',
            filter: isCutout ? 'drop-shadow(0 8px 16px rgba(20,17,14,0.16))' : 'none',
            display: showPhoto ? 'block' : 'none',
          }}
        />
      )}

      {/* silhouette fallback */}
      {!showPhoto && showIcon && (
        <GarmentIcon category={garment.category} primary={primary} secondary={secondary} />
      )}

      {/* colour dots — only in silhouette mode, to keep photos clean */}
      {!showPhoto && showSwatches && (
        <Box sx={{ position: 'absolute', left: 12, bottom: 12, display: 'flex', gap: 0.5 }}>
          {garment.colors.slice(0, 3).map((c) => (
            <Box
              key={c}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: getColor(c).hex,
                boxShadow: `0 0 0 1.5px ${swatchRing}`,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

// re-exported for callers that only need the readable-ink helper
export { readableOn }
