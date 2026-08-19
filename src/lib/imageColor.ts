import { COLORS } from './colors'
import { hexToRgb } from './colorUtils'

const catalogRgb = COLORS.map((c) => ({ id: c.id, ...hexToRgb(c.hex) }))

/** Nearest catalogue colour id to an arbitrary rgb triple (squared distance). */
function nearestFromRgb(r: number, g: number, b: number): string {
  let bestId = catalogRgb[0].id
  let bestD = Infinity
  for (const c of catalogRgb) {
    const d = (c.r - r) ** 2 + (c.g - g) ** 2 + (c.b - b) ** 2
    if (d < bestD) {
      bestD = d
      bestId = c.id
    }
  }
  return bestId
}

/** Map a hex colour (e.g. from the eyedropper) to the closest catalogue colour id. */
export function nearestColorId(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  return nearestFromRgb(r, g, b)
}

/**
 * Analyse an uploaded image (data URL) and return the most prominent catalogue
 * colours, ranked by area. Every pixel is snapped to its nearest catalogue
 * colour and tallied, so the result is always valid palette ids.
 */
export function detectCatalogColors(src: string, count = 3): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const size = 56
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return resolve([])
      ctx.drawImage(img, 0, 0, size, size)

      let data: Uint8ClampedArray
      try {
        data = ctx.getImageData(0, 0, size, size).data
      } catch {
        return resolve([]) // canvas tainted (remote image) — skip silently
      }

      const tally = new Map<string, number>()
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 125) continue // skip transparent
        const id = nearestFromRgb(data[i], data[i + 1], data[i + 2])
        tally.set(id, (tally.get(id) ?? 0) + 1)
      }

      const ranked = [...tally.entries()].sort((a, b) => b[1] - a[1]).map((e) => e[0])
      resolve(ranked.slice(0, count))
    }
    img.onerror = () => resolve([])
    img.src = src
  })
}

/** Whether the native EyeDropper API is available (Chromium browsers). */
export const eyedropperSupported = (): boolean =>
  typeof window !== 'undefined' && 'EyeDropper' in window
