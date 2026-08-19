import { useMemo } from 'react'
import { Button } from '@mui/material'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'

/**
 * Floating link to the *other* design of the app. Figures out which version it
 * is running as from the hostname, so the same component works on both the
 * `main` (Material) and `editorial-design` deployments with no config.
 *
 * Host pairing (material ⇄ editorial):
 *   chichik.space / www.chichik.space          ⇄  og.chichik.space
 *   orgdrobe.<sub>.workers.dev                  ⇄  orgdrobe-editorial.<sub>.workers.dev
 */
function computeOther(): { url: string; label: string } | null {
  if (typeof window === 'undefined') return null
  const host = window.location.hostname
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) return null

  const isEditorial =
    host.startsWith('og.') || host.startsWith('editorial.') || host.includes('orgdrobe-editorial')

  if (isEditorial) {
    let otherHost = 'orgdrobe.vladik38016.workers.dev'
    if (host.startsWith('og.')) otherHost = host.slice('og.'.length)
    else if (host.startsWith('editorial.')) otherHost = host.slice('editorial.'.length)
    return { url: `https://${otherHost}`, label: 'Material design' }
  }

  const base = host.replace(/^www\./, '')
  const otherHost = host.includes('orgdrobe.vladik38016')
    ? 'orgdrobe-editorial.vladik38016.workers.dev'
    : `og.${base}`
  return { url: `https://${otherHost}`, label: 'Editorial design' }
}

export function VersionSwitcher() {
  const other = useMemo(computeOther, [])
  if (!other) return null

  return (
    <Button
      href={other.url}
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
      {other.label}
    </Button>
  )
}
