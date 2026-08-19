import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { alpha, Box, Card, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { OutfitVisual } from '@/components/ui/OutfitVisual'
import { useGarmentStore } from '@/features/garments/store'
import { useOutfitStore } from '@/features/outfits/store'

const REFERENCE = new Date('2026-08-18T12:00:00')
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

export function CalendarPage() {
  const navigate = useNavigate()
  const outfits = useOutfitStore((s) => s.outfits)
  const garments = useGarmentStore((s) => s.garments)
  const [selected, setSelected] = useState<string>(dayKey(REFERENCE))

  const year = REFERENCE.getFullYear()
  const month = REFERENCE.getMonth()

  /** Map day-key -> outfits worn that day (from each outfit's lastWorn). */
  const wornByDay = useMemo(() => {
    const map = new Map<string, typeof outfits>()
    for (const o of outfits) {
      if (!o.lastWorn) continue
      const d = new Date(o.lastWorn)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = dayKey(d)
        map.set(key, [...(map.get(key) ?? []), o])
      }
    }
    return map
  }, [outfits, year, month])

  const cells = useMemo(() => {
    const first = new Date(year, month, 1)
    const startOffset = (first.getDay() + 6) % 7 // make Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const list: (Date | null)[] = []
    for (let i = 0; i < startOffset; i++) list.push(null)
    for (let d = 1; d <= daysInMonth; d++) list.push(new Date(year, month, d))
    return list
  }, [year, month])

  const selectedOutfits = wornByDay.get(selected) ?? []
  const resolveGarments = (ids: string[]) =>
    ids.map((id) => garments.find((g) => g.id === id)).filter((g): g is NonNullable<typeof g> => Boolean(g))

  const monthLabel = REFERENCE.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <PageContainer maxWidth="md">
      <SectionHeader overline="History" title="Calendar" subtitle={`What you wore across ${monthLabel}.`} />

      <Card sx={{ p: { xs: 1.5, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          {monthLabel}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
          {WEEKDAYS.map((w) => (
            <Typography key={w} variant="caption" color="text.secondary" sx={{ textAlign: 'center', fontWeight: 700 }}>
              {w}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
          {cells.map((date, i) => {
            if (!date) return <Box key={`e${i}`} />
            const key = dayKey(date)
            const worn = wornByDay.get(key)
            const isToday = key === dayKey(REFERENCE)
            const isSelected = key === selected
            return (
              <Box
                key={key}
                component={motion.button}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelected(key)}
                sx={{
                  aspectRatio: '1 / 1',
                  borderRadius: 2.5,
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  bgcolor: isSelected
                    ? 'primary.main'
                    : worn
                      ? (t) => alpha(t.palette.primary.main, t.palette.mode === 'light' ? 0.1 : 0.2)
                      : 'transparent',
                  color: isSelected ? 'primary.contrastText' : 'text.primary',
                  transition: 'background-color .2s',
                  '&:hover': { bgcolor: isSelected ? 'primary.dark' : 'action.hover' },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: isToday ? 800 : 600, textDecoration: isToday ? 'underline' : 'none' }}
                >
                  {date.getDate()}
                </Typography>
                {worn && (
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      bgcolor: isSelected ? 'primary.contrastText' : 'secondary.main',
                    }}
                  />
                )}
              </Box>
            )
          })}
        </Box>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>
        {new Date(selected.split('-').map(Number)[0], selected.split('-').map(Number)[1], selected.split('-').map(Number)[2]).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
      </Typography>

      {selectedOutfits.length ? (
        <Stack spacing={2}>
          {selectedOutfits.map((o) => (
            <Card
              key={o.id}
              onClick={() => navigate(`/app/outfits/${o.id}`)}
              sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', cursor: 'pointer', '&:hover': { boxShadow: (t) => t.shadows[3] } }}
            >
              <Box sx={{ width: 72, flexShrink: 0 }}>
                <OutfitVisual garments={resolveGarments(o.garmentIds)} layout={o.layout} ratio="1 / 1" />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {o.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {o.description}
                </Typography>
              </Box>
            </Card>
          ))}
        </Stack>
      ) : (
        <EmptyState emoji="🗓️" title="Nothing logged this day" description="Wear an outfit and it’ll show up here." />
      )}
    </PageContainer>
  )
}
