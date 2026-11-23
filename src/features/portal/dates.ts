export type DatePreset = 'today' | 'yesterday' | 'week' | 'month' | 'custom'
export type DateRange = { from: string; to: string }

export function utcDate(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}
export function presetRange(preset: Exclude<DatePreset, 'custom'>, now = new Date()): DateRange {
  const end = new Date(`${utcDate(now)}T00:00:00Z`)
  if (preset === 'yesterday') end.setUTCDate(end.getUTCDate() - 1)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (preset === 'week' ? 6 : preset === 'month' ? 29 : 0))
  return { from: utcDate(start), to: utcDate(end) }
}
export function rangeError(range: DateRange): 'invalidRange' | 'rangeLimit' | null {
  const valid = (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
    utcDate(new Date(`${value}T00:00:00Z`)) === value
  if (!valid(range.from) || !valid(range.to) || range.from > range.to) return 'invalidRange'
  if ((Date.parse(range.to) - Date.parse(range.from)) / 86_400_000 + 1 > 90) return 'rangeLimit'
  return null
}
export function formatDuration(seconds: number): string {
  const totalMinutes = Math.floor(Math.max(0, seconds) / 60)
  return `${Math.floor(totalMinutes / 60)} h ${String(totalMinutes % 60).padStart(2, '0')} min`
}
export function formatTimestamp(value: string | null | undefined, locale: string, fallback: string): string {
  if (!value || Number.isNaN(Date.parse(value))) return fallback
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(value))
}
