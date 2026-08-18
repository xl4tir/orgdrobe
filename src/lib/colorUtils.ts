/** Tiny colour maths for building fabric-like gradients from a hex value. */

export interface RGB {
  r: number
  g: number
  b: number
}

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))

export const rgbToHex = ({ r, g, b }: RGB): string =>
  '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')

export function mix(a: string, b: string, amount: number): string {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  return rgbToHex({
    r: ca.r + (cb.r - ca.r) * amount,
    g: ca.g + (cb.g - ca.g) * amount,
    b: ca.b + (cb.b - ca.b) * amount,
  })
}

export const lighten = (hex: string, amount: number) => mix(hex, '#ffffff', amount)
export const darken = (hex: string, amount: number) => mix(hex, '#000000', amount)

/** Perceived luminance (0–1). Used to pick readable text over a swatch. */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

export const readableOn = (hex: string): string =>
  luminance(hex) > 0.62 ? 'rgba(20,17,14,0.82)' : 'rgba(255,255,255,0.92)'

/**
 * Build a soft, dimensional "fabric" gradient from one or two garment colours.
 * Layers a radial highlight over a diagonal base so flat swatches gain depth.
 */
export function fabricGradient(primary: string, secondary?: string): string {
  const base = primary
  const second = secondary ?? darken(primary, 0.22)
  const highlight = lighten(base, 0.28)
  const shade = darken(second, 0.12)
  return [
    `radial-gradient(120% 90% at 22% 14%, ${highlight}dd 0%, transparent 55%)`,
    `linear-gradient(145deg, ${base} 0%, ${mix(base, second, 0.55)} 58%, ${shade} 100%)`,
  ].join(', ')
}
