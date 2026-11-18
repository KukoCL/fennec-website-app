import { describe, expect, it } from 'vitest'
import { formatDuration, formatTimestamp, presetRange, rangeError } from '../dates'

describe('telemetry date filters', () => {
  const now = new Date('2026-03-01T00:30:00Z')
  it('uses inclusive UTC presets across months and leap years', () => {
    expect(presetRange('today', now)).toEqual({ from: '2026-03-01', to: '2026-03-01' })
    expect(presetRange('yesterday', now)).toEqual({ from: '2026-02-28', to: '2026-02-28' })
    expect(presetRange('week', now)).toEqual({ from: '2026-02-23', to: '2026-03-01' })
    expect(presetRange('month', now)).toEqual({ from: '2026-01-31', to: '2026-03-01' })
  })
  it('rejects invalid, reversed, missing and oversized ranges', () => {
    expect(rangeError({ from: '2026-02-30', to: '2026-03-01' })).toBe('invalidRange')
    expect(rangeError({ from: '', to: '2026-03-01' })).toBe('invalidRange')
    expect(rangeError({ from: '2026-03-02', to: '2026-03-01' })).toBe('invalidRange')
    expect(rangeError({ from: '2024-01-01', to: '2025-01-01' })).toBe('rangeLimit')
    expect(rangeError({ from: '2026-03-01', to: '2026-03-01' })).toBeNull()
  })
  it('shows cumulative hours without wrapping after 24 hours', () => {
    expect(formatDuration(90_900)).toBe('25 h 15 min')
    expect(formatDuration(0)).toBe('0 h 00 min')
    expect(formatDuration(-1)).toBe('0 h 00 min')
  })
  it('does not invent missing timestamps', () => {
    expect(formatTimestamp(null, 'es-CL', 'N/A')).toBe('N/A')
    expect(formatTimestamp('invalid', 'es-CL', 'N/A')).toBe('N/A')
  })
})
