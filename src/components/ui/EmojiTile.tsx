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
  // Tint from the more saturated of the two colours, so light pieces (white/ivory)
  // still get a visible card instead of washing out.
  const a = getColor(colors[0])
  const b = colors[1] ? getColor(colors[1]) : a
  const base = (a.group === 'white' || a.group === 'gray') && b.group !== 'white' ? b.hex : a.hex

  // Flat Material tonal container — a clear pastel of the dominant colour.
  const bg = isLight ? lighten(base, 0.42) : mix(base, '#211F26', 0.5)

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
        boxShadow: theme.shadows[2],
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
