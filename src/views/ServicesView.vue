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
  price: string
}

const services: Service[] = [
  {
    id: 'web-development',
    icon: 'code',
    title: appTexts.value.servicesList.webDevelopment.title,
    description: appTexts.value.servicesList.webDevelopment.description,
    features: appTexts.value.servicesList.webDevelopment.features,
    color: 'dark',
    price: appTexts.value.servicesList.webDevelopment.price,
  },
  {
    id: 'mobile-apps',
    icon: 'mobile-screen-button',
    title: appTexts.value.servicesList.mobileApps.title,
    description: appTexts.value.servicesList.mobileApps.description,
    features: appTexts.value.servicesList.mobileApps.features,
    color: 'success',
    price: appTexts.value.servicesList.mobileApps.price,
  },
  {
    id: 'cloud-solutions',
    icon: 'cloud',
    title: appTexts.value.servicesList.cloudSolutions.title,
    description: appTexts.value.servicesList.cloudSolutions.description,
    features: appTexts.value.servicesList.cloudSolutions.features,
    color: 'info',
    price: appTexts.value.servicesList.cloudSolutions.price,
  },
  {
    id: 'data-analytics',
    icon: 'chart-column',
    title: appTexts.value.servicesList.dataAnalytics.title,
    description: appTexts.value.servicesList.dataAnalytics.description,
    features: appTexts.value.servicesList.dataAnalytics.features,
    color: 'warning',
    price: appTexts.value.servicesList.dataAnalytics.price,
  },
  {
    id: 'cybersecurity',
    icon: 'shield-halved',
    title: appTexts.value.servicesList.cybersecurity.title,
    description: appTexts.value.servicesList.cybersecurity.description,
    features: appTexts.value.servicesList.cybersecurity.features,
    color: 'danger',
    price: appTexts.value.servicesList.cybersecurity.price,
  },
  {
    id: 'consulting',
    icon: 'handshake',
    title: appTexts.value.servicesList.consulting.title,
    description: appTexts.value.servicesList.consulting.description,
    features: appTexts.value.servicesList.consulting.features,
    color: 'secondary',
    price: appTexts.value.servicesList.consulting.price,
  },
];
</script>

<template>
    <div class="services-page">
    <!-- Hero Section -->
    <section class="hero-section d-flex align-items-center">
      <div class="container px-4 px-lg-5">
        <div class="row gx-4 gx-lg-5 align-items-center g-5">
          <div class="col-lg-6">
            <h1 class="display-3 fw-bolder mb-4 mt-3 text-gradient">{{ appTexts.hero.title }}</h1>
            <p class="lead fs-4 mb-4 text-light-custom">
              {{ appTexts.hero.description }}
            </p>
          </div>
          <div class="col-lg-6">
            <div class="custom-dark-bg rounded-3 p-4 shadow-lg">
              <div class="feature-card rounded p-4 text-center">
                <FontAwesomeIcon icon="rocket" class="text-fennec-orange fs-1 mb-3" />
                <h4 class="text-white mb-3">Servicios Profesionales</h4>
                <p class="text-light-custom mb-0">
                  Soluciones tecnológicas innovadoras para impulsar tu negocio al siguiente nivel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-5">
      <div class="container">
        <div class="row g-4">
          <div v-for="service in services" :key="service.id" class="col-lg-4 col-md-6">
            <div class="card h-100 border-0 shadow-sm service-card">
              <div class="card-body p-4">
                <div
                  class="service-icon mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  :class="`bg-${service.color} bg-opacity-10`"
                >
                  <FontAwesomeIcon :icon="service.icon" :class="`text-${service.color} fs-2`" />
                </div>

                <h4 class="card-title fw-bold text-center mb-3">{{ service.title }}</h4>
                <p class="card-text text-muted text-center mb-4">{{ service.description }}</p>

                <ul class="list-unstyled mb-4">
                  <li v-for="feature in service.features" :key="feature" class="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon="check" class="text-success me-2" />
                    <span class="small">{{ feature }}</span>
                  </li>
                </ul>

                <div class="text-center">
                  <p class="fw-bold mb-3" :class="`text-${service.color}`">{{ service.price }}</p>
                  <router-link to="/contact" :class="`btn btn-${service.color} btn-sm`">
                    {{ appTexts.common.getStarted }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3">{{ appTexts.process.title }}</h2>
            <p class="lead text-muted">
              {{ appTexts.process.description }}
            </p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="text-center process-step">
              <div
                class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <span class="fw-bold fs-4">1</span>
              </div>
              <h5 class="fw-bold mb-2">{{ appTexts.process.steps.discovery.title }}</h5>
              <p class="text-muted small">
                {{ appTexts.process.steps.discovery.description }}
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center process-step">
              <div
                class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <span class="fw-bold fs-4">2</span>
              </div>
              <h5 class="fw-bold mb-2">{{ appTexts.process.steps.design.title }}</h5>
              <p class="text-muted small">
                {{ appTexts.process.steps.design.description }}
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center process-step">
              <div
                class="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <span class="fw-bold fs-4">3</span>
              </div>
              <h5 class="fw-bold mb-2">{{ appTexts.process.steps.development.title }}</h5>
              <p class="text-muted small">
                {{ appTexts.process.steps.development.description }}
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center process-step">
              <div
                class="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <span class="fw-bold fs-4">4</span>
              </div>
              <h5 class="fw-bold mb-2">{{ appTexts.process.steps.launch.title }}</h5>
              <p class="text-muted small">
                {{ appTexts.process.steps.launch.description }}
              </p>
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
              <FontAwesomeIcon :icon="['fab', 'aws']" class="text-warning" style="font-size: 3rem" />
              <p class="small mt-2 mb-0">AWS</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon :icon="['fab', 'docker']" class="text-info" style="font-size: 3rem" />
              <p class="small mt-2 mb-0">Docker</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5 bg-primary text-white px-3">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h2 class="display-6 fw-bold mb-3">{{ appTexts.cta.title }}</h2>
            <p class="lead mb-0">
              {{ appTexts.cta.description }}
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <router-link to="/contact" class="btn btn-light btn-lg">
              <FontAwesomeIcon icon="comment" class="me-2" />
              {{ appTexts.cta.button }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-section {
  background-color: rgb(17, 24, 39);
  position: relative;
  overflow: hidden;
  padding: 100px 0;
}

.text-gradient {
  background: linear-gradient(90deg, #FF8C00, #DAA520);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.custom-dark-bg {
  background-color: #1E1E1E;
  border: 1px solid #3D3D3D33;
}

.service-card {
  transition: all 0.3s ease;
  background-color: #1E1E1E;
  border: 1px solid #3D3D3D33;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
}

.service-icon {
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
}

.service-card:hover .service-icon {
  transform: scale(1.1);
}

.process-step {
  transition: all 0.3s ease;
  background-color: #1E1E1E;
  border: 1px solid #3D3D3D33;
  padding: 2rem;
  border-radius: 8px;
}

.process-step:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(255, 140, 0, 0.1);
}

.tech-logo {
  transition: all 0.3s ease;
  border-radius: 10px;
  background-color: #1E1E1E;
  border: 1px solid #3D3D3D33;
}

.tech-logo:hover {
  background-color: #2D2D2D;
  transform: scale(1.1);
  box-shadow: 0 10px 25px -5px rgba(255, 140, 0, 0.1);
}

.text-fennec-orange {
  color: #FF8C00;
}

.text-light-custom {
  color: #D1D5DB;
}

/* Estilos consistentes para las secciones */
section {
  background-color: rgb(17, 24, 39);
  position: relative;
  overflow: hidden;
  padding: 80px 0;
}

section.bg-light {
  background-color: rgb(22, 29, 44);
}

section.bg-primary {
  background: linear-gradient(90deg, #FF8C00, #DAA520);
}

.card {
  background-color: #1E1E1E;
  border: 1px solid #3D3D3D33;
}

h2, h3, h4, h5 {
  color: #FFFFFF;
}

p {
  color: #D1D5DB;
}

.text-muted {
  color: #9CA3AF !important;
}

.btn-primary, .bg-primary {
  background-color: #FF8C00 !important;
  border-color: #FF8C00 !important;
}

.btn-primary:hover {
  background-color: #E67E00 !important;
  border-color: #E67E00 !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(255, 140, 0, 0.3);
}
</style>
