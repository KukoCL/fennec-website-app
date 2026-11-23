<script setup lang="ts">
import '@/assets/portal.css'
import EnvironmentSelector from '@/features/portal/EnvironmentSelector.vue'
import DeviceActivationControl from '@/features/portal/DeviceActivationControl.vue'
import TelemetryLocationMap from '@/features/portal/TelemetryLocationMap.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppSettingsStore } from '@/stores/appSettingsStore'
import { usePortalTexts } from '@/features/portal/texts'
import {
  portalApi,
  PortalError,
  type ActivationResult,
  type DailyUsage,
  type DeviceSummary,
  type PortalErrorCode,
} from '@/features/portal/api'
import { formatDuration, formatTimestamp, presetRange, rangeError, type DatePreset } from '@/features/portal/dates'

const texts = usePortalTexts()
const settings = useAppSettingsStore()
const router = useRouter()
const auth = useAuthStore()
const devices = ref<DeviceSummary[]>([])
const selectedDevice = ref('')
const appliedDevice = ref('')
const inventoryVerified = ref(false)
const inventoryLoaded = ref(false)
const loading = ref(true)
const inventoryRefreshing = ref(false)
const activationBusy = ref(false)
const switchingEnvironment = ref(false)
const uncertainDevices = ref(new Set<string>())
function markUncertain(deviceId: string) {
  uncertainDevices.value.add(deviceId)
}
const error = ref<PortalErrorCode | 'inventoryError' | null>(null)
const validation = ref<'invalidRange' | 'rangeLimit' | null>(null)
const preset = ref<DatePreset>('week')
const range = ref(presetRange('week'))
const appliedRange = ref({ ...range.value })
const records = ref<DailyUsage[]>([])
const lastUpdated = ref<string | null>(null)
let abort = new AbortController()
let requestId = 0
let inventoryRequestId = 0
let cached: { deviceId: string; records: DailyUsage[]; fetchedAt: string } | null = null
const locale = computed(() => (settings.appLanguage === 'en' ? 'en-GB' : 'es-CL'))
const visibleRecords = computed(() =>
  records.value
    .filter((record) => record.date >= appliedRange.value.from && record.date <= appliedRange.value.to)
    .sort((a, b) => a.date.localeCompare(b.date)),
)
const totalSeconds = computed(() => visibleRecords.value.reduce((sum, record) => sum + record.totalDurationSeconds, 0))
const maxSeconds = computed(() => Math.max(1, ...visibleRecords.value.map((record) => record.totalDurationSeconds)))
const selectedSummary = computed(() => devices.value.find((device) => device.deviceId === appliedDevice.value))
const timestamp = (value?: string | null) => formatTimestamp(value, locale.value, texts.value.notAvailable)
function changePreset() {
  if (preset.value !== 'custom') range.value = presetRange(preset.value)
  validation.value = null
}
function location(record: DailyUsage) {
  const coordinates = (value: DailyUsage['first']) =>
    value?.location
      ? `${value.location.latitude.toFixed(5)}, ${value.location.longitude.toFixed(5)}`
      : texts.value.notAvailable
  return { first: coordinates(record.first), last: coordinates(record.last) }
}
async function reportError(cause: unknown) {
  if (cause instanceof DOMException && cause.name === 'AbortError') return
  if (cause instanceof PortalError && cause.code === 'sessionExpired') {
    auth.clearSession()
    await router.replace({ name: 'login', query: { reason: 'sessionExpired' } })
    return
  }
  error.value = cause instanceof PortalError ? cause.code : 'unavailable'
}
async function loadUsage() {
  if (loading.value || activationBusy.value || inventoryRefreshing.value || !selectedDevice.value) return
  validation.value = rangeError(range.value)
  if (validation.value) return
  const id = ++requestId
  abort.abort()
  abort = new AbortController()
  loading.value = true
  error.value = null
  const deviceId = selectedDevice.value
  const environment = auth.environment
  const nextRange = { ...range.value }
  try {
    const useCache = cached?.deviceId === deviceId && Date.now() - Date.parse(cached.fetchedAt) < 60_000
    const result = useCache && cached ? cached.records : await portalApi.dailyUsage(deviceId, abort.signal, environment)
    const fetchedAt = useCache && cached ? cached.fetchedAt : new Date().toISOString()
    if (id !== requestId) return
    cached = { deviceId, records: result, fetchedAt }
    records.value = result
    appliedDevice.value = deviceId
    appliedRange.value = nextRange
    lastUpdated.value = fetchedAt
  } catch (cause) {
    if (id === requestId) {
      await reportError(cause)
    }
  } finally {
    if (id === requestId) loading.value = false
  }
}
async function refreshInventory() {
  if (inventoryRefreshing.value) throw new PortalError('unavailable')
  inventoryRefreshing.value = true
  const current = requestId
  const inventoryId = ++inventoryRequestId
  const environment = auth.environment
  try {
    const all: DeviceSummary[] = []
    const seenCursors = new Set<string>()
    let cursor: string | undefined
    let verified = true
    do {
      const page = await portalApi.devices(cursor, abort.signal, environment)
      if (current !== requestId) throw new DOMException('Request cancelled', 'AbortError')
      all.push(...page.devices)
      verified = verified && page.historicalInventoryVerified
      cursor = page.nextCursor || undefined
      if (cursor && (seenCursors.has(cursor) || seenCursors.size >= 100)) throw new PortalError('unavailable')
      if (cursor) seenCursors.add(cursor)
    } while (cursor)
    devices.value = [...new Map(all.map((device) => [device.deviceId, device])).values()].sort((a, b) =>
      a.deviceId.localeCompare(b.deviceId),
    )
    inventoryVerified.value = verified
    inventoryLoaded.value = true
    uncertainDevices.value.clear()
    if (!devices.value.some((device) => device.deviceId === selectedDevice.value)) {
      selectedDevice.value = devices.value[0]?.deviceId ?? ''
    }
  } finally {
    if (inventoryId === inventoryRequestId) inventoryRefreshing.value = false
  }
}
function updateDevice(result: ActivationResult) {
  devices.value = devices.value.map((device) =>
    device.deviceId === result.deviceId ? { ...device, active: result.active } : device,
  )
}
async function initialize() {
  const current = requestId
  if (inventoryLoaded.value) {
    cached = null
    await loadUsage()
    return
  }
  loading.value = true
  error.value = null
  try {
    await refreshInventory()
  } catch (cause) {
    if (current === requestId) {
      await reportError(cause)
      if (error.value === 'unavailable') error.value = 'inventoryError'
    }
  } finally {
    if (current === requestId) loading.value = false
  }
  if (current === requestId && inventoryLoaded.value && selectedDevice.value) await loadUsage()
}
watch(
  () => auth.environment,
  () => {
    requestId++
    abort.abort()
    abort = new AbortController()
    inventoryRequestId++
    inventoryRefreshing.value = false
    loading.value = true
    error.value = null
    validation.value = null
    cached = null
    records.value = []
    devices.value = []
    selectedDevice.value = ''
    appliedDevice.value = ''
    lastUpdated.value = null
    inventoryLoaded.value = false
    inventoryVerified.value = false
    uncertainDevices.value.clear()
    void initialize()
  },
  { flush: 'sync' },
)
onMounted(initialize)
onBeforeUnmount(() => {
  requestId++
  abort.abort()
})
</script>

<template>
  <section
    class="portal-page"
    aria-labelledby="telemetry-title"
  >
    <header class="portal-header">
      <div>
        <RouterLink
          to="/dashboard"
          class="portal-link small d-inline-block mb-3"
        >
          ← {{ texts.simulators }}
        </RouterLink>
        <div class="portal-eyebrow">FENNECSOFT / JUMBO</div>
        <h1 id="telemetry-title">{{ texts.dashboardTitle }}</h1>
        <p class="portal-muted mb-0">{{ texts.dashboardDescription }}</p>
      </div>
      <span class="portal-badge">{{ auth.environment.toUpperCase() }} · {{ texts.reported }} · UTC</span>
    </header>

    <EnvironmentSelector
      :disabled="activationBusy"
      @busy="switchingEnvironment = $event"
    />
    <template v-if="!switchingEnvironment">
      <p
        v-if="auth.isAuthenticated && !auth.reloadSessionAvailable"
        class="portal-notice"
      >
        {{ texts.storageUnavailable }}
      </p>
      <p class="portal-notice">{{ texts.simulatorScope }}</p>
      <div
        v-if="auth.refreshUnavailable"
        class="portal-notice mb-3"
        role="status"
      >
        {{ texts.renewalError }}
      </div>
      <div
        v-if="inventoryLoaded && !inventoryVerified"
        class="portal-notice mb-3"
        role="status"
      >
        {{ texts.inventoryWarning }}
      </div>
      <form
        class="portal-panel"
        @submit.prevent="loadUsage"
      >
        <div class="row g-3 align-items-end">
          <div class="col-12 col-lg-4">
            <label
              for="telemetry-device"
              class="form-label"
            >
              {{ texts.device }}
            </label>
            <select
              id="telemetry-device"
              v-model="selectedDevice"
              class="form-select"
              :disabled="loading || inventoryRefreshing || activationBusy || !devices.length"
            >
              <option
                v-if="!devices.length"
                value=""
              >
                {{ texts.noDevices }}
              </option>
              <option
                v-for="device in devices"
                :key="device.deviceId"
                :value="device.deviceId"
              >
                {{ device.deviceId }}
              </option>
            </select>
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <label
              for="telemetry-period"
              class="form-label"
            >
              {{ texts.dateRange }}
            </label>
            <select
              id="telemetry-period"
              v-model="preset"
              class="form-select"
              :disabled="loading || inventoryRefreshing || activationBusy"
              @change="changePreset"
            >
              <option value="today">{{ texts.today }}</option>
              <option value="yesterday">{{ texts.yesterday }}</option>
              <option value="week">{{ texts.week }}</option>
              <option value="month">{{ texts.month }}</option>
              <option value="custom">{{ texts.custom }}</option>
            </select>
          </div>
          <div class="col-6 col-sm-3 col-lg-2">
            <label
              for="telemetry-from"
              class="form-label"
            >
              {{ texts.from }}
            </label>
            <input
              id="telemetry-from"
              v-model="range.from"
              type="date"
              class="form-control"
              required
              :disabled="loading || inventoryRefreshing || activationBusy"
              @input="preset = 'custom'"
            />
          </div>
          <div class="col-6 col-sm-3 col-lg-2">
            <label
              for="telemetry-to"
              class="form-label"
            >
              {{ texts.to }}
            </label>
            <input
              id="telemetry-to"
              v-model="range.to"
              type="date"
              class="form-control"
              required
              :disabled="loading || inventoryRefreshing || activationBusy"
              @input="preset = 'custom'"
            />
          </div>
          <div class="col-12 col-lg-1 d-grid">
            <button
              class="portal-button px-2"
              type="submit"
              :disabled="loading || inventoryRefreshing || activationBusy || !selectedDevice"
            >
              {{ loading ? '…' : texts.update }}
            </button>
          </div>
        </div>
        <p class="portal-muted small mb-0 mt-3">{{ texts.utc }}</p>
        <p
          v-if="validation"
          class="portal-error mb-0 mt-3"
          role="alert"
        >
          {{ texts[validation] }}
        </p>
      </form>
      <p class="portal-muted small mt-3 mb-0">{{ texts.retention }}</p>

      <div
        v-if="error"
        class="portal-error mt-4"
        role="alert"
      >
        <p class="mb-2">{{ texts[error] }}</p>
        <button
          type="button"
          class="portal-button"
          :disabled="loading || inventoryRefreshing || activationBusy"
          @click="initialize"
        >
          {{ texts.retry }}
        </button>
      </div>
      <div
        v-else-if="loading"
        class="portal-empty"
        role="status"
      >
        {{ texts.loading }}
      </div>
      <template v-else-if="lastUpdated">
        <div class="mt-4 d-flex flex-wrap align-items-center gap-2">
          <span class="portal-device-id">{{ appliedDevice }}</span>
          <span
            v-if="selectedSummary"
            class="portal-badge"
          >
            {{ selectedSummary.active ? texts.enabled : texts.disabled }}
          </span>
          <span class="portal-muted small ms-sm-auto">{{ appliedRange.from }} → {{ appliedRange.to }}</span>
        </div>
        <DeviceActivationControl
          v-if="selectedSummary"
          :key="auth.environment"
          :device="selectedSummary"
          :refresh-inventory="refreshInventory"
          :update-device="updateDevice"
          :requires-refresh="uncertainDevices.has(appliedDevice)"
          @busy="activationBusy = $event"
          @uncertain="markUncertain"
        />
        <p
          v-else
          class="portal-notice mt-4"
        >
          {{ texts.deviceMissing }}
        </p>
        <div class="portal-metrics">
          <div class="portal-panel">
            <div class="portal-metric-label">{{ texts.totalUsage }}</div>
            <div class="portal-metric-value accent">
              {{ visibleRecords.length ? formatDuration(totalSeconds) : '—' }}
            </div>
          </div>
          <div class="portal-panel">
            <div class="portal-metric-label">{{ texts.noUsageDays }}</div>
            <div class="portal-metric-value">{{ visibleRecords.length }}</div>
          </div>
        </div>
        <TelemetryLocationMap
          :key="auth.environment"
          :records="visibleRecords"
          :device-id="appliedDevice"
          class="mb-4"
        />
        <div
          v-if="!visibleRecords.length"
          class="portal-panel portal-empty"
        >
          <div
            class="portal-empty-symbol"
            aria-hidden="true"
          >
            ∅
          </div>
          <h2>{{ texts.noData }}</h2>
          <p class="portal-muted mb-0">{{ texts.noDataDescription }}</p>
        </div>
        <template v-else>
          <section
            class="portal-panel mb-4"
            aria-labelledby="daily-title"
          >
            <h2
              id="daily-title"
              class="mb-4"
            >
              {{ texts.byDate }}
            </h2>
            <div class="portal-chart">
              <div
                v-for="record in visibleRecords"
                :key="record.date"
                class="portal-chart-row"
              >
                <span>{{ record.date }}</span>
                <div
                  class="portal-bar-track"
                  aria-hidden="true"
                >
                  <div
                    class="portal-bar"
                    :style="{ width: `${(record.totalDurationSeconds / maxSeconds) * 100}%` }"
                  ></div>
                </div>
                <span class="text-end">{{ formatDuration(record.totalDurationSeconds) }}</span>
              </div>
            </div>
          </section>
          <section
            class="portal-panel"
            aria-labelledby="records-title"
          >
            <h2 id="records-title">{{ texts.records }}</h2>
            <p class="portal-muted small">{{ texts.recordsNote }}</p>
            <div
              class="table-responsive"
              tabindex="0"
              :aria-label="texts.records"
            >
              <table class="portal-table">
                <thead>
                  <tr>
                    <th scope="col">{{ texts.date }}</th>
                    <th scope="col">{{ texts.usage }}</th>
                    <th scope="col">{{ texts.firstRecord }}</th>
                    <th scope="col">{{ texts.lastRecord }}</th>
                    <th scope="col">{{ texts.location }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="record in visibleRecords"
                    :key="record.date"
                  >
                    <td class="text-nowrap">{{ record.date }}</td>
                    <td class="text-nowrap">{{ formatDuration(record.totalDurationSeconds) }}</td>
                    <td class="text-nowrap">{{ timestamp(record.first?.occurredAtUtc) }}</td>
                    <td class="text-nowrap">{{ timestamp(record.last?.occurredAtUtc) }}</td>
                    <td>
                      {{ texts.firstRecord }}: {{ location(record).first }}
                      <br />
                      {{ texts.lastRecord }}: {{ location(record).last }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </template>
        <p class="portal-muted small mt-3 mb-0">{{ texts.locationNote }}</p>
        <p class="portal-muted small mt-3 mb-0">{{ texts.updated }}: {{ timestamp(lastUpdated) }} UTC</p>
      </template>
      <div
        v-else-if="inventoryLoaded && !devices.length"
        class="portal-panel portal-empty mt-4"
      >
        <h2>{{ texts.noDevices }}</h2>
      </div>
      <p class="portal-muted small mt-4 mb-0">{{ texts.deviceNote }}</p>
    </template>
  </section>
</template>
