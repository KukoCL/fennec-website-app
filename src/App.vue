<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { PortalError } from '@/features/portal/api'
import { useAuthStore } from '@/stores/authStore'
import Navbar from './components/NavbarComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
let refreshTimer: ReturnType<typeof setTimeout> | undefined
function scheduleRefresh() {
  clearTimeout(refreshTimer)
  if (!auth.session) return
  const delay = Math.max(1000, Date.parse(auth.session.expiresAtUtc) - Date.now() - 300_000)
  refreshTimer = setTimeout(refreshIfNeeded, Math.min(delay, 2_147_483_647))
}
async function refreshIfNeeded() {
  if (!auth.session || document.visibilityState === 'hidden') return
  if (Date.parse(auth.session.expiresAtUtc) - Date.now() > 300_000) {
    scheduleRefresh()
    return
  }
  try {
    await auth.refreshSession()
  } catch (error) {
    if (
      error instanceof PortalError &&
      (error.code === 'sessionExpired' || error.code === 'forbidden') &&
      !auth.isAuthenticated &&
      route.meta.requiresAuth
    ) {
      await router.replace({ name: 'login', query: { reason: error.code } })
    }
  } finally {
    clearTimeout(refreshTimer)
    if (auth.session) refreshTimer = setTimeout(refreshIfNeeded, 60_000)
  }
}
watch(() => auth.session?.expiresAtUtc, scheduleRefresh)
onMounted(() => {
  void auth.restoreSession().catch(() => undefined)
  window.addEventListener('focus', refreshIfNeeded)
  document.addEventListener('visibilitychange', refreshIfNeeded)
})
onBeforeUnmount(() => {
  clearTimeout(refreshTimer)
  window.removeEventListener('focus', refreshIfNeeded)
  document.removeEventListener('visibilitychange', refreshIfNeeded)
})
</script>

<template>
  <div>
    <Navbar />
    <main class="container-lg px-0">
      <RouterView />
    </main>
    <FooterComponent />
  </div>
</template>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

/* Custom theme colors */
:root {
  --primary-color: #0066cc;
  --secondary-color: #6c757d;
  --accent-color: #28a745;
  --dark-color: #212529;
  --light-color: #f8f9fa;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.text-primary {
  color: var(--primary-color) !important;
}

.bg-primary {
  background-color: var(--primary-color) !important;
}
</style>
