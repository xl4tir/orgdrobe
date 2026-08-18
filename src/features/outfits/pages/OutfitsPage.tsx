import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Chip, Stack } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CasinoRoundedIcon from '@mui/icons-material/CasinoRounded'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SearchBar } from '@/components/ui/SearchBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { ALL_SEASONS, SEASON_EMOJI, SEASON_LABELS } from '@/lib/catalog'
import { pluralize } from '@/lib/format'
import { useOutfitStore, applyOutfitFilters } from '../store'
import { OutfitGrid } from '../components/OutfitGrid'

export function OutfitsPage() {
  const navigate = useNavigate()
  const outfits = useOutfitStore((s) => s.outfits)
  const filters = useOutfitStore((s) => s.filters)
  const setSearch = useOutfitStore((s) => s.setSearch)
  const toggleSeason = useOutfitStore((s) => s.toggleSeason)
  const addOutfit = useOutfitStore((s) => s.addOutfit)

  const list = useMemo(() => applyOutfitFilters(outfits, filters), [outfits, filters])

  const surprise = () => {
    if (!outfits.length) return
    const idx = Math.floor((Date.now() / 1000) % outfits.length)
    navigate(`/app/outfits/${outfits[idx].id}`)
  }

  const createOutfit = () => {
    const id = addOutfit()
    navigate(`/app/outfits/${id}`)
  }

  return (
    <PageContainer>
      <SectionHeader
        overline="Craft & wear"
        title="Outfits"
        subtitle="Combinations you’ve built from your wardrobe. Mix, remix, or let chance decide."
        action={
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" color="inherit" startIcon={<CasinoRoundedIcon />} onClick={surprise}>
              Surprise me
            </Button>
            <Button variant="contained" size="large" startIcon={<AddRoundedIcon />} onClick={createOutfit}>
              New outfit
            </Button>
          </Stack>
        }
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }} alignItems="center">
        <SearchBar
          placeholder="Search outfits…"
          value={filters.search}
          onValueChange={setSearch}
          sx={{ flex: 1, width: '100%' }}
        />
        <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }} flexWrap="wrap" useFlexGap>
          {ALL_SEASONS.map((s) => {
            const active = filters.seasons.includes(s)
            return (
              <Chip
                key={s}
                label={`${SEASON_EMOJI[s]} ${SEASON_LABELS[s]}`}
                onClick={() => toggleSeason(s)}
                color={active ? 'secondary' : 'default'}
                variant={active ? 'filled' : 'outlined'}
              />
            )
          })}
        </Stack>
      </Stack>

      {list.length > 0 ? (
        <>
          <Stack sx={{ mb: 2, color: 'text.secondary', fontSize: 14 }}>{pluralize(list.length, 'outfit')}</Stack>
          <OutfitGrid outfits={list} />
        </>
      ) : (
        <EmptyState
          emoji="🪄"
          title="No outfits here yet"
          description="Start crafting outfits from the pieces in your wardrobe."
          actionLabel="New outfit"
          onAction={createOutfit}
        />
      )}
    </PageContainer>
  )
}
