import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { afterEach, describe, expect, it, vi } from 'vitest'

const source = readFileSync('public/telemetry-google-map.js', 'utf8')
const origin = 'https://telemetry.example.test'
const protocol = 'fennec-google-map-v1'
const points = [
  { lat: 10, lng: 20 },
  { lat: 10, lng: 20 },
  { lat: 30, lng: 40 },
]
const init = { type: 'init', key: 'fixture-key', language: 'es', points, selected: 0 }

function boot({ opaque = true, standalone = false } = {}) {
  const frameDocument = document.implementation.createHTMLDocument()
  const mapNode = frameDocument.createElement('div')
  mapNode.id = 'map'
  frameDocument.body.append(mapNode)
  const postMessage = vi.fn()
  const parent = { postMessage }
  let listener: ((event: { source: unknown; origin: string; data: unknown }) => void) | undefined
  const window = {
    parent: parent as unknown,
    origin: opaque ? 'null' : origin,
    location: { href: origin + '/telemetry-google-map.html' },
    addEventListener: (_type: string, handler: typeof listener) => {
      listener = handler
    },
    fennecMapReady: undefined as (() => void) | undefined,
    gm_authFailure: undefined as (() => void) | undefined,
  }
  if (standalone) window.parent = window
  const setCenter = vi.fn()
  const setZoom = vi.fn()
  const extend = vi.fn()
  const fitBounds = vi.fn()
  const initialize = vi.fn()
  const project = vi.fn(({ lat, lng }: (typeof points)[number]) => ({ x: lat, y: lng }))
  const stopMapGesture = vi.fn()
  let idle: (() => void) | undefined
  const google = {
    maps: {
      Map: class {
        constructor(...args: unknown[]) {
          initialize(...args)
        }
        setCenter = setCenter
        setZoom = setZoom
        fitBounds = fitBounds
      },
      OverlayView: class {
        static preventMapHitsAndGesturesFrom = stopMapGesture
        declare onAdd: () => void
        declare draw: () => void
        setMap() {
          this.onAdd()
          this.draw()
        }
        getPanes() {
          return { overlayMouseTarget: mapNode }
        }
        getProjection() {
          return { fromLatLngToDivPixel: project }
        }
      },
      LatLng: class {
        constructor(point: object) {
          Object.assign(this, point)
        }
      },
      LatLngBounds: class {
        extend = extend
      },
      RenderingType: { RASTER: 'RASTER' },
      event: {
        addListenerOnce: (_map: unknown, _type: string, cb: () => void) => {
          idle = cb
        },
      },
    },
  }
  runInNewContext(source, { window, URL, URLSearchParams, document: frameDocument, google, setTimeout, clearTimeout })
  const receive = (args: object, sender: unknown = parent, senderOrigin = origin) => {
    listener?.({ source: sender, origin: senderOrigin, data: { protocol, ...args } })
  }
  const script = () => frameDocument.head.querySelector('script')
  return {
    window,
    receive,
    script,
    parent,
    postMessage,
    pins: () => [...mapNode.querySelectorAll('button')],
    initialize,
    fitBounds,
    extend,
    setCenter,
    setZoom,
    project,
    stopMapGesture,
    idle: () => idle?.(),
  }
}

describe('isolated Google Maps frame runtime', () => {
  afterEach(() => vi.useRealTimers())

  it('does not boot in a standalone window or in a same-origin unsandboxed frame', () => {
    for (const options of [{ standalone: true }, { opaque: false }]) {
      const frame = boot(options)
      frame.receive(init)
      expect(frame.script()).toBeNull()
      expect(frame.postMessage).not.toHaveBeenCalled()
    }
  })

  it('only accepts valid initialization from its parent and never adds locations to the script URL', () => {
    vi.useFakeTimers()
    const frame = boot()
    expect(frame.postMessage).toHaveBeenCalledExactlyOnceWith({ protocol, type: 'ready' }, origin)
    expect(frame.script()).toBeNull()
    frame.receive(init, {})
    frame.receive(init, frame.parent, 'https://wrong.example.test')
    frame.receive({ ...init, protocol: 'wrong' })
    frame.receive({ ...init, points: [] })
    frame.receive({ ...init, points: [{ lat: 91, lng: 0 }] })
    frame.receive({ ...init, points: [{ lat: 0, lng: Infinity }] })
    frame.receive({ ...init, points: Array(181).fill(points[0]) })
    frame.receive({ ...init, selected: 3 })
    expect(frame.script()).toBeNull()
    frame.receive(init)
    const script = frame.script()!
    const url = new URL(script.src)
    expect(url.origin + url.pathname).toBe('https://maps.googleapis.com/maps/api/js')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      key: 'fixture-key',
      language: 'es',
      loading: 'async',
      v: 'quarterly',
      auth_referrer_policy: 'origin',
      callback: 'fennecMapReady',
    })
    expect(script.referrerPolicy).toBe('strict-origin-when-cross-origin')
    frame.receive({ ...init, language: 'en' })
    expect(frame.script()).toBe(script)
  })

  it('fits all exact coordinates and synchronizes selection of distinct and coincident points', () => {
    vi.useFakeTimers()
    const frame = boot()
    frame.receive(init)
    frame.window.fennecMapReady!()
    expect(frame.initialize).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        center: points[0],
        renderingType: 'RASTER',
        maxZoom: 18,
      }),
    )
    expect(frame.extend.mock.calls).toEqual(points.map((point) => [point]))
    expect(frame.fitBounds).toHaveBeenCalledWith(expect.anything(), 50)
    expect(frame.project.mock.calls).toEqual([[points[0]], [points[2]]])
    const [first, second] = frame.pins()
    expect(frame.pins()).toHaveLength(2)
    expect(frame.stopMapGesture).toHaveBeenCalledTimes(2)
    expect(first!.textContent).toBe('1 ×2')
    expect(first!.getAttribute('aria-pressed')).toBe('true')
    expect(second!.style.left).toBe('30px')
    frame.idle()
    expect(frame.postMessage).toHaveBeenLastCalledWith({ protocol, type: 'loaded' }, origin)
    first!.click()
    expect(first!.textContent).toBe('2 ×2')
    expect(frame.postMessage).toHaveBeenLastCalledWith({ protocol, type: 'select', index: 1 }, origin)
    frame.receive({ type: 'select', index: 2 })
    expect(first!.getAttribute('aria-pressed')).toBe('false')
    expect(second!.getAttribute('aria-pressed')).toBe('true')
    frame.receive({ type: 'select', index: 3 })
    expect(second!.getAttribute('aria-pressed')).toBe('true')
    expect(frame.postMessage).toHaveBeenCalledTimes(3)
    frame.receive({ type: 'world' })
    expect(frame.setCenter).toHaveBeenCalledWith({ lat: 0, lng: 0 })
    expect(frame.setZoom).toHaveBeenCalledWith(2)
    frame.receive({ type: 'fit' })
    expect(frame.fitBounds).toHaveBeenCalledTimes(2)
  })

  it.each(['script', 'auth', 'timeout'])('reports %s failure without leaking details', (failure) => {
    vi.useFakeTimers()
    const frame = boot()
    frame.receive(init)
    if (failure === 'script') frame.script()!.dispatchEvent(new Event('error'))
    if (failure === 'auth') frame.window.gm_authFailure!()
    if (failure === 'timeout') vi.advanceTimersByTime(20_000)
    expect(frame.postMessage).toHaveBeenLastCalledWith({ protocol, type: 'error' }, origin)
    frame.window.fennecMapReady!()
    expect(frame.initialize).not.toHaveBeenCalled()
  })
})
