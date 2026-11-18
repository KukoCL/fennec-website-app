<script setup lang="ts">
import '@/assets/portal.css'
import EnvironmentSelector from '@/features/portal/EnvironmentSelector.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { usePortalTexts } from '@/features/portal/texts'
import { PortalError, type PortalErrorCode } from '@/features/portal/api'

const texts = usePortalTexts()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
let alive = true
onBeforeUnmount(() => {
  alive = false
})
const email = ref('')
const password = ref('')
const revealPassword = ref(false)
const submitting = ref(false)
const error = ref<PortalErrorCode | 'loginRequired' | null>(null)
const routeError = computed(() => {
  const code = route.query.reason
  return code === 'sessionExpired' || code === 'configuration' || code === 'unavailable' || code === 'forbidden'
    ? texts.value[code]
    : ''
})
function environmentChanged() {
  password.value = ''
  error.value = null
}
async function submit() {
  if (submitting.value) return
  error.value = null
  if (!email.value.trim() || !password.value) {
    error.value = 'loginRequired'
    return
  }
  submitting.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    password.value = ''
    if (alive) await router.replace({ name: 'dashboard' })
  } catch (cause) {
    error.value = cause instanceof PortalError ? cause.code : 'unavailable'
    password.value = ''
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section
    class="portal-page"
    aria-labelledby="login-title"
  >
    <div class="portal-login">
      <div
        class="portal-login-icon"
        aria-hidden="true"
      >
        ⌑
      </div>
      <div class="portal-eyebrow">{{ texts.restricted }}</div>
      <h1 id="login-title">{{ texts.title }}</h1>
      <p class="portal-muted mb-4">{{ texts.loginDescription }}</p>
      <div
        v-if="error || routeError"
        class="portal-error mb-4"
        role="alert"
      >
        {{ error ? texts[error] : routeError }}
      </div>
      <EnvironmentSelector
        :disabled="submitting"
        @changed="environmentChanged"
      />
      <p class="portal-muted small">{{ texts.memorySession }}</p>
      <form
        class="portal-panel"
        @submit.prevent="submit"
      >
        <div class="mb-4">
          <label
            for="login-email"
            class="form-label"
          >
            {{ texts.email }}
          </label>
          <input
            id="login-email"
            v-model="email"
            class="form-control"
            type="email"
            autocomplete="username"
            required
            :disabled="submitting"
            maxlength="254"
          />
        </div>
        <div class="mb-4">
          <label
            for="login-password"
            class="form-label"
          >
            {{ texts.password }}
          </label>
          <div class="portal-password">
            <input
              id="login-password"
              v-model="password"
              class="form-control"
              :type="revealPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              :disabled="submitting"
            />
            <button
              type="button"
              class="portal-password-toggle"
              :aria-label="revealPassword ? texts.hidePassword : texts.showPassword"
              :aria-pressed="revealPassword"
              @click="revealPassword = !revealPassword"
            >
              {{ revealPassword ? texts.hide : texts.show }}
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="portal-button w-100"
          :disabled="submitting"
        >
          {{ submitting ? texts.signingIn : texts.login }}
        </button>
      </form>
      <div class="mt-4 text-center">
        <RouterLink
          to="/"
          class="portal-link"
        >
          ← {{ texts.backHome }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>
