export const GOOGLE_MAP_PROTOCOL = 'fennec-google-map-v1'
type GoogleMapMessage = { type: 'ready' | 'loaded' | 'error' } | { type: 'select'; index: number }
// Deliberately narrow receiver: the provider can only report state or select an existing index.
export function googleMapMessage(data: unknown, count: number): GoogleMapMessage | null {
  if (!data || typeof data !== 'object') return null
  const message = data as Record<string, unknown>
  if (message.protocol !== GOOGLE_MAP_PROTOCOL) return null
  if (message.type === 'ready' || message.type === 'loaded' || message.type === 'error') {
    return { type: message.type }
  }
  if (message.type === 'select' && typeof message.index === 'number'
    && Number.isInteger(message.index) && message.index >= 0 && message.index < count) {
    return { type: 'select', index: message.index }
  }
  return null
}
