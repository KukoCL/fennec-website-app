import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { portalApi, PortalError, type DashboardSession } from '@/features/portal/api'

// Only session metadata and the CSRF nonce live in memory. The BFF owns the HttpOnly cookie.
export const useAuthStore = defineStore('auth', () => {
  const session = ref<DashboardSession | null>(null)
  const refreshUnavailable = ref(false)
  const isAuthenticated = computed(() => session.value !== null)
  let pendingSession: Promise<boolean> | null = null
  let pendingRefresh: Promise<void> | null = null
  let generation = 0
  async function restoreSession(): Promise<boolean> {
    if (pendingSession) return pendingSession
    const current = generation
    pendingSession = (async () => {
      try {
        const result = await portalApi.session()
        if (current === generation) session.value = result
        return session.value !== null
      } catch (error) {
        if (current !== generation) return session.value !== null
        if (error instanceof PortalError && error.code === 'sessionExpired') {
          session.value = null
          return false
        }
        // A temporary upstream outage must not discard a known session.
        throw error
      } finally {
        pendingSession = null
      }
    })()
    return pendingSession
  }
  async function login(email: string, password: string) {
    const current = ++generation
    const result = await portalApi.login(email, password)
    if (current === generation) {
      session.value = result
      refreshUnavailable.value = false
    }
  }
  async function refreshSession() {
    if (pendingRefresh) return pendingRefresh
    if (!session.value) return
    const current = generation
    const csrf = session.value.csrfToken
    pendingRefresh = (async () => {
      try {
        const result = await portalApi.refresh(csrf)
        if (current === generation) {
          session.value = result
          refreshUnavailable.value = false
        }
      } catch (error) {
        if (current !== generation) return
        if (error instanceof PortalError && error.code === 'sessionExpired') clearSession()
        else refreshUnavailable.value = true
        throw error
      } finally {
        pendingRefresh = null
      }
    })()
    return pendingRefresh
  }
  async function logout() {
    if (session.value) {
      try {
        await portalApi.logout(session.value.csrfToken)
      } catch (error) {
        // An already expired/revoked session is also signed out.
        if (!(error instanceof PortalError && error.code === 'sessionExpired')) throw error
      }
    }
    clearSession()
  }
  function clearSession() {
    generation++
    session.value = null
    refreshUnavailable.value = false
  }
  return { session, isAuthenticated, refreshUnavailable, restoreSession, login, logout, refreshSession, clearSession }
})
