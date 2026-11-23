<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppSettingsStore } from '@/stores/appSettingsStore'
import {
  PortalError,
  portalApi,
  type ActivationResult,
  type DeviceSummary,
  type PortalErrorCode,
  type TelemetryEnvironment,
} from './api'
import { usePortalTexts } from './texts'

const props = defineProps<{
  device: DeviceSummary
  refreshInventory: () => Promise<void>
  updateDevice: (result: ActivationResult) => void
  requiresRefresh?: boolean
}>()
const emit = defineEmits<{ busy: [value: boolean]; uncertain: [deviceId: string] }>()
const auth = useAuthStore()
const settings = useAppSettingsStore()
const router = useRouter()
const common = usePortalTexts()
const texts = computed(() =>
  settings.appLanguage === 'en'
    ? {
      production: 'PRODUCTION: this changes authorization for a real Prod device.',
      title: 'Device activation',
      status: 'Last confirmed authorization',
      enable: 'Enable simulator',
      disable: 'Disable simulator',
      confirm: 'Confirm change',
      cancel: 'Cancel',
      refresh: 'Refresh inventory',
      refreshing: 'Refreshing…',
      saving: 'Saving…',
      device: 'Device ID',
      confirmTitle: 'Change simulator authorization?',
      from: 'Current state',
      to: 'Requested state',
      effect: 'This changes authorization only for this ID in the configured telemetry API, not live connectivity.',
      delay: 'An offline client may not receive the change immediately. This is not an emergency stop.',
      scope: 'The current API does not identify simulator IDs. This action cannot be scoped to a separate simulator.',
      operatorDenied: 'Your account is not allowed to change device activation.',
      saved: 'Authorization saved.',
      audit: 'Audit reference',
      unknown: 'State requires verification',
      review: 'Review this exact ID and transition before confirming. No other IDs will be changed.',
      confirmBeforeRetry: 'Refresh inventory before starting another change.',
    }
    : {
      production: 'PRODUCCIÓN: cambiará la autorización de un dispositivo real en Prod.',
      title: 'Activación del dispositivo',
      status: 'Última autorización confirmada',
      enable: 'Activar simulador',
      disable: 'Desactivar simulador',
      confirm: 'Confirmar cambio',
      cancel: 'Cancelar',
      refresh: 'Actualizar inventario',
      refreshing: 'Actualizando…',
      saving: 'Guardando…',
      device: 'ID de dispositivo',
      confirmTitle: '¿Cambiar la autorización del simulador?',
      from: 'Estado actual',
      to: 'Estado solicitado',
      effect:
          'Solo cambia la autorización de este ID en la API de telemetría configurada, no su conectividad en vivo.',
      delay: 'Un cliente sin conexión puede no recibir el cambio de inmediato. No es una parada de emergencia.',
      scope:
          'La API actual no identifica simuladores por ID. Esta acción no puede limitarse a otro simulador separado.',
      operatorDenied: 'Tu cuenta no tiene permiso para cambiar la activación del dispositivo.',
      saved: 'Autorización guardada.',
      audit: 'Referencia de auditoría',
      unknown: 'Estado por verificar',
      review: 'Revisa este ID exacto y el cambio antes de confirmar. Ningún otro ID será modificado.',
      confirmBeforeRetry: 'Actualiza el inventario antes de iniciar otro cambio.',
    },
)
const dialog = ref<HTMLDialogElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const confirmation = ref<{
  deviceId: string
  active: boolean
  expectedActive: boolean
  environment: TelemetryEnvironment
} | null>(null)
const pending = ref(false)
const refreshing = ref(false)
const error = ref<PortalErrorCode | null>(null)
const localNeedsRefresh = ref(false)
const needsRefresh = computed(() => localNeedsRefresh.value || props.requiresRefresh === true)
const saved = ref<ActivationResult | null>(null)
const canManage = computed(() => auth.isAuthenticated)
let alive = true
const stateLabel = (active: boolean) => (active ? common.value.enabled : common.value.disabled)
watch(
  () => props.device.deviceId,
  () => {
    closeConfirmation()
    error.value = null
    saved.value = null
    localNeedsRefresh.value = false
    // A potentially applied mutation must be reconciled before another action in this component.
  },
)
function closeConfirmation() {
  if (pending.value) return
  dialog.value?.close()
  confirmation.value = null
  void nextTick(() => trigger.value?.focus())
}
async function openConfirmation() {
  if (!canManage.value || pending.value || refreshing.value || needsRefresh.value) return
  error.value = null
  saved.value = null
  confirmation.value = {
    environment: auth.environment,
    deviceId: props.device.deviceId,
    active: !props.device.active,
    expectedActive: props.device.active,
  }
  await nextTick()
  dialog.value?.showModal()
}
async function refresh() {
  if (pending.value || refreshing.value) return
  refreshing.value = true
  error.value = null
  saved.value = null
  try {
    await props.refreshInventory()
    if (alive) localNeedsRefresh.value = false
  } catch (cause) {
    if (alive) {
      localNeedsRefresh.value = true
      emit('uncertain', props.device.deviceId)
      await handleError(cause)
    }
  } finally {
    if (alive) refreshing.value = false
  }
}
async function handleError(cause: unknown) {
  const code = cause instanceof PortalError ? cause.code : 'activationUnknown'
  if (code === 'sessionExpired') {
    auth.clearSession()
    await router.replace({ name: 'login', query: { reason: 'sessionExpired' } })
  } else error.value = code
}
async function confirmChange() {
  if (!confirmation.value || pending.value || !canManage.value || !auth.session) return
  const target = { ...confirmation.value }
  // Never use a changed selection or stale state silently in an already-open confirmation.
  if (
    auth.environment !== target.environment ||
    props.device.deviceId !== target.deviceId ||
    props.device.active !== target.expectedActive
  ) {
    error.value = 'activationConflict'
    localNeedsRefresh.value = true
    emit('uncertain', target.deviceId)
    closeConfirmation()
    return
  }
  if (!auth.beginActivation()) return
  pending.value = true
  emit('busy', true)
  try {
    const result = await portalApi.setActivation(
      target.deviceId,
      target.active,
      target.expectedActive,
      auth.session.csrfToken,
      target.environment,
    )
    if (!alive) return
    if (
      result.environment !== target.environment ||
      result.deviceId !== target.deviceId ||
      result.active !== target.active ||
      result.previousActive !== target.expectedActive ||
      !result.auditId
    )
      throw new PortalError('activationUnknown')
    props.updateDevice(result)
    saved.value = result
    try {
      await props.refreshInventory()
    } catch (cause) {
      if (alive) {
        localNeedsRefresh.value = true
        emit('uncertain', target.deviceId)
        await handleError(cause instanceof PortalError ? cause : new PortalError('unavailable'))
      }
    }
  } catch (cause) {
    if (alive) {
      localNeedsRefresh.value = true
      emit('uncertain', target.deviceId)
      await handleError(cause)
    }
  } finally {
    auth.finishActivation()
    if (alive) {
      pending.value = false
      emit('busy', false)
      closeConfirmation()
    }
  }
}
onBeforeUnmount(() => {
  alive = false
  emit('busy', false)
})
</script>

<template>
  <section
    class="portal-panel mt-4"
    aria-labelledby="activation-title"
  >
    <div class="d-flex flex-wrap align-items-start justify-content-between gap-3">
      <div>
        <h2 id="activation-title">{{ texts.title }}</h2>
        <p class="portal-device-id mb-2">{{ auth.environment.toUpperCase() }} · {{ device.deviceId }}</p>
        <p class="portal-muted small mb-0">{{ texts.status }}: {{ stateLabel(device.active) }}</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button
          type="button"
          class="portal-button portal-secondary"
          :disabled="pending || refreshing"
          @click="refresh"
        >
          {{ refreshing ? texts.refreshing : texts.refresh }}
        </button>
        <button
          v-if="canManage"
          ref="trigger"
          type="button"
          class="portal-button"
          :disabled="pending || refreshing || needsRefresh"
          data-test="activation-open"
          @click="openConfirmation"
        >
          {{ pending ? texts.saving : device.active ? texts.disable : texts.enable }}
        </button>
      </div>
    </div>
    <p class="portal-muted small mt-3 mb-1">{{ texts.effect }}</p>
    <p class="portal-muted small mb-1">{{ texts.delay }}</p>
    <p
      v-if="needsRefresh"
      class="portal-notice mt-3 mb-0"
      role="status"
    >
      {{ texts.unknown }}. {{ texts.confirmBeforeRetry }}
    </p>
    <p
      v-if="error"
      class="portal-error mt-3 mb-0"
      role="alert"
    >
      {{ error === 'forbidden' ? texts.operatorDenied : common[error] }}
    </p>
    <div
      v-if="saved"
      class="portal-notice mt-3 mb-0"
      role="status"
    >
      {{ texts.saved }} {{ stateLabel(saved.active) }}.
      <br />
      {{ texts.audit }}:
      <code>{{ saved.auditId }}</code>
    </div>
    <dialog
      ref="dialog"
      class="portal-activation-dialog"
      aria-labelledby="activation-confirm-title"
      @cancel.prevent="closeConfirmation"
    >
      <div v-if="confirmation">
        <h2 id="activation-confirm-title">{{ texts.confirmTitle }}</h2>
        <p class="portal-muted">{{ texts.review }}</p>
        <p class="portal-notice fw-bold">
          {{ confirmation.environment.toUpperCase() }}
          <br v-if="confirmation.environment === 'prod'" />
          <span v-if="confirmation.environment === 'prod'">{{ texts.production }}</span>
        </p>
        <dl>
          <dt>{{ texts.device }}</dt>
          <dd class="portal-device-id">{{ confirmation.deviceId }}</dd>
          <dt>{{ texts.from }}</dt>
          <dd>{{ stateLabel(confirmation.expectedActive) }}</dd>
          <dt>{{ texts.to }}</dt>
          <dd class="fw-bold">{{ stateLabel(confirmation.active) }}</dd>
        </dl>
        <p class="portal-notice">{{ texts.delay }}</p>
        <p class="portal-muted small">{{ texts.scope }}</p>
        <div class="d-flex flex-wrap justify-content-end gap-2">
          <button
            type="button"
            class="portal-button portal-secondary"
            :disabled="pending"
            @click="closeConfirmation"
          >
            {{ texts.cancel }}
          </button>
          <button
            type="button"
            class="portal-button"
            :disabled="pending"
            data-test="activation-confirm"
            @click="confirmChange"
          >
            {{ pending ? texts.saving : texts.confirm }}
          </button>
        </div>
      </div>
    </dialog>
  </section>
</template>

<style scoped>
.portal-activation-dialog {
  background: #1e2228;
  color: #f4f5f7;
  border: 1px solid #657184;
  border-radius: 14px;
  width: min(560px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: 24px;
  margin: auto;
}
.portal-activation-dialog::backdrop {
  background: #000b;
}
.portal-activation-dialog dt {
  color: #b8c0ca;
  font-size: 0.8rem;
}
.portal-activation-dialog dd {
  margin-bottom: 16px;
}
</style>
