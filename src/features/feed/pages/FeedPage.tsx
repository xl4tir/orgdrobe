import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import { motion } from 'framer-motion'
import type { FeedEvent, FeedEventType, Garment, Outfit } from '@/types/domain'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { OutfitVisual } from '@/components/ui/OutfitVisual'
import { GarmentVisual } from '@/components/ui/GarmentVisual'
import { useGarmentStore } from '@/features/garments/store'
import { useOutfitStore } from '@/features/outfits/store'
import { MOCK_FEED } from '@/lib/mockData'
import { formatEventTime } from '@/lib/format'
import { staggerContainer, riseItem } from '@/theme/motion'

const EVENT_META: Record<FeedEventType, { verb: string; kind: 'garment' | 'outfit'; color: string }> = {
  outfit_worn: { verb: 'Wore the outfit', kind: 'outfit', color: '#1976d2' },
  outfit_created: { verb: 'Created the outfit', kind: 'outfit', color: '#2e7d32' },
  garment_created: { verb: 'Added the garment', kind: 'garment', color: '#ed6c02' },
  garment_worn: { verb: 'Wore', kind: 'garment', color: '#0288d1' },
}

export function FeedPage() {
  const [verbose, setVerbose] = useState(true)
  const navigate = useNavigate()
  const garments = useGarmentStore((s) => s.garments)
  const outfits = useOutfitStore((s) => s.outfits)

  const events = useMemo(
    () => [...MOCK_FEED].sort((a, b) => +new Date(b.at) - +new Date(a.at)),
    [],
  )

  type Resolved =
    | { kind: 'outfit'; title: string; to: string; outfit: Outfit; pieces: Garment[] }
    | { kind: 'garment'; title: string; to: string; garment: Garment }

  const resolve = (e: FeedEvent): Resolved | null => {
    const meta = EVENT_META[e.type]
    if (meta.kind === 'outfit') {
      const outfit = outfits.find((o) => o.id === e.refId)
      if (!outfit) return null
      const pieces = outfit.garmentIds
        .map((gid) => garments.find((g) => g.id === gid))
        .filter((g): g is Garment => Boolean(g))
      return { kind: 'outfit', title: outfit.name, to: `/app/outfits/${outfit.id}`, outfit, pieces }
    }
    const garment = garments.find((g) => g.id === e.refId)
    if (!garment) return null
    return { kind: 'garment', title: garment.name, to: `/app/garments/${garment.id}`, garment }
  }

  return (
    <PageContainer maxWidth="md">
      <SectionHeader
        overline="Timeline"
        title="Your feed"
        subtitle="Everything you’ve worn and added, most recent first."
        action={
          <FormControlLabel
            control={<Switch checked={verbose} onChange={(e) => setVerbose(e.target.checked)} />}
            label={verbose ? 'Verbose' : 'Concise'}
          />
        }
      />

      <Box
        component={motion.div}
        variants={staggerContainer(0.05)}
        initial="initial"
        animate="animate"
        sx={{ position: 'relative', pl: { xs: 2, sm: 3 } }}
      >
        {/* timeline spine */}
        <Box
          sx={{
            position: 'absolute',
            left: { xs: 7, sm: 11 },
            top: 8,
            bottom: 8,
            width: 2,
            bgcolor: 'divider',
          }}
        />

        <Stack spacing={verbose ? 2.5 : 1.25}>
          {events.map((e) => {
            const meta = EVENT_META[e.type]
            const resolved = resolve(e)
            if (!resolved) return null

            return (
              <Box
                key={e.id}
                component={motion.div}
                variants={riseItem}
                sx={{ position: 'relative', pl: { xs: 3, sm: 4 } }}
              >
                {/* dot */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: { xs: -1, sm: 1 },
                    top: 6,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: meta.color,
                    border: (t) => `3px solid ${t.palette.background.default}`,
                    zIndex: 1,
                  }}
                />

                <Card
                  onClick={() => navigate(resolved.to)}
                  sx={{
                    p: verbose ? 2 : 1.25,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'transform .2s, box-shadow .2s',
                    '&:hover': { transform: 'translateX(4px)', boxShadow: (t) => t.shadows[3] },
                  }}
                >
                  {verbose && (
                    <Box sx={{ width: 64, flexShrink: 0 }}>
                      {resolved.kind === 'outfit' ? (
                        <OutfitVisual garments={resolved.pieces} layout={resolved.outfit.layout} ratio="1 / 1" />
                      ) : (
                        <GarmentVisual garment={resolved.garment} ratio="1 / 1" radius={10} showSwatches={false} />
                      )}
                    </Box>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: meta.color, mb: 0.25 }}>
                      {meta.kind === 'outfit' ? (
                        <AutoAwesomeRoundedIcon sx={{ fontSize: 15 }} />
                      ) : (
                        <CheckroomRoundedIcon sx={{ fontSize: 15 }} />
                      )}
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {meta.verb}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                      {resolved.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatEventTime(e.at)}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            )
          })}
        </Stack>
      </Box>
    </PageContainer>
  )
}
