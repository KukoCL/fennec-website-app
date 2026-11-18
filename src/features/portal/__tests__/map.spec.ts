import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import type { DailyUsage } from '../api';
import { fittedViewBox, mapObservations, projectLocation } from '../map/observations';
import TelemetryLocationMap from '../TelemetryLocationMap.vue';
const observation = {
  occurredAtUtc: '2026-11-17T10:00:00Z', receivedAtUtc: '2026-11-17T10:01:00Z',
  location: { latitude: -33.45, longitude: -70.66, accuracyMeters: 0 },
};
const record: DailyUsage = {
  deviceId: 'example', date: '2026-11-17', first: observation, last: observation, totalDurationSeconds: 60,
};
describe('offline telemetry map', () => {
  it('projects known coordinates and world edges consistently', () => {
    expect(projectLocation(0, 0)).toEqual({ x: 180, y: 90 });
    expect(projectLocation(90, -180)).toEqual({ x: 0, y: 0 });
    expect(projectLocation(-90, 180)).toEqual({ x: 360, y: 180 });
  });
  it('keeps coincident first/last observations separate and filters foreign device IDs', () => {
    const points = mapObservations([record, { ...record, deviceId: 'other' }], 'example');
    expect(points).toHaveLength(2);
    expect(points.map((point) => point.boundary)).toEqual(['first', 'last']);
    expect(points[0]?.accuracyMeters).toBe(0);
    expect(points[0]?.id).not.toBe(points[1]?.id);
  });
  it('omits missing, out-of-range and non-finite positions, not zero coordinates', () => {
    expect(mapObservations([{ ...record, first: null, last: null }], 'example')).toEqual([]);
    for (const latitude of [91, NaN, Infinity]) {
      expect(mapObservations([{ ...record, first: { ...observation,
        location: { latitude, longitude: 0, accuracyMeters: 10 } }, last: null }], 'example')).toEqual([]);
    }
    const points = mapObservations([{ ...record, first: { ...observation,
      location: { latitude: 0, longitude: 0, accuracyMeters: -1 } }, last: null }], 'example');
    expect(points).toHaveLength(1); expect(points[0]?.accuracyMeters).toBeNull();
  });
  it('bounds fitting at the poles and antimeridian without an invented route', () => {
    expect(fittedViewBox([])).toBe('0 0 360 180');
    const point = mapObservations([record], 'example')[0]!;
    const fitted = fittedViewBox([{ ...point, latitude: 90, longitude: 180 }]).split(' ').map(Number);
    expect(fitted).toEqual([336, 0, 24, 12]);
    expect(fittedViewBox([{ ...point, longitude: -180 }, { ...point, longitude: 180 }]))
      .toBe('0 0 360 180');
  });
  it('renders local geometry without fetch, external images or map links and selects coincident points', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const wrapper = mount(TelemetryLocationMap, {
      props: { records: [record], deviceId: 'example' }, global: { plugins: [createPinia()] },
    });
    expect(wrapper.findAll('svg path').length).toBeGreaterThan(100);
    expect(wrapper.findAll('select option')).toHaveLength(2);
    const last = wrapper.findAll('select option')[1]!.attributes('value');
    await wrapper.find('select').setValue(last);
    expect(wrapper.find('select').element.value).toBe(last);
    expect(wrapper.text()).toContain('no una ruta continua');
    expect(wrapper.findAll('img, image, iframe, a')).toHaveLength(0);
    expect(fetchSpy).not.toHaveBeenCalled();
    await wrapper.findAll('button')[0]!.trigger('click');
    expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 360 180');
    wrapper.unmount(); fetchSpy.mockRestore();
  });
  it('shows no invented points when observations have no location', () => {
    const wrapper = mount(TelemetryLocationMap, {
      props: { records: [{ ...record, first: null, last: null }], deviceId: 'example' },
      global: { plugins: [createPinia()] },
    });
    expect(wrapper.find('[role="status"]').text()).toContain('No hay observaciones');
    expect(wrapper.find('select').exists()).toBe(false);
    wrapper.unmount();
  });
});
