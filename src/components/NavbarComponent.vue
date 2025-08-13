<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useAppSettingsStore } from '@/stores/appSettingsStore';
import { storeToRefs } from 'pinia';
import useAppLang from '@/composables/settings/useAppLang';

const { getAppTexts } = useAppLang();
const appTexts = computed(() => getAppTexts());

const isNavCollapsed = ref(true);
const appSettingsStore = useAppSettingsStore();
const { appLanguage } = storeToRefs(appSettingsStore);

const toggleNav = () => {
  isNavCollapsed.value = !isNavCollapsed.value;
};

const changeLanguage = (lang: 'es' | 'en') => {
  appSettingsStore.appLanguage = lang;
  isNavCollapsed.value = true; // Close mobile menu after selection
  localStorage.setItem('appLanguage', lang); // Persist language choice
};

const currentLanguageLabel = computed(() => {
  return appLanguage.value === 'es' ? 'ES' : 'EN';
});
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">
        <img src="/favicon.ico" alt="Logo" width="45" height="40" class="d-inline-block align-top me-2 fennec-logo" />
        <span class="brand-text">{{ appTexts.navbar.brand1 }}<span class="text-fennec-orange">{{ appTexts.navbar.brand2 }}</span></span>
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
  background-color: #121212e6;
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0.5rem 0;
  border-bottom: 1px solid #3d3d3d33;
}

.navbar-brand {
  font-size: 1.5rem;
  padding: 0;
  transition: all 0.3s ease;
  background: transparent;
}

.navbar-brand:hover {
  transform: translateY(-1px);
  background: transparent;
}

.brand-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: white;
  transition: all 0.3s ease;
}

.navbar-brand:hover .brand-text {
  color: #D1D5DB;
}

.navbar-brand:hover .text-fennec-orange {
  color: #FFA533;
}

.text-fennec-orange {
  color: #FF8C00;
  transition: color 0.3s ease;
}

.nav-link {
  font-weight: 500;
  color: #D1D5DB !important;
  transition: color 0.3s ease;
  position: relative;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  background: transparent;
}

.nav-link:hover, .nav-link.router-link-active {
  color: #FF8C00 !important;
  background: transparent;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #FF8C00;
}

.navbar-toggler {
  border-color: #3d3d3d33;
  padding: 0.5rem;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.dropdown-menu {
  background-color: #1E1E1E;
  border: 1px solid #3d3d3d33;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
}

.dropdown-item {
  color: #D1D5DB;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
  border-radius: 4px;
  background: transparent;
}

.dropdown-item:hover {
  background: transparent;
  color: #FF8C00;
}

.dropdown-item.active {
  background: transparent;
  color: #FF8C00;
  font-weight: 600;
}

.fennec-logo {
  transition: all 0.3s ease;
  background: transparent;
}

.fennec-logo:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 8px rgba(255, 140, 0, 0.4));
  background: transparent;
}

/* Línea separadora en el menú de idiomas */
.vr {
  background-color: #3d3d3d33;
  opacity: 0.5;
}

hr {
  opacity: 0.1;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    background-color: #121212e6;
    backdrop-filter: blur(8px);
    padding: 1rem;
    border-radius: 8px;
    margin-top: 0.5rem;
    border: 1px solid #3d3d3d33;
  }

  .nav-link {
    padding: 0.75rem 1rem;
  }

  .nav-link.router-link-active::after {
    display: none;
  }
}
</style>
