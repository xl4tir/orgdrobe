/** Small formatting helpers shared across the app. */

const REFERENCE = new Date('2026-08-18T16:40:00').getTime()

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/** "today at 16:15", "yesterday at 09:03", "12 Aug". */
export function formatEventTime(iso: string): string {
  const d = new Date(iso)
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const dayDiff = Math.round((startOfDay(REFERENCE) - startOfDay(d.getTime())) / 86_400_000)
  if (dayDiff === 0) return `today at ${time}`
  if (dayDiff === 1) return `yesterday at ${time}`
  if (dayDiff < 7) return `${dayDiff} days ago at ${time}`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/** "3 days ago", "2 months ago" — coarse relative label. */
export function fromNow(iso: string | null): string {
  if (!iso) return 'never worn'
  const diffDays = Math.round((new Date(iso).getTime() - REFERENCE) / 86_400_000)
  if (diffDays === 0) return 'today'
  if (diffDays > -7) return rtf.format(diffDays, 'day')
  if (diffDays > -60) return rtf.format(Math.round(diffDays / 7), 'week')
  return rtf.format(Math.round(diffDays / 30), 'month')
}

function startOfDay(ms: number): number {
  const d = new Date(ms)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export const pluralize = (n: number, singular: string, plural = `${singular}s`) =>
  `${n} ${n === 1 ? singular : plural}`

export const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
