import { Button, Tooltip } from '@mui/material'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import { useColorMode } from '@/theme/ColorModeContext'

/**
 * Floating toggle between the two design languages of the app — Material and
 * Editorial — both served from the same build. Persists via the theme context.
 */
export function VersionSwitcher() {
  const { design, toggleDesign } = useColorMode()
  const other = design === 'material' ? 'Editorial' : 'Material'

  return (
    <Tooltip title={`Switch to the ${other} design`}>
      <Button
        onClick={toggleDesign}
        variant="contained"
        color="primary"
        size="small"
        startIcon={<SwapHorizRoundedIcon />}
        sx={{
          position: 'fixed',
          bottom: { xs: 76, md: 20 },
          right: 20,
          zIndex: (t) => t.zIndex.tooltip + 1,
          borderRadius: 999,
          boxShadow: 6,
          textTransform: 'none',
        }}
      >
        {other} design
      </Button>
    </Tooltip>
  )
}
