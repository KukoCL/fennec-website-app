import type { DailyUsage } from '../api';
export interface MapObservation {
  id: string;
  boundary: 'first' | 'last';
  date: string;
  occurredAtUtc: string;
  receivedAtUtc: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number | null;
}
export function projectLocation(latitude: number, longitude: number): { x: number; y: number } {
  return { x: longitude + 180, y: 90 - latitude };
}
export function mapObservations(records: DailyUsage[], deviceId: string): MapObservation[] {
  return records.flatMap((record, index) => {
    if (record.deviceId !== deviceId) return [];
    return (['first', 'last'] as const).flatMap((boundary) => {
      const observation = record[boundary];
      const location = observation?.location;
      if (!observation || !location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)
        || Math.abs(location.latitude) > 90 || Math.abs(location.longitude) > 180) return [];
      return [{
        id: `${record.date}-${boundary}-${index}`, boundary, date: record.date,
        occurredAtUtc: observation.occurredAtUtc, receivedAtUtc: observation.receivedAtUtc,
        latitude: location.latitude, longitude: location.longitude,
        accuracyMeters: typeof location.accuracyMeters === 'number'
          && Number.isFinite(location.accuracyMeters) && location.accuracyMeters >= 0 ? location.accuracyMeters : null,
      }];
    });
  });
}
export function fittedViewBox(points: MapObservation[]): string {
  if (!points.length) return '0 0 360 180';
  const projected = points.map((point) => projectLocation(point.latitude, point.longitude));
  const minX = Math.min(...projected.map((point) => point.x));
  const maxX = Math.max(...projected.map((point) => point.x));
  const minY = Math.min(...projected.map((point) => point.y));
  const maxY = Math.max(...projected.map((point) => point.y));
  // Keep a broad reference scale. A coarse basemap cannot provide street-level detail.
  const height = Math.min(180, Math.max(12, (maxY - minY) * 1.35, (maxX - minX) * 1.35 / 2));
  const width = height * 2;
  const x = Math.max(0, Math.min(360 - width, (minX + maxX - width) / 2));
  const y = Math.max(0, Math.min(180 - height, (minY + maxY - height) / 2));
  return `${x} ${y} ${width} ${height}`;
}
