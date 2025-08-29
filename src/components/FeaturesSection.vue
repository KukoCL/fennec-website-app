<template>
  <section class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center mb-5">
          <h2 class="display-5 fw-bold text-white">{{ appTexts.title }}</h2>
          <p class="lead text-white">{{ appTexts.description }}</p>
        </div>
      </div>
      <div class="row g-4">
        <div v-for="service in services" :key="service.id" class="col-lg-4 col-md-6">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center p-4">
              <div
                class="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              >
                <FontAwesomeIcon :icon="service.icon" class="fa-lg" />
              </div>
              <h5 class="card-title">{{ appTexts.services[service.textKey].title }}</h5>
              <p class="card-text text-muted">
                {{ appTexts.services[service.textKey].description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useAppLang from '../composables/settings/useAppLang';

const { getAppTexts } = useAppLang();
const appTexts = computed(() => getAppTexts().home.featuresSection);

const services = [
  {
    id: 1,
    icon: 'laptop-code',
    textKey: 'webDevelopment' as keyof typeof appTexts.value.services,
  },
  {
    id: 2,
    icon: 'network-wired',
    textKey: 'systemsIntegration' as keyof typeof appTexts.value.services,
  },
  {
    id: 3,
    icon: 'robot',
    textKey: 'processAutomation' as keyof typeof appTexts.value.services,
  },
  {
    id: 4,
    icon: 'lightbulb',
    textKey: 'techConsulting' as keyof typeof appTexts.value.services,
  },
  {
    id: 5,
    icon: 'rocket',
    textKey: 'agileEmpowerment' as keyof typeof appTexts.value.services,
  },
  {
    id: 6,
    icon: 'chalkboard-teacher',
    textKey: 'trainingPrograms' as keyof typeof appTexts.value.services,
  },
];
</script>

<style scoped>
.feature-icon {
  width: 60px;
  height: 60px;
}

.card:hover {
  transform: translateY(-5px);
  transition: all 0.3s ease;
}
</style>
