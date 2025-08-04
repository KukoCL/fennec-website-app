<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useAppLang from '@/composables/settings/useAppLang';

const { getAppTexts } = useAppLang();
const appTexts = computed(() => getAppTexts().services);

interface Service {
  id: string
  icon: string
  title: string
  description: string
  features: string[]
  color: string
  contact: string
}

const services: Service[] = [
  {
    id: 'web-development',
    icon: 'code',
    title: appTexts.value.servicesList.webDevelopment.title,
    description: appTexts.value.servicesList.webDevelopment.description,
    features: appTexts.value.servicesList.webDevelopment.features,
    color: 'blue',
    contact: appTexts.value.servicesList.webDevelopment.contact,
  },
  {
    id: 'systems-integration',
    icon: 'puzzle-piece',
    title: appTexts.value.servicesList.systemsIntegration.title,
    description: appTexts.value.servicesList.systemsIntegration.description,
    features: appTexts.value.servicesList.systemsIntegration.features,
    color: 'info',
    contact: appTexts.value.servicesList.systemsIntegration.contact,
  },
  {
    id: 'process-automation',
    icon: 'wand-magic-sparkles',
    title: appTexts.value.servicesList.processAutomation.title,
    description: appTexts.value.servicesList.processAutomation.description,
    features: appTexts.value.servicesList.processAutomation.features,
    color: 'success',
    contact: appTexts.value.servicesList.processAutomation.contact,
  },
  {
    id: 'tech-consulting',
    icon: 'comments',
    title: appTexts.value.servicesList.techConsulting.title,
    description: appTexts.value.servicesList.techConsulting.description,
    features: appTexts.value.servicesList.techConsulting.features,
    color: 'warning',
    contact: appTexts.value.servicesList.techConsulting.contact,
  },
  {
    id: 'agile-empowerment',
    icon: 'arrows-up-down-left-right',
    title: appTexts.value.servicesList.agileEmpowerment.title,
    description: appTexts.value.servicesList.agileEmpowerment.description,
    features: appTexts.value.servicesList.agileEmpowerment.features,
    color: 'danger',
    contact: appTexts.value.servicesList.agileEmpowerment.contact,
  },
  {
    id: 'training-programs',
    icon: 'chalkboard-teacher',
    title: appTexts.value.servicesList.trainingPrograms.title,
    description: appTexts.value.servicesList.trainingPrograms.description,
    features: appTexts.value.servicesList.trainingPrograms.features,
    color: 'purple',
    contact: appTexts.value.servicesList.trainingPrograms.contact,
  },
];
</script>

<template>
  <div class="services-page page-content">
    <!-- Hero Section -->
    <section class="hero-section text-white py-5 position-relative overflow-hidden">
      <div class="container position-relative">
        <div class="row align-items-center py-5">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="display-4 fw-bold mb-4 hero-title">{{ appTexts.hero.title }}</h1>
            <p class="lead hero-description">
              {{ appTexts.hero.description }}
            </p>
            <div class="mt-4">
              <router-link to="/contact" class="btn hero-btn position-relative overflow-hidden">
                <span class="btn-content">
                  <FontAwesomeIcon icon="rocket" class="me-2" />
                  {{ appTexts.hero.button }}
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- Elementos decorativos -->
      <div class="hero-decoration-1 position-absolute"></div>
      <div class="hero-decoration-2 position-absolute"></div>
      <div class="hero-decoration-3 position-absolute"></div>
    </section>

    <!-- Services Grid -->
    <section class="py-5">
      <div class="container">
        <div class="row g-4">
          <div v-for="service in services" :key="service.id" class="col-lg-4 col-md-6">
            <div class="card h-100 border-0 shadow-sm service-card">
              <div class="card-body p-4 d-flex flex-column">
                <div
                  class="service-icon mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  :class="`bg-${service.color} bg-opacity-10`"
                >
                  <FontAwesomeIcon :icon="service.icon" :class="`text-${service.color} fs-2`" />
                </div>

                <h4 class="card-title fw-bold text-center mb-3">{{ service.title }}</h4>
                <p class="card-text text-muted text-center mb-4">{{ service.description }}</p>

                <ul class="list-unstyled mb-4 flex-grow-1">
                  <li v-for="feature in service.features" :key="feature" class="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon="check" class="text-success me-2" />
                    <span class="small">{{ feature }}</span>
                  </li>
                </ul>

                <div class="text-center mt-auto">
                  <router-link to="/contact" :class="`btn btn-${service.color} custom-btn position-relative overflow-hidden`">
                   <FontAwesomeIcon icon="arrow-right" class="me-2" />
                    {{ service.contact }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technologies Section -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3">{{ appTexts.technologies.title }}</h2>
            <p class="lead text-muted">
              {{ appTexts.technologies.description }}
            </p>
          </div>
        </div>

        <div class="row g-4 align-items-center justify-content-center">
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon :icon="['fab', 'react']" class="text-info" style="font-size: 3rem" />
              <p class="small mt-2 mb-0">React</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon :icon="['fab', 'vuejs']" class="text-success" style="font-size: 3rem" />
              <p class="small mt-2 mb-0">Vue.js</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon :icon="['fab', 'node-js']" class="text-success" style="font-size: 3rem" />
              <p class="small mt-2 mb-0">Node.js</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon :icon="['fab', 'python']" class="text-primary" style="font-size: 3rem" />
              <p class="small mt-2 mb-0">Python</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon :icon="['fab', 'bootstrap']" class="text-purple" style="font-size: 3rem" />
              <p class="small mt-2 mb-0">Bootstrap</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon :icon="['fab', 'windows']" class="text-info" style="font-size: 3rem" />
              <p class="small mt-2 mb-0">.NET Core</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-5 bg-primary text-white px-3">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h2 class="display-6 fw-bold mb-3">{{ appTexts.cta.title }}</h2>
            <p class="lead mb-0">
              {{ appTexts.cta.description }}
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <router-link to="/contact" class="btn cta-btn position-relative overflow-hidden">
              <FontAwesomeIcon icon="comment" class="me-2" />
              {{ appTexts.cta.button }}
            </router-link>
          </div>
        </div>
      </div>
      <!-- Elementos decorativos -->
      <div class="cta-decoration position-absolute"></div>
      <div class="cta-decoration-2 position-absolute"></div>
    </section>
  </div>
</template>
