import { Box, useTheme, type SxProps, type Theme } from '@mui/material'
import type { GarmentCategory } from '@/types/domain'
import { getColor } from '@/lib/colors'
import { lighten, mix } from '@/lib/colorUtils'
import { CATEGORY_EMOJI } from '@/lib/categoryVisual'

interface EmojiTileProps {
  category: GarmentCategory
  /** Colour ids; first is dominant and tints the card. */
  colors?: string[]
  ratio?: string
  radius?: number
  emojiSize?: string
  sx?: SxProps<Theme>
}

/**
 * Playful, decorative tile — a category emoji on a soft colour-matched card.
 * Used for hero / auth flourishes where real photos would look random.
 */
export function EmojiTile({
  category,
  colors = ['lilac'],
  ratio = '3 / 4',
  radius = 20,
  emojiSize = 'clamp(2.4rem, 6vw, 3.6rem)',
  sx,
}: EmojiTileProps) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const primary = getColor(colors[0]).hex

  const bg = isLight
    ? `linear-gradient(160deg, ${lighten(primary, 0.72)} 0%, ${lighten(primary, 0.46)} 100%)`
    : `linear-gradient(160deg, ${mix(primary, '#17151C', 0.55)} 0%, ${mix(primary, '#17151C', 0.8)} 100%)`

  return (
    <Box
      aria-hidden
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: ratio,
        borderRadius: `${radius}px`,
        overflow: 'hidden',
        background: bg,
        display: 'grid',
        placeItems: 'center',
        boxShadow: isLight ? 'inset 0 0 0 1px rgba(0,0,0,0.05)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        ...sx,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(120% 80% at 26% 12%, ${
            isLight ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.08)'
          } 0%, transparent 60%)`,
        }}
      />
      <Box
        component="span"
        sx={{
          fontSize: emojiSize,
          lineHeight: 1,
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.22))',
          userSelect: 'none',
        }}
      >
        {CATEGORY_EMOJI[category]}
      </Box>
    </Box>
  )
}
