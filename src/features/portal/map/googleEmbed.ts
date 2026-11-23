// Public browser key only, restricted to Maps Embed API + approved website origins.
// Do not include device IDs, timestamps, session tokens or credentials in this URL.
export function googleEmbedUrl(point: { latitude: number; longitude: number }, key: string, language: string): string {
  if (
    !key.trim() ||
    !Number.isFinite(point.latitude) ||
    !Number.isFinite(point.longitude) ||
    Math.abs(point.latitude) > 90 ||
    Math.abs(point.longitude) > 180
  )
    return ''
  const query = new URLSearchParams({
    key: key.trim(),
    q: `${point.latitude},${point.longitude}`,
    zoom: '14',
    maptype: 'roadmap',
    language: language === 'en' ? 'en' : 'es',
  })
  return `https://www.google.com/maps/embed/v1/place?${query}`
}
