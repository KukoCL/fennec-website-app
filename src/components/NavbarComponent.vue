<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue'
import { useAppSettingsStore } from '@/stores/appSettingsStore'
import { storeToRefs } from 'pinia'
import useAppLang from '@/composables/settings/useAppLang'

const { getAppTexts } = useAppLang()
const appTexts = computed(() => getAppTexts())

const isNavCollapsed = ref(true)
const appSettingsStore = useAppSettingsStore()
const { appLanguage } = storeToRefs(appSettingsStore)

const toggleNav = () => {
  isNavCollapsed.value = !isNavCollapsed.value
}

const changeLanguage = (lang: 'es' | 'en') => {
  appSettingsStore.appLanguage = lang
  isNavCollapsed.value = true // Close mobile menu after selection
  localStorage.setItem('appLanguage', lang) // Persist language choice
}

const currentLanguageLabel = computed(() => {
  return appLanguage.value === 'es' ? 'ES' : 'EN'
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">
        <img
          src="/favicon.ico"
          alt="Logo"
          width="30"
          height="30"
          class="d-inline-block align-top me-2"
        />
        {{ appTexts.navbar.brand }}
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        :aria-label="appTexts.navbar.toggleNavigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: !isNavCollapsed }" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" @click="isNavCollapsed = true">{{
              appTexts.navbar.navigation.home
            }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about" @click="isNavCollapsed = true">{{
              appTexts.navbar.navigation.about
            }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/services" @click="isNavCollapsed = true">{{
              appTexts.navbar.navigation.services
            }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/portfolio" @click="isNavCollapsed = true">{{
              appTexts.navbar.navigation.portfolio
            }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/contact" @click="isNavCollapsed = true">{{
              appTexts.navbar.navigation.contact
            }}</RouterLink>
          </li>
          <li class="nav-item py-2 py-lg-1 col-12 col-lg-auto">
            <div class="vr d-none d-lg-flex h-100 mx-lg-2 text-white"></div>
            <hr class="d-lg-none my-2 text-white-50" />
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="languageDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <h6 class="d-inline-block mb-0">{{ currentLanguageLabel }}</h6>
            </a>
            <ul class="dropdown-menu" aria-labelledby="languageDropdown">
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="changeLanguage('es')"
                  :class="{ active: appLanguage === 'es' }"
                >
                  🇪🇸 {{ appTexts.navbar.language.spanish }}
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="changeLanguage('en')"
                  :class="{ active: appLanguage === 'en' }"
                >
                  🇺🇸 {{ appTexts.navbar.language.english }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: relative;
  z-index: 1000;
}

.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ffffff !important;
}

.router-link-active:not(.btn) {
  color: #ffffff !important;
  font-weight: bold;
}

.btn-primary {
  padding: 0.5rem 1rem;
  border-radius: 25px;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.active {
  background-color: #007bff;
  color: white;
}

.dropdown-toggle::after {
  margin-left: 0.5rem;
}
</style>
