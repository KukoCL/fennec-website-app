<script setup lang="ts">
import '@/assets/portal.css'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppSettingsStore } from '@/stores/appSettingsStore'
import { simulatorCatalog } from '@/features/portal/simulators'
const settings = useAppSettingsStore()
const texts = computed(() => settings.appLanguage === 'en' ? {
  title: 'Simulator portal', description: 'Telemetry and authorized device management.',
  open: 'Open dashboard', available: 'AVAILABLE VIEW',
  scope: 'The current telemetry API does not provide simulator IDs. Device records are not partitioned by simulator.',
  future: 'Only Jumbo is configured in this portal. Additional simulators require real IDs and ' +
    'separate backend access scopes.',
} : {
  title: 'Portal de simuladores', description: 'Telemetría y administración autorizada de dispositivos.',
  open: 'Abrir dashboard', available: 'VISTA DISPONIBLE',
  scope: 'La API de telemetría actual no informa IDs de simulador. Los registros de ' +
    'dispositivos no están separados por simulador.',
  future: 'Solo Jumbo está configurado en este portal. Agregar simuladores requiere sus IDs ' +
    'reales y alcances de acceso separados en el backend.',
})
</script>
<template>
  <section class="portal-page" aria-labelledby="portal-home-title">
    <div class="portal-eyebrow">FENNECSOFT / PORTAL</div>
    <h1 id="portal-home-title">{{ texts.title }}</h1>
    <p class="portal-muted">{{ texts.description }}</p>
    <div class="portal-simulator-grid mt-4">
      <article v-for="simulator in simulatorCatalog" :key="simulator.navigationKey" class="portal-panel">
        <div class="portal-eyebrow">{{ texts.available }}</div>
        <h2 class="mb-3">{{ simulator.name }}</h2>
        <RouterLink :to="{ name: simulator.routeName }" class="portal-button d-inline-block">{{ texts.open }} →</RouterLink>
      </article>
    </div>
    <p class="portal-notice mt-4">{{ texts.scope }}</p>
    <p class="portal-muted small">{{ texts.future }}</p>
  </section>
</template>
<style scoped>
.portal-simulator-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 20px; }
</style>
