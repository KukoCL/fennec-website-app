<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { DailyUsage } from './api'
import { useAppSettingsStore } from '@/stores/appSettingsStore'
import { formatTimestamp } from './dates'
import { fittedViewBox, mapObservations, projectLocation } from './map/observations'
import landPaths from './map/landPaths.json'
import { googleMapMessage, GOOGLE_MAP_PROTOCOL } from './map/googleFrame'
const props = defineProps<{ records: DailyUsage[]; deviceId: string }>()
const settings = useAppSettingsStore()
const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? ''
const showGoogle = ref(false)
const googleFrame = ref<HTMLIFrameElement>()
const mapAction = ref<HTMLButtonElement>()
const googleStatus = ref<'loading' | 'loaded' | 'error' | ''>('')
let googleTimeout: ReturnType<typeof setTimeout> | undefined
let googleInitialized = false
const frameUrl = `${import.meta.env.BASE_URL}telemetry-google-map.html`
const sendToMap = (message: Record<string, unknown>) => {
  if (showGoogle.value) googleFrame.value?.contentWindow?.postMessage(
    { protocol: GOOGLE_MAP_PROTOCOL, ...message }, '*',
  )
}
const stopGoogle = () => {
  showGoogle.value = false
  clearTimeout(googleTimeout)
}
const loadGoogle = async () => {
  if (showGoogle.value || !points.value.length || !googleKey) return
  googleStatus.value = 'loading'
  googleInitialized = false
  showGoogle.value = true
  fit.value = true
  googleTimeout = setTimeout(() => {
    googleStatus.value = 'error'
    stopGoogle()
  }, 25_000)
  await nextTick()
  mapAction.value?.focus()
}
const returnLocal = async () => {
  stopGoogle()
  await nextTick()
  mapAction.value?.focus()
}
const onMapMessage = (event: MessageEvent) => {
  if (!showGoogle.value || !googleFrame.value?.contentWindow
    || event.source !== googleFrame.value.contentWindow || event.origin !== 'null') return
  const message = googleMapMessage(event.data, points.value.length)
  if (!message) return
  if (message.type === 'ready' && !googleInitialized) {
    googleInitialized = true
    sendToMap({ type: 'init', key: googleKey,
      language: settings.appLanguage === 'en' ? 'en' : 'es',
      points: points.value.map((point) => ({ lat: point.latitude, lng: point.longitude })),
      selected: selectedIndex.value,
    })
  } else if (message.type === 'select') selectedId.value = points.value[message.index]!.id
  else if (message.type === 'loaded') {
    clearTimeout(googleTimeout)
    googleStatus.value = 'loaded'
  } else if (message.type === 'error') {
    googleStatus.value = 'error'
    stopGoogle()
  }
}
onMounted(() => window.addEventListener('message', onMapMessage))
onBeforeUnmount(() => {
  stopGoogle()
  window.removeEventListener('message', onMapMessage)
})
const words = computed(() =>
  settings.appLanguage === 'en'
    ? {
      title: 'Reported locations',
      world: 'World view',
      fit: 'Fit observations',
      choose: 'Select an observation',
      first: 'First record',
      last: 'Last record',
      empty: 'No valid location observations in this period.',
      privacy: 'Local map. Coordinates are not sent to external map services.',
      google: 'Load all locations in Google Maps',
      local: 'Return to local map',
      googleMissing: 'Street map unavailable: a restricted Google Maps JavaScript API key has not been configured.',
      googleLoading: 'Loading Google Maps…',
      googleError: 'Google Maps could not load. The local map remains available. ' +
        'Check the browser key, billing or network.',
      googleConsent:
          'Loading Google Maps shares ALL displayed location points in this period, your IP address and this site’s ' +
          'origin with Google. No device IDs, timestamps or session credentials are shared. ' +
          'Use the local map if you do not want to share locations. Changing the data requires another opt-in.',
      googleActive:
          'All displayed observations are shown. Numbers match the selector; ×N groups coincident points. ' +
          'Click a group to cycle its observations, or use the selector for overlapping markers. ' +
          'Returning to the local map stops this map, but cannot undo locations already shared.',
      googlePrivacy: 'Google privacy policy',
      googleTerms: 'Google Maps terms',
      observations: 'Optional first/last observations, not a continuous route.',
      note: 'Optional first/last observations, not a continuous route. Simplified reference map, not street-level.',
      latitude: 'Latitude',
      longitude: 'Longitude',
      accuracy: 'Reported accuracy (m)',
      unavailable: 'Not reported',
      occurred: 'Observed (UTC)',
      received: 'Received (UTC)',
      attribution: 'Basemap: Natural Earth · Public domain',
    }
    : {
      title: 'Ubicaciones reportadas',
      world: 'Vista mundial',
      fit: 'Ajustar observaciones',
      choose: 'Seleccionar observación',
      first: 'Primer registro',
      last: 'Último registro',
      empty: 'No hay observaciones de ubicación válidas en este período.',
      privacy: 'Mapa local. Las coordenadas no se envían a servicios de mapas externos.',
      google: 'Cargar todas las ubicaciones en Google Maps',
      local: 'Volver al mapa local',
      googleMissing: 'Mapa de calles no disponible: ' +
        'falta configurar una API key restringida de Google Maps JavaScript.',
      googleLoading: 'Cargando Google Maps…',
      googleError: 'Google Maps no pudo cargar. Sigue disponible el mapa local. ' +
        'Revisa la API key, facturación o conexión.',
      googleConsent:
          'Cargar Google Maps comparte TODOS los puntos de ubicación mostrados en este período, tu dirección IP y ' +
          'el origen de este sitio con Google. No se comparten IDs, horas de registros ni credenciales de sesión. ' +
          'Usa el mapa local si no quieres compartir ubicaciones. Cambiar los datos requiere aceptar de nuevo.',
      googleActive:
          'Se muestran todas las observaciones. Los números coinciden con el selector; ' +
          '×N agrupa puntos coincidentes. ' +
          'Haz clic en un grupo para alternar sus observaciones, o usa el selector para marcadores superpuestos. ' +
          'Volver al mapa local detiene este mapa, pero no revierte las ubicaciones ya compartidas.',
      googlePrivacy: 'Privacidad de Google',
      googleTerms: 'Condiciones de Google Maps',
      observations: 'Observaciones opcionales del primer/último registro, no una ruta continua.',
      note:
          'Observaciones opcionales del primer/último registro, no una ruta continua. ' +
          'Mapa simplificado, no de calles.',
      latitude: 'Latitud',
      longitude: 'Longitud',
      accuracy: 'Precisión reportada (m)',
      unavailable: 'No reportada',
      occurred: 'Observada (UTC)',
      received: 'Recibida (UTC)',
      attribution: 'Mapa base: Natural Earth · Dominio público',
    },
)
const points = computed(() => mapObservations(props.records, props.deviceId))
const selectedId = ref('')
const fit = ref(true)
const selected = computed(() => points.value.find((point) => point.id === selectedId.value))
const selectedIndex = computed(() => points.value.findIndex((point) => point.id === selectedId.value))
watch(selectedIndex, (index) => { if (index >= 0) sendToMap({ type: 'select', index }) })
const setExtent = (fitted: boolean) => {
  fit.value = fitted
  sendToMap({ type: fitted ? 'fit' : 'world' })
}
const viewBox = computed(() => (fit.value ? fittedViewBox(points.value) : '0 0 360 180'))
const markerSize = computed(() => Number(viewBox.value.split(' ')[2]) / 170)
watch(
  points,
  (value) => {
    selectedId.value = value[0]?.id ?? ''
    stopGoogle()
    googleStatus.value = ''
  },
  { immediate: true },
)
const timestamp = (value: string) =>
  formatTimestamp(value, settings.appLanguage === 'en' ? 'en-GB' : 'es-CL', words.value.unavailable)
const latitudeLines = [0, 30, 60, 90, 120, 150, 180]
const longitudeLines = [0, 60, 120, 180, 240, 300, 360]
</script>

<template>
  <section
    class="portal-panel telemetry-location-map mb-4"
    aria-labelledby="location-map-title"
  >
    <div class="map-toolbar">
      <h2 id="location-map-title">{{ words.title }}</h2>
      <div
        class="map-actions"
      >
        <button
          type="button"
          :aria-pressed="!fit"
          :disabled="showGoogle && googleStatus === 'loading'"
          @click="setExtent(false)"
        >
          {{ words.world }}
        </button>
        <button
          type="button"
          :aria-pressed="fit"
          :disabled="!points.length || (showGoogle && googleStatus === 'loading')"
          @click="setExtent(true)"
        >
          {{ words.fit }}
        </button>
      </div>
    </div>
    <p class="portal-muted small">{{ showGoogle ? words.observations : words.note }}</p>
    <template v-if="points.length">
      <p
        v-if="!googleKey"
        class="portal-muted small mt-3 mb-2"
      >
        {{ words.googleMissing }}
      </p>
      <template v-else>
        <p class="portal-muted small mt-3 mb-2">{{ showGoogle ? words.googleActive : words.googleConsent }}</p>
        <button
          v-if="showGoogle"
          ref="mapAction"
          type="button"
          class="portal-button portal-secondary"
          data-test="map-local"
          @click="returnLocal"
        >
          {{ words.local }}
        </button>
        <button
          v-else
          ref="mapAction"
          type="button"
          class="portal-button"
          data-test="map-google"
          @click="loadGoogle"
        >
          {{ words.google }}
        </button>
        <p class="small mt-2">
          <a
            class="portal-link"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ words.googlePrivacy }}
          </a>
          ·
          <a
            class="portal-link"
            href="https://www.google.com/intl/en/help/terms_maps/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ words.googleTerms }}
          </a>
        </p>
      </template>
    </template>
    <iframe
      v-if="showGoogle"
      ref="googleFrame"
      :src="frameUrl"
      sandbox="allow-scripts"
      class="google-map"
      :title="`${words.title} · Google Maps`"
      referrerpolicy="strict-origin-when-cross-origin"
    />
    <p
      v-if="googleStatus === 'loading' && showGoogle"
      class="portal-muted small mt-2"
      role="status"
    >{{ words.googleLoading }}</p>
    <p
      v-if="googleStatus === 'error'"
      class="portal-warning small mt-2"
      role="alert"
    >{{ words.googleError }}</p>
    <svg
      v-if="!showGoogle"
      class="location-svg"
      :viewBox="viewBox"
      role="img"
      :aria-label="words.title"
    >
      <title>{{ words.title }} · {{ deviceId }}</title>
      <rect
        x="0"
        y="0"
        width="360"
        height="180"
        fill="#101f2c"
      />
      <g
        fill="none"
        stroke="#344958"
        stroke-width="0.25"
      >
        <path
          v-for="y in latitudeLines"
          :key="`lat-${y}`"
          :d="`M0 ${y}H360`"
        />
        <path
          v-for="x in longitudeLines"
          :key="`lon-${x}`"
          :d="`M${x} 0V180`"
        />
      </g>
      <g
        fill="#465a60"
        stroke="#698087"
        stroke-width="0.12"
        fill-rule="evenodd"
      >
        <path
          v-for="(path, index) in landPaths"
          :key="index"
          :d="path"
        />
      </g>
      <g
        v-for="point in points"
        :key="point.id"
        :transform="`translate(${projectLocation(point.latitude, point.longitude).x},${projectLocation(point.latitude, point.longitude).y})`"
      >
        <circle
          v-if="point.boundary === 'first'"
          :r="markerSize"
          fill="#ffad46"
          :stroke="selectedId === point.id ? '#fff' : '#181818'"
          :stroke-width="markerSize / 3"
        />
        <rect
          v-else
          :x="-markerSize"
          :y="-markerSize"
          :width="markerSize * 2"
          :height="markerSize * 2"
          fill="#6fd6eb"
          :stroke="selectedId === point.id ? '#fff' : '#181818'"
          :stroke-width="markerSize / 3"
        />
        <title>{{ point.date }} · {{ words[point.boundary] }} · {{ point.latitude }}, {{ point.longitude }}</title>
      </g>
    </svg>
    <div
      v-if="!showGoogle"
      class="map-legend"
    >
      <span>● {{ words.first }}</span>
      <span>■ {{ words.last }}</span>
    </div>
    <p
      v-if="!points.length"
      class="portal-muted mt-3"
      role="status"
    >
      {{ words.empty }}
    </p>
    <template v-else>
      <label
        class="form-label mt-3"
        for="map-observation"
      >
        {{ words.choose }}
      </label>
      <select
        id="map-observation"
        v-model="selectedId"
        class="form-select"
      >
        <option
          v-for="(point, index) in points"
          :key="point.id"
          :value="point.id"
        >
          {{ index + 1 }}. {{ point.date }} · {{ words[point.boundary] }} · {{ point.latitude }}, {{ point.longitude }}
        </option>
      </select>
      <dl
        v-if="selected"
        class="map-details mt-3"
        aria-live="polite"
      >
        <div>
          <dt>{{ words.latitude }}</dt>
          <dd>{{ selected.latitude }}</dd>
        </div>
        <div>
          <dt>{{ words.longitude }}</dt>
          <dd>{{ selected.longitude }}</dd>
        </div>
        <div>
          <dt>{{ words.accuracy }}</dt>
          <dd>{{ selected.accuracyMeters ?? words.unavailable }}</dd>
        </div>
        <div>
          <dt>{{ words.occurred }}</dt>
          <dd>{{ timestamp(selected.occurredAtUtc) }}</dd>
        </div>
        <div>
          <dt>{{ words.received }}</dt>
          <dd>{{ timestamp(selected.receivedAtUtc) }}</dd>
        </div>
      </dl>
    </template>
    <p
      v-if="!showGoogle"
      class="portal-muted small mb-1"
    >
      {{ words.privacy }}
    </p>
    <p
      v-if="!showGoogle"
      class="portal-muted small mb-0"
    >
      {{ words.attribution }}
    </p>
  </section>
</template>

<style scoped>
.telemetry-location-map {
  min-width: 0;
}
.telemetry-location-map .form-select {
  max-width: 100%;
}
.google-map {
  display: block;
  width: 100%;
  min-height: 350px;
  height: min(55vh, 520px);
  border: 0;
  border-radius: 8px;
}
.map-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}
.map-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.map-actions button {
  border: 1px solid #64717e;
  color: #f2f4f6;
  background: #222c35;
  border-radius: 6px;
  padding: 7px 12px;
}
.map-actions button[aria-pressed='true'] {
  border-color: #ffad46;
  color: #ffbf6c;
}
.map-actions button:focus-visible {
  outline: 3px solid #ffad46;
  outline-offset: 3px;
}
.map-actions button:disabled {
  opacity: 0.5;
}
.location-svg {
  display: block;
  width: 100%;
  aspect-ratio: 2 / 1;
  border: 1px solid #425260;
  border-radius: 8px;
  background: #101f2c;
}
.map-legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 10px;
  font-size: 0.8rem;
}
.map-legend span:first-child {
  color: #ffad46;
}
.map-legend span:last-child {
  color: #6fd6eb;
}
.map-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}
.map-details dt {
  color: #b8c0ca;
  font-size: 0.75rem;
}
.map-details dd {
  color: #f2f4f6;
  font-size: 0.85rem;
  overflow-wrap: anywhere;
}
</style>
