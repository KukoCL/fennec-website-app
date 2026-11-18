<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppSettingsStore } from '@/stores/appSettingsStore'
import { usePortalTexts } from './texts'
import { PortalError, type PortalErrorCode, type TelemetryEnvironment } from './api'
const props = defineProps<{ disabled?: boolean; returnToLogin?: boolean }>()
const emit = defineEmits<{ busy: [value: boolean]; changed: [] }>()
const auth = useAuthStore()
const settings = useAppSettingsStore()
const common = usePortalTexts()
const router = useRouter()
const busy = ref(false)
const error = ref<PortalErrorCode | null>(null)
const words = computed(() =>
  settings.appLanguage === 'en'
    ? {
      label: 'Telemetry environment',
      qa: 'QA · Test data',
      prod: 'PROD · Production data',
      note: 'One website, separate data sources. Changing environment signs you out and requires a new sign-in.',
      production: 'PRODUCTION: changes affect real devices in Prod.',
      pending: 'Signing out of the previous environment…',
    }
    : {
      label: 'Ambiente de telemetría',
      qa: 'QA · Datos de prueba',
      prod: 'PROD · Datos de producción',
      note: 'Un solo sitio, fuentes separadas. Cambiar de ambiente cierra la sesión y requiere ' +
        'iniciar sesión de nuevo.',
      production: 'PRODUCCIÓN: los cambios afectan dispositivos reales de Prod.',
      pending: 'Cerrando sesión del ambiente anterior…',
    },
)
async function change(event: Event) {
  const select = event.target as HTMLSelectElement
  const next = select.value as TelemetryEnvironment
  select.value = auth.environment
  if (busy.value || props.disabled || !['qa', 'prod'].includes(next) || next === auth.environment) return
  busy.value = true
  emit('busy', true)
  error.value = null
  try {
    await auth.changeEnvironment(next)
    emit('changed')
    if (props.returnToLogin) await router.replace({ name: 'login' })
  } catch (cause) {
    error.value = cause instanceof PortalError ? cause.code : 'unavailable'
  } finally {
    busy.value = false
    emit('busy', false)
  }
}
</script>
<template>
  <div
    class="portal-environment mb-4"
    :class="{ 'is-production': auth.environment === 'prod' }"
  >
    <label
      for="telemetry-environment"
      class="form-label"
    >
      {{ words.label }}
    </label>
    <select
      id="telemetry-environment"
      class="form-select"
      :value="auth.environment"
      :disabled="disabled || busy"
      @change="change"
    >
      <option value="qa">{{ words.qa }}</option>
      <option value="prod">{{ words.prod }}</option>
    </select>
    <p class="portal-muted small mt-2 mb-0">{{ words.note }}</p>
    <p
      v-if="auth.environment === 'prod'"
      class="production-warning small mt-2 mb-0"
      role="status"
    >
      {{ words.production }}
    </p>
    <p
      v-if="busy"
      class="portal-muted small mt-2 mb-0"
      role="status"
    >
      {{ words.pending }}
    </p>
    <p
      v-if="error"
      class="portal-error mt-2 mb-0"
      role="alert"
    >
      {{ common[error] }}
    </p>
  </div>
</template>
<style scoped>
.portal-environment {
  padding: 16px;
  border: 1px solid #64717e;
  border-radius: 8px;
}
.portal-environment.is-production {
  border-color: #ffad46;
  background: #47301855;
}
.production-warning {
  color: #ffbf6c;
  font-weight: 700;
}
</style>
