import { Box, type SxProps, type Theme } from '@mui/material'
import type { Garment, OutfitLayout } from '@/types/domain'
import { GarmentVisual } from './GarmentVisual'

interface OutfitVisualProps {
  garments: Garment[]
  layout: OutfitLayout
  ratio?: string
  sx?: SxProps<Theme>
}

/** Renders an outfit three ways, mirroring the Figma card variants. */
export function OutfitVisual({ garments, layout, ratio = '4 / 5', sx }: OutfitVisualProps) {
  const items = garments.slice(0, 8)

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: ratio,
        borderRadius: '18px',
        overflow: 'hidden',
        bgcolor: (t) => (t.palette.mode === 'light' ? 'grey.100' : 'rgba(255,255,255,0.04)'),
        p: layout === 'cover' ? 0 : 1,
        ...sx,
      }}
    >
      {layout === 'cover' && garments[0] && (
        <GarmentVisual garment={garments[0]} ratio={ratio} radius={18} sx={{ height: '100%' }} />
      )}

      {layout === 'grid' && (
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: '1fr',
            gap: 0.75,
          }}
        >
          {items.map((g) => (
            <GarmentVisual
              key={g.id}
              garment={g}
              ratio="1 / 1"
              radius={10}
              showSwatches={false}
              sx={{ height: '100%' }}
            />
          ))}
        </Box>
      )}

      {layout === 'canvas' && (
        <Box sx={{ position: 'relative', height: '100%' }}>
          {items.slice(0, 4).map((g, i) => {
            const positions = [
              { top: '6%', left: '10%', rotate: -8, z: 1 },
              { top: '18%', left: '40%', rotate: 6, z: 3 },
              { top: '40%', left: '18%', rotate: -4, z: 2 },
              { top: '46%', left: '48%', rotate: 10, z: 4 },
            ]
            const p = positions[i]
            return (
              <Box
                key={g.id}
                sx={{
                  position: 'absolute',
                  top: p.top,
                  left: p.left,
                  width: '44%',
                  zIndex: p.z,
                  transform: `rotate(${p.rotate}deg)`,
                  transition: 'transform .4s cubic-bezier(.22,1,.36,1)',
                  filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.16))',
                }}
              >
                <GarmentVisual garment={g} ratio="3 / 4" radius={12} showSwatches={false} />
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
