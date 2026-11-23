import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import type { DailyUsage } from '../api'
import { fittedViewBox, mapObservations, projectLocation } from '../map/observations'
import TelemetryLocationMap from '../TelemetryLocationMap.vue'
import { googleMapMessage, GOOGLE_MAP_PROTOCOL } from '../map/googleFrame'
import { useAppSettingsStore } from '@/stores/appSettingsStore'
const observation = {
  occurredAtUtc: '2026-11-17T10:00:00Z',
  receivedAtUtc: '2026-11-17T10:01:00Z',
  location: { latitude: -33.45, longitude: -70.66, accuracyMeters: 0 },
}
const record: DailyUsage = {
  deviceId: 'example',
  date: '2026-11-17',
  first: observation,
  last: observation,
  totalDurationSeconds: 60,
}
describe('offline telemetry map', () => {
  it('projects known coordinates and world edges consistently', () => {
    expect(projectLocation(0, 0)).toEqual({ x: 180, y: 90 })
    expect(projectLocation(90, -180)).toEqual({ x: 0, y: 0 })
    expect(projectLocation(-90, 180)).toEqual({ x: 360, y: 180 })
  })
  it('keeps coincident first/last observations separate and filters foreign device IDs', () => {
    const points = mapObservations([record, { ...record, deviceId: 'other' }], 'example')
    expect(points).toHaveLength(2)
    expect(points.map((point) => point.boundary)).toEqual(['first', 'last'])
    expect(points[0]?.accuracyMeters).toBe(0)
    expect(points[0]?.id).not.toBe(points[1]?.id)
  })
  it('omits missing, out-of-range and non-finite positions, not zero coordinates', () => {
    expect(mapObservations([{ ...record, first: null, last: null }], 'example')).toEqual([])
    for (const latitude of [91, NaN, Infinity]) {
      expect(
        mapObservations(
          [
            {
              ...record,
              first: { ...observation, location: { latitude, longitude: 0, accuracyMeters: 10 } },
              last: null,
            },
          ],
          'example',
        ),
      ).toEqual([])
    }
    const points = mapObservations(
      [
        {
          ...record,
          first: { ...observation, location: { latitude: 0, longitude: 0, accuracyMeters: -1 } },
          last: null,
        },
      ],
      'example',
    )
    expect(points).toHaveLength(1)
    expect(points[0]?.accuracyMeters).toBeNull()
  })
  it('bounds fitting at the poles and antimeridian without an invented route', () => {
    expect(fittedViewBox([])).toBe('0 0 360 180')
    const point = mapObservations([record], 'example')[0]!
    const fitted = fittedViewBox([{ ...point, latitude: 90, longitude: 180 }])
      .split(' ')
      .map(Number)
    expect(fitted).toEqual([336, 0, 24, 12])
    expect(
      fittedViewBox([
        { ...point, longitude: -180 },
        { ...point, longitude: 180 },
      ]),
    ).toBe('0 0 360 180')
  })
  it('renders local geometry without fetch, external images or map links and selects coincident points', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const wrapper = mount(TelemetryLocationMap, {
      props: { records: [record], deviceId: 'example' },
      global: { plugins: [createPinia()] },
    })
    expect(wrapper.findAll('svg path').length).toBeGreaterThan(100)
    expect(wrapper.findAll('select option')).toHaveLength(2)
    const last = wrapper.findAll('select option')[1]!.attributes('value')
    await wrapper.find('select').setValue(last)
    expect(wrapper.find('select').element.value).toBe(last)
    expect(wrapper.text()).toContain('no una ruta continua')
    expect(wrapper.findAll('img, image, iframe, a')).toHaveLength(0)
    expect(fetchSpy).not.toHaveBeenCalled()
    await wrapper.findAll('button')[0]!.trigger('click')
    expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 360 180')
    wrapper.unmount()
    fetchSpy.mockRestore()
  })
  it('shows no invented points when observations have no location', () => {
    const wrapper = mount(TelemetryLocationMap, {
      props: { records: [{ ...record, first: null, last: null }], deviceId: 'example' },
      global: { plugins: [createPinia()] },
    })
    expect(wrapper.find('[role="status"]').text()).toContain('No hay observaciones')
    expect(wrapper.find('select').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('optional multipoint Google Maps', () => {
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.useRealTimers() })
  function setup(records = [record]) {
    const pinia = createPinia()
    const wrapper = mount(TelemetryLocationMap, {
      props: { records, deviceId: 'example' },
      global: { plugins: [pinia] },
      attachTo: document.body,
    })
    return { wrapper, settings: useAppSettingsStore(pinia) }
  }
  function providerMessage(wrapper: ReturnType<typeof setup>['wrapper'], data: object, origin = 'null',
    source: MessageEventSource | null = wrapper.find('iframe').element.contentWindow) {
    window.dispatchEvent(new MessageEvent('message', {
      source, origin, data: { protocol: GOOGLE_MAP_PROTOCOL, ...data },
    }))
  }
  it('accepts only protocol states and an existing integer observation index', () => {
    for (const data of [null, 'ready', {}, { type: 'ready' }, { protocol: GOOGLE_MAP_PROTOCOL, type: 'fetch' },
      { protocol: GOOGLE_MAP_PROTOCOL, type: 'select', index: -1 },
      { protocol: GOOGLE_MAP_PROTOCOL, type: 'select', index: 2 },
      { protocol: GOOGLE_MAP_PROTOCOL, type: 'select', index: 0.5 }]) {
      expect(googleMapMessage(data, 2)).toBeNull()
    }
    expect(googleMapMessage({ protocol: GOOGLE_MAP_PROTOCOL, type: 'select', index: 1 }, 2))
      .toEqual({ type: 'select', index: 1 })
  })
  it('never loads Google without configuration and keeps the local fallback', () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '')
    const { wrapper } = setup()
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('[data-test="map-google"]').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).toContain('falta configurar')
    wrapper.unmount()
  })
  it('requires consent for all displayed points and isolates Google from the authenticated realm', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'public-test-key')
    const another = { ...observation, location: { latitude: 10, longitude: 20, accuracyMeters: 10 } }
    const { wrapper, settings } = setup([{ ...record, last: another }])
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('script[src*="google"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('TODOS los puntos')
    await wrapper.find('[data-test="map-google"]').trigger('click')
    const frame = wrapper.find('iframe')
    expect(frame.attributes('sandbox')).toBe('allow-scripts')
    expect(frame.attributes('referrerpolicy')).toBe('strict-origin-when-cross-origin')
    expect(frame.attributes('src')).toBe('/telemetry-google-map.html')
    expect(frame.attributes('srcdoc')).toBeUndefined()
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.findAll('.map-actions button').every((button) => button.attributes('disabled') !== undefined))
      .toBe(true)
    const post = vi.spyOn(frame.element.contentWindow!, 'postMessage')
    providerMessage(wrapper, { type: 'ready' }, 'https://attacker.test')
    providerMessage(wrapper, { type: 'ready' }, 'null', window)
    expect(post).not.toHaveBeenCalled()
    providerMessage(wrapper, { type: 'ready' })
    expect(post).toHaveBeenCalledWith({ protocol: GOOGLE_MAP_PROTOCOL, type: 'init', key: 'public-test-key',
      language: 'es', points: [{ lat: -33.45, lng: -70.66 }, { lat: 10, lng: 20 }], selected: 0 }, '*')
    const count = post.mock.calls.length
    providerMessage(wrapper, { type: 'ready' })
    expect(post).toHaveBeenCalledTimes(count)
    const sent = JSON.stringify(post.mock.calls)
    expect(sent).not.toContain('example')
    expect(sent).not.toContain('2026-11')
    providerMessage(wrapper, { type: 'loaded' })
    await flushPromises()
    expect(wrapper.text()).not.toContain('Cargando Google')
    expect(wrapper.findAll('.map-actions button').every((button) => button.attributes('disabled') === undefined))
      .toBe(true)
    await wrapper.find('select').setValue(wrapper.findAll('option')[1]!.attributes('value'))
    expect(post).toHaveBeenLastCalledWith({ protocol: GOOGLE_MAP_PROTOCOL, type: 'select', index: 1 }, '*')
    const current = wrapper.find('select').element.value
    providerMessage(wrapper, { type: 'select', index: -1 })
    providerMessage(wrapper, { type: 'select', index: 0 }, 'https://attacker.test')
    await flushPromises()
    expect(wrapper.find('select').element.value).toBe(current)
    providerMessage(wrapper, { type: 'select', index: 0 })
    await flushPromises()
    expect(wrapper.find('select').element.value).toBe(wrapper.findAll('option')[0]!.attributes('value'))
    const buttons = wrapper.findAll('.map-actions button')
    await buttons[0]!.trigger('click')
    expect(post).toHaveBeenLastCalledWith({ protocol: GOOGLE_MAP_PROTOCOL, type: 'world' }, '*')
    await buttons[1]!.trigger('click')
    expect(post).toHaveBeenLastCalledWith({ protocol: GOOGLE_MAP_PROTOCOL, type: 'fit' }, '*')
    settings.appLanguage = 'en'
    await flushPromises()
    expect(wrapper.find('iframe').element).toBe(frame.element)
    await wrapper.find('[data-test="map-local"]').trigger('click')
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(document.activeElement).toBe(wrapper.find('[data-test="map-google"]').element)
    await wrapper.find('[data-test="map-google"]').trigger('click')
    await wrapper.setProps({ records: [{ ...record, date: '2026-11-18' }] })
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)
    wrapper.unmount()
  })
  it('resets consent for device changes, invalid data, failures and a frame that never answers', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'public-test-key')
    vi.useFakeTimers()
    const clear = vi.spyOn(globalThis, 'clearTimeout')
    const schedule = vi.spyOn(globalThis, 'setTimeout')
    const { wrapper } = setup()
    await wrapper.find('[data-test="map-google"]').trigger('click')
    await wrapper.setProps({ deviceId: 'different' })
    expect(wrapper.find('iframe').exists()).toBe(false)
    await wrapper.setProps({ deviceId: 'example' })
    await wrapper.find('[data-test="map-google"]').trigger('click')
    providerMessage(wrapper, { type: 'error' })
    await flushPromises()
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('[role="alert"]').text()).toContain('no pudo cargar')
    await wrapper.find('[data-test="map-google"]').trigger('click')
    await vi.advanceTimersByTimeAsync(25_000)
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)
    await wrapper.find('[data-test="map-google"]').trigger('click')
    const timerIndex = schedule.mock.calls.map((args) => args[1]).lastIndexOf(25_000)
    const timer = schedule.mock.results[timerIndex]!.value
    await wrapper.setProps({ records: [{ ...record, first: null, last: null }] })
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('select').exists()).toBe(false)
    wrapper.unmount()
    expect(clear).toHaveBeenCalledWith(timer)
  })
})
