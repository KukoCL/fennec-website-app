import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  portalApi, PortalError, clearSessionTransport, restoreSessionEnvironment, sessionPersistsOnReload,
  type TelemetryEnvironment, type DashboardSession,
} from '@/features/portal/api'

// Only metadata and CSRF are reactive. API transport owns the tab-scoped opaque credential.
export const useAuthStore = defineStore('auth', () => {
  const session = ref<DashboardSession | null>(null)
  const environment = ref<TelemetryEnvironment>(restoreSessionEnvironment())
  const refreshUnavailable = ref(false)
  const reloadSessionAvailable = ref(sessionPersistsOnReload())
  const isAuthenticated = computed(() => session.value !== null)
  let generation = 0
  let revision = 0
  let sessionOperation = 0
  let refreshOperation = 0
  let pendingSession: { generation: number; promise: Promise<boolean> } | null = null
  let pendingRefresh: { generation: number; promise: Promise<void> } | null = null
  function applyMetadata(result: DashboardSession) {
    session.value = result
    reloadSessionAvailable.value = sessionPersistsOnReload()
  }
  async function restoreSession(): Promise<boolean> {
    if (pendingRefresh?.generation === generation) {
      await pendingRefresh.promise
      return session.value !== null
    }
    if (pendingSession?.generation === generation) return pendingSession.promise
    const current = generation
    const observedRevision = revision
    const operation = ++sessionOperation
    const promise = (async () => {
      try {
        const result = await portalApi.session(environment.value)
        if (current === generation && observedRevision === revision) {
          applyMetadata(result)
          revision++
        }
        return session.value !== null
      } catch (error) {
        if (current !== generation || observedRevision !== revision) return session.value !== null
        if (error instanceof PortalError && (error.code === 'sessionExpired' || error.code === 'forbidden')) {
          clearSession()
          return false
        }
        // A temporary upstream outage must not discard a known session.
        throw error
      } finally {
        if (sessionOperation === operation) pendingSession = null
      }
    })()
    pendingSession = { generation: current, promise }
    return promise
  }
  async function login(email: string, password: string) {
    const current = ++generation
    revision++
    session.value = null
    reloadSessionAvailable.value = false
    refreshUnavailable.value = false
    const result = await portalApi.login(email, password, environment.value)
    if (current === generation) applyMetadata(result)
  }
  async function refreshSession() {
    if (pendingRefresh?.generation === generation) return pendingRefresh.promise
    if (!session.value) return
    const current = generation
    // A fresh Auth refresh takes precedence over any older GET metadata.
    const observedRevision = ++revision
    const csrf = session.value.csrfToken
    const operation = ++refreshOperation
    const promise = (async () => {
      try {
        const result = await portalApi.refresh(csrf, environment.value)
        if (current === generation && observedRevision === revision) {
          applyMetadata(result)
          refreshUnavailable.value = false
        }
      } catch (error) {
        if (current !== generation || observedRevision !== revision) return
        if (error instanceof PortalError
          && (error.code === 'sessionExpired' || error.code === 'forbidden')) clearSession()
        else refreshUnavailable.value = true
        throw error
      } finally {
        if (refreshOperation === operation) pendingRefresh = null
      }
    })()
    pendingRefresh = { generation: current, promise }
    return promise
  }
  async function logout() {
    const current = generation
    revision++
    if (session.value) {
      try { await portalApi.logout(session.value.csrfToken, environment.value) }
      catch (error) {
        if (!(error instanceof PortalError
          && (error.code === 'sessionExpired' || error.code === 'forbidden'))) throw error
      }
    }
    if (current !== generation) return false
    clearSession()
    return true
  }
  function clearSession() {
    clearSessionTransport()
    generation++; revision++
    sessionOperation++; refreshOperation++
    pendingSession = null; pendingRefresh = null
    session.value = null
    refreshUnavailable.value = false
    reloadSessionAvailable.value = false
  }
  async function changeEnvironment(next: TelemetryEnvironment) {
    if (next === environment.value) return
    const current = generation
    const previousEnvironment = environment.value
    // A later login or concurrent switch wins; never revoke one session then switch a newer one.
    if (!await logout() || generation !== current + 1 || environment.value !== previousEnvironment)
      throw new PortalError('unavailable')
    environment.value = next
  }
  return { reloadSessionAvailable, environment, changeEnvironment, session, isAuthenticated,
    refreshUnavailable, restoreSession, login, logout, refreshSession, clearSession }
})
