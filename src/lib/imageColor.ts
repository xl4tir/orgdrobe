import { hexToRgb, rgbToHex } from './colorUtils'

/** Whether the native EyeDropper API is available (Chromium browsers). */
export const eyedropperSupported = (): boolean =>
  typeof window !== 'undefined' && 'EyeDropper' in window

const dist2 = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) =>
  (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2

/**
 * Analyse an uploaded image (data URL) and return its most prominent colours as
 * real hex values — millions possible, not snapped to any preset palette.
 * Samples the central region (to favour the garment over the background),
 * buckets similar colours, and returns the top `count` distinct averages.
 */
export function detectDominantColors(src: string, count = 3): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const size = 64
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
        return resolve([]) // tainted canvas
      }

      // Bucket by coarse quantisation, tracking the running average of each bucket.
      const buckets = new Map<string, { r: number; g: number; b: number; n: number }>()
      const lo = Math.round(size * 0.15)
      const hi = Math.round(size * 0.85)
      for (let y = lo; y < hi; y++) {
        for (let x = lo; x < hi; x++) {
          const i = (y * size + x) * 4
          if (data[i + 3] < 125) continue
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const key = `${r >> 5}-${g >> 5}-${b >> 5}` // 8 levels/channel
          const e = buckets.get(key)
          if (e) {
            e.r += r
            e.g += g
            e.b += b
            e.n += 1
          } else {
            buckets.set(key, { r, g, b, n: 1 })
          }
        }
      }

      const ranked = [...buckets.values()]
        .map((e) => ({ r: e.r / e.n, g: e.g / e.n, b: e.b / e.n, n: e.n }))
        .sort((a, b) => b.n - a.n)

      // Greedily keep the most common colours that are visually distinct.
      const picked: { r: number; g: number; b: number }[] = []
      for (const c of ranked) {
        if (picked.every((p) => dist2(p, c) > 900)) picked.push(c)
        if (picked.length >= count) break
      }

      resolve(picked.map((c) => rgbToHex({ r: c.r, g: c.g, b: c.b })))
    }
    img.onerror = () => resolve([])
    img.src = src
  })
}

/** Normalise an eyedropper result to a #rrggbb string. */
export const normalizeHex = (hex: string): string => rgbToHex(hexToRgb(hex))
