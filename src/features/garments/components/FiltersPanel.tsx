import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import { motion } from 'framer-motion'
import { COLORS } from '@/lib/colors'
import { CATEGORY_LABELS, CATEGORY_ORDER, ALL_SEASONS, SEASON_LABELS, SEASON_EMOJI } from '@/lib/catalog'
import { readableOn } from '@/lib/colorUtils'
import { useGarmentStore, type GarmentSort } from '../store'

const SORT_OPTIONS: { value: GarmentSort; label: string }[] = [
  { value: 'recent', label: 'Newest' },
  { value: 'most-worn', label: 'Most worn' },
  { value: 'least-worn', label: 'Least worn' },
  { value: 'name', label: 'A–Z' },
]

function FieldLabel({ children }: { children: string }) {
  return (
    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {children}
    </Typography>
  )
}

export function FiltersPanel({ open }: { open: boolean }) {
  const filters = useGarmentStore((s) => s.filters)
  const toggleCategory = useGarmentStore((s) => s.toggleCategory)
  const toggleColor = useGarmentStore((s) => s.toggleColor)
  const toggleSeason = useGarmentStore((s) => s.toggleSeason)
  const setSort = useGarmentStore((s) => s.setSort)
  const resetFilters = useGarmentStore((s) => s.resetFilters)

  return (
    <Collapse in={open} unmountOnExit>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        variant="outlined"
        sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 4 }}
      >
        <Stack spacing={3}>
          <Box>
            <FieldLabel>Category</FieldLabel>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {CATEGORY_ORDER.map((cat) => {
                const active = filters.categories.includes(cat)
                return (
                  <Chip
                    key={cat}
                    label={CATEGORY_LABELS[cat]}
                    onClick={() => toggleCategory(cat)}
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                  />
                )
              })}
            </Stack>
          </Box>

          <Box>
            <FieldLabel>Colour</FieldLabel>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {COLORS.map((c) => {
                const active = filters.colors.includes(c.id)
                return (
                  <Tooltip key={c.id} title={c.name}>
                    <Box
                      component="button"
                      onClick={() => toggleColor(c.id)}
                      aria-label={c.name}
                      aria-pressed={active}
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        p: 0,
                        backgroundColor: c.hex,
                        border: 'none',
                        outline: active
                          ? (t) => `2.5px solid ${t.palette.primary.main}`
                          : '2.5px solid transparent',
                        outlineOffset: 2,
                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
                        display: 'grid',
                        placeItems: 'center',
                        color: readableOn(c.hex),
                        fontSize: 14,
                        transition: 'transform .18s',
                        '&:hover': { transform: 'scale(1.12)' },
                      }}
                    >
                      {active ? '✓' : ''}
                    </Box>
                  </Tooltip>
                )
              })}
            </Stack>
          </Box>

          <Box>
            <FieldLabel>Season</FieldLabel>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {ALL_SEASONS.map((s) => {
                const active = filters.seasons.includes(s)
                return (
                  <Chip
                    key={s}
                    label={`${SEASON_EMOJI[s]}  ${SEASON_LABELS[s]}`}
                    onClick={() => toggleSeason(s)}
                    color={active ? 'secondary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                  />
                )
              })}
            </Stack>
          </Box>

          <Divider />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Box>
              <FieldLabel>Sort by</FieldLabel>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={filters.sort}
                onChange={(_, v) => v && setSort(v)}
                sx={{ flexWrap: 'wrap' }}
              >
                {SORT_OPTIONS.map((o) => (
                  <ToggleButton key={o.value} value={o.value} sx={{ px: 1.75, borderRadius: 999 }}>
                    {o.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
            <Button
              startIcon={<RestartAltRoundedIcon />}
              onClick={resetFilters}
              color="inherit"
              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
            >
              Reset filters
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Collapse>
  )
}
