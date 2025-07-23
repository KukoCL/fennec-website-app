<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue'
import { useAppSettingsStore } from '@/stores/appSettingsStore'
import { storeToRefs } from 'pinia'

const isNavCollapsed = ref(true)
const appSettingsStore = useAppSettingsStore()
const { appLanguage } = storeToRefs(appSettingsStore)

const toggleNav = () => {
  isNavCollapsed.value = !isNavCollapsed.value
}

const changeLanguage = (lang: 'es' | 'en') => {
  appSettingsStore.appLanguage = lang
  isNavCollapsed.value = true // Close mobile menu after selection
}

const currentLanguageLabel = computed(() => {
  return appLanguage.value === 'es' ? 'Español' : 'English'
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand fw-bold" to="/">
        <img
          src="/favicon.ico"
          alt="Logo"
          width="30"
          height="30"
          class="d-inline-block align-top me-2"
        />
        Fennec
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: !isNavCollapsed }" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" @click="isNavCollapsed = true">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about" @click="isNavCollapsed = true"
              >About</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/services" @click="isNavCollapsed = true"
              >Services</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/portfolio" @click="isNavCollapsed = true"
              >Portfolio</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/contact" @click="isNavCollapsed = true"
              >Contact</RouterLink
            >
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
              {{ currentLanguageLabel }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="languageDropdown">
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="changeLanguage('es')"
                  :class="{ active: appLanguage === 'es' }"
                >
                  🇪🇸 Español
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="changeLanguage('en')"
                  :class="{ active: appLanguage === 'en' }"
                >
                  🇺🇸 English
                </a>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <RouterLink class="btn btn-primary ms-2" to="/contact" @click="isNavCollapsed = true"
              >Get Started</RouterLink
            >
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
