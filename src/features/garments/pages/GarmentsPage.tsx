import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Badge, Box, Button, Stack } from '@mui/material'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SearchBar } from '@/components/ui/SearchBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { pluralize } from '@/lib/format'
import { useGarmentStore, applyGarmentFilters, countActiveFilters } from '../store'
import { FiltersPanel } from '../components/FiltersPanel'
import { GarmentGrid } from '../components/GarmentGrid'
import { AddGarmentDialog } from '../components/AddGarmentDialog'

export function GarmentsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const garments = useGarmentStore((s) => s.garments)
  const filters = useGarmentStore((s) => s.filters)
  const setSearch = useGarmentStore((s) => s.setSearch)
  const resetFilters = useGarmentStore((s) => s.resetFilters)

  const list = useMemo(() => applyGarmentFilters(garments, filters), [garments, filters])
  const activeCount = countActiveFilters(filters)

  // Open the dialog when arriving via the sidebar's "?add=1" link.
  useEffect(() => {
    if (searchParams.get('add') === '1') setAddOpen(true)
  }, [searchParams])

  const handleClose = () => {
    setAddOpen(false)
    if (searchParams.has('add')) {
      searchParams.delete('add')
      setSearchParams(searchParams, { replace: true })
    }
  }

  return (
    <PageContainer>
      <SectionHeader
        overline="Your wardrobe"
        title="Garments"
        subtitle="Everything you own, in one place. Search, filter and rediscover."
        action={
          <Button
            variant="contained"
            size="large"
            startIcon={<AddRoundedIcon />}
            onClick={() => setAddOpen(true)}
          >
            Add garment
          </Button>
        }
      />

      <InfoBanner
        icon={<InfoRoundedIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        Recommendations may be incomplete — some garments are still being analysed.
      </InfoBanner>

      <Stack direction="row" spacing={1.5} sx={{ mb: showFilters ? 2.5 : 3 }}>
        <SearchBar
          placeholder="Quick search…"
          value={filters.search}
          onValueChange={setSearch}
        />
        <Badge badgeContent={activeCount} color="secondary" overlap="circular">
          <Button
            variant={showFilters ? 'contained' : 'outlined'}
            color={showFilters ? 'primary' : 'inherit'}
            startIcon={<TuneRoundedIcon />}
            onClick={() => setShowFilters((v) => !v)}
            sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Filters
          </Button>
        </Badge>
      </Stack>

      <FiltersPanel open={showFilters} />

      <Box sx={{ mb: 2, color: 'text.secondary', fontSize: 14 }}>
        {pluralize(list.length, 'garment')}
      </Box>

      {list.length > 0 ? (
        <GarmentGrid garments={list} />
      ) : (
        <EmptyState
          emoji="🔍"
          title="Nothing matches yet"
          description="Try clearing a filter or two, or add a new garment to your wardrobe."
          actionLabel="Reset filters"
          onAction={resetFilters}
        />
      )}

      <AddGarmentDialog open={addOpen} onClose={handleClose} />
    </PageContainer>
  )
}
