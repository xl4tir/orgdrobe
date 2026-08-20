/** Shared date helper for the demo dataset (garments split across part files). */
export const now = new Date('2026-08-18T16:40:00')

export const daysAgo = (d: number, h = 0, m = 0): string => {
  const date = new Date(now)
  date.setDate(date.getDate() - d)
  date.setHours(h, m, 0, 0)
  return date.toISOString()
}
