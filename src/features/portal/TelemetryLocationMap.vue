<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { DailyUsage } from './api';
import { useAppSettingsStore } from '@/stores/appSettingsStore';
import { formatTimestamp } from './dates';
import { fittedViewBox, mapObservations, projectLocation } from './map/observations';
import landPaths from './map/landPaths.json';
const props = defineProps<{ records: DailyUsage[]; deviceId: string }>();
const settings = useAppSettingsStore();
const words = computed(() => settings.appLanguage === 'en' ? {
  title: 'Reported locations', world: 'World view', fit: 'Fit observations', choose: 'Select an observation',
  first: 'First record', last: 'Last record', empty: 'No valid location observations in this period.',
  privacy: 'Local map. Coordinates are not sent to external map services.',
  note: 'Optional first/last observations, not a continuous route. Simplified reference map, not street-level.',
  latitude: 'Latitude', longitude: 'Longitude', accuracy: 'Reported accuracy (m)', unavailable: 'Not reported',
  occurred: 'Observed (UTC)', received: 'Received (UTC)', attribution: 'Basemap: Natural Earth · Public domain',
} : {
  title: 'Ubicaciones reportadas', world: 'Vista mundial', fit: 'Ajustar observaciones',
  choose: 'Seleccionar observación',
  first: 'Primer registro', last: 'Último registro',
  empty: 'No hay observaciones de ubicación válidas en este período.',
  privacy: 'Mapa local. Las coordenadas no se envían a servicios de mapas externos.',
  note: 'Observaciones opcionales del primer/último registro, no una ruta continua. '
    + 'Mapa simplificado, no de calles.',
  latitude: 'Latitud', longitude: 'Longitud', accuracy: 'Precisión reportada (m)', unavailable: 'No reportada',
  occurred: 'Observada (UTC)', received: 'Recibida (UTC)', attribution: 'Mapa base: Natural Earth · Dominio público',
});
const points = computed(() => mapObservations(props.records, props.deviceId));
const selectedId = ref('');
const fit = ref(true);
const selected = computed(() => points.value.find((point) => point.id === selectedId.value));
const viewBox = computed(() => fit.value ? fittedViewBox(points.value) : '0 0 360 180');
const markerSize = computed(() => Number(viewBox.value.split(' ')[2]) / 170);
watch(points, (value) => { selectedId.value = value[0]?.id ?? ''; }, { immediate: true });
const timestamp = (value: string) => formatTimestamp(value,
  settings.appLanguage === 'en' ? 'en-GB' : 'es-CL', words.value.unavailable);
const latitudeLines = [0, 30, 60, 90, 120, 150, 180];
const longitudeLines = [0, 60, 120, 180, 240, 300, 360];
</script>

<template>
  <section class="portal-panel telemetry-location-map mb-4" aria-labelledby="location-map-title">
    <div class="map-toolbar">
      <h2 id="location-map-title">{{ words.title }}</h2>
      <div class="map-actions">
        <button type="button" :aria-pressed="!fit" @click="fit = false">{{ words.world }}</button>
        <button type="button" :aria-pressed="fit" :disabled="!points.length" @click="fit = true">{{ words.fit }}</button>
      </div>
    </div>
    <p class="portal-muted small">{{ words.note }}</p>
    <svg class="location-svg" :viewBox="viewBox" role="img" :aria-label="words.title">
      <title>{{ words.title }} · {{ deviceId }}</title>
      <rect x="0" y="0" width="360" height="180" fill="#101f2c" />
      <g fill="none" stroke="#344958" stroke-width="0.25">
        <path v-for="y in latitudeLines" :key="`lat-${y}`" :d="`M0 ${y}H360`" />
        <path v-for="x in longitudeLines" :key="`lon-${x}`" :d="`M${x} 0V180`" />
      </g>
      <g fill="#465a60" stroke="#698087" stroke-width="0.12" fill-rule="evenodd">
        <path v-for="(path, index) in landPaths" :key="index" :d="path" />
      </g>
      <g v-for="point in points" :key="point.id"
        :transform="`translate(${projectLocation(point.latitude, point.longitude).x},${projectLocation(point.latitude, point.longitude).y})`">
        <circle v-if="point.boundary === 'first'" :r="markerSize" fill="#ffad46"
          :stroke="selectedId === point.id ? '#fff' : '#181818'" :stroke-width="markerSize / 3" />
        <rect v-else :x="-markerSize" :y="-markerSize" :width="markerSize * 2" :height="markerSize * 2"
          fill="#6fd6eb" :stroke="selectedId === point.id ? '#fff' : '#181818'" :stroke-width="markerSize / 3" />
        <title>{{ point.date }} · {{ words[point.boundary] }} · {{ point.latitude }}, {{ point.longitude }}</title>
      </g>
    </svg>
    <div class="map-legend"><span>● {{ words.first }}</span><span>■ {{ words.last }}</span></div>
    <p v-if="!points.length" class="portal-muted mt-3" role="status">{{ words.empty }}</p>
    <template v-else>
      <label class="form-label mt-3" for="map-observation">{{ words.choose }}</label>
      <select id="map-observation" v-model="selectedId" class="form-select">
        <option v-for="(point, index) in points" :key="point.id" :value="point.id">
          {{ index + 1 }}. {{ point.date }} · {{ words[point.boundary] }} · {{ point.latitude }}, {{ point.longitude }}
        </option>
      </select>
      <dl v-if="selected" class="map-details mt-3" aria-live="polite">
        <div><dt>{{ words.latitude }}</dt><dd>{{ selected.latitude }}</dd></div>
        <div><dt>{{ words.longitude }}</dt><dd>{{ selected.longitude }}</dd></div>
        <div><dt>{{ words.accuracy }}</dt><dd>{{ selected.accuracyMeters ?? words.unavailable }}</dd></div>
        <div><dt>{{ words.occurred }}</dt><dd>{{ timestamp(selected.occurredAtUtc) }}</dd></div>
        <div><dt>{{ words.received }}</dt><dd>{{ timestamp(selected.receivedAtUtc) }}</dd></div>
      </dl>
    </template>
    <p class="portal-muted small mb-1">{{ words.privacy }}</p>
    <p class="portal-muted small mb-0">{{ words.attribution }}</p>
  </section>
</template>

<style scoped>
.map-toolbar { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; align-items: center; }
.map-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.map-actions button { border: 1px solid #64717e; color: #f2f4f6; background: #222c35; border-radius: 6px; padding: 7px 12px; }
.map-actions button[aria-pressed='true'] { border-color: #ffad46; color: #ffbf6c; }
.map-actions button:focus-visible { outline: 3px solid #ffad46; outline-offset: 3px; }
.map-actions button:disabled { opacity: .5; }
.location-svg { display: block; width: 100%; aspect-ratio: 2 / 1; border: 1px solid #425260; border-radius: 8px; background: #101f2c; }
.map-legend { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 10px; font-size: .8rem; }
.map-legend span:first-child { color: #ffad46; }
.map-legend span:last-child { color: #6fd6eb; }
.map-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.map-details dt { color: #b8c0ca; font-size: .75rem; }
.map-details dd { color: #f2f4f6; font-size: .85rem; overflow-wrap: anywhere; }
</style>
