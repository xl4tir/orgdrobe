import { alpha, Box, useTheme, type SxProps, type Theme } from '@mui/material'
import type { GarmentCategory } from '@/types/domain'
import { getColor } from '@/lib/colors'
import { CATEGORY_EMOJI } from '@/lib/categoryVisual'

interface EmojiTileProps {
  category: GarmentCategory
  /** Colour ids; first is dominant and tints the card. */
  colors?: string[]
  ratio?: string
  radius?: number
  emojiSize?: string
  /** Rotate just the emoji (degrees) for a playful, askew look. */
  emojiTilt?: number
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
  emojiTilt = 0,
  sx,
}: EmojiTileProps) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const primary = getColor(colors[0]).hex

  // Flat Material tonal container — a solid tint of the dominant colour.
  const bg = alpha(primary, isLight ? 0.14 : 0.24)

  return (
    <Box
      aria-hidden
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: ratio,
        borderRadius: `${radius}px`,
        overflow: 'hidden',
        bgcolor: bg,
        display: 'grid',
        placeItems: 'center',
        boxShadow: theme.shadows[1],
        ...sx,
      }}
    >
      <Box
        component="span"
        sx={{
          fontSize: emojiSize,
          lineHeight: 1,
          transform: emojiTilt ? `rotate(${emojiTilt}deg)` : 'none',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.22))',
          userSelect: 'none',
        }}
      >
        {CATEGORY_EMOJI[category]}
      </Box>
    </Box>
  )
}
