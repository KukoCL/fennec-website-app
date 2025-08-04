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
  <div class="services-page">
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
                  Descubre Nuestros Servicios
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

<style scoped>
/* Títulos y texto en blanco para contraste */
.services-page h2,
.services-page .display-5 {
  color: #ffffff !important;
}
.services-page .lead {
  color: #cccccc !important;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #ff8c00 100%);
  position: relative;
  z-index: 1;
  min-height: 60vh;
  display: flex;
  align-items: center;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  margin: 0 10px;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #000000 0%, #ff6600 100%);
  opacity: 0.8;
  z-index: -1;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

/* Elementos decorativos para el Hero */
.hero-decoration-1 {
  width: 300px;
  height: 300px;
  background: rgba(255, 140, 0, 0.1);
  border-radius: 50%;
  top: -150px;
  right: -150px;
  animation: float 8s ease-in-out infinite;
}

.hero-decoration-2 {
  width: 200px;
  height: 200px;
  background: rgba(255, 140, 0, 0.05);
  border-radius: 50%;
  bottom: -100px;
  left: -100px;
  animation: float 10s ease-in-out infinite reverse;
}

.hero-decoration-3 {
  width: 100px;
  height: 100px;
  background: rgba(255, 140, 0, 0.08);
  border-radius: 50%;
  top: 20%;
  left: 10%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Texto del Hero con efectos */
.hero-title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 1s ease-out;
}

.hero-description {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease-out 0.3s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Botón Hero mejorado */
.hero-btn {
  background: linear-gradient(45deg, #0f0f0f, #383736);
  color: #ffffff;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
  text-decoration: none;
  display: inline-block;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.hero-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.8s ease;
}

.hero-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 140, 0, 0.5);
  color: #ffffff;
  text-decoration: none;
  background: linear-gradient(45deg, #ff8c00, #ff6600);
}

.hero-btn:hover::before {
  left: 100%;
}

.hero-btn .btn-content {
  position: relative;
  z-index: 1;
}

/* Tarjetas de servicio con fondo negro */
.service-card {
  background-color: #383636 !important;
  color: #ffffff !important;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 140, 0, 0.3) !important;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(255, 140, 0, 0.4) !important;
  border: 1px solid rgba(255, 140, 0, 0.6) !important;
}

/* Texto de las tarjetas */
.service-card .card-title {
  color: #ffffff !important;
}

.service-card .card-text {
  color: #cccccc !important;
}

.service-card .list-unstyled li span {
  color: #cccccc !important;
}

.service-icon {
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
}

.service-card:hover .service-icon {
  transform: scale(1.1);
}

/* CTA Section con gradiente mejorado */
.cta-section {
  background: linear-gradient(135deg, #000000 0%, #ff8c00 100%);
  position: relative;
  z-index: 1;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #ff6600 100%);
  opacity: 0.9;
  z-index: -1;
}

/* Elementos decorativos para el CTA */
.cta-decoration {
  width: 200px;
  height: 200px;
  background: rgba(255, 140, 0, 0.1);
  border-radius: 50%;
  top: -100px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

.cta-decoration-2 {
  width: 150px;
  height: 150px;
  background: rgba(255, 140, 0, 0.05);
  border-radius: 50%;
  bottom: -75px;
  left: -75px;
  animation: float 8s ease-in-out infinite reverse;
}

/* Botón CTA mejorado */
.cta-btn {
  background: linear-gradient(45deg, #ff8c00, #ff6600);
  color: #ffffff;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  transition: all 0.4s ease;
  text-decoration: none;
  display: inline-block;
}

.cta-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.8s ease;
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 140, 0, 0.6);
  color: #ffffff;
  text-decoration: none;
  background: linear-gradient(45deg, #000000, #333333);
}

.cta-btn:hover::before {
  left: 100%;
}

.cta-btn .btn-content {
  position: relative;
  z-index: 1;
}

/* Botones personalizados mejorados */
.custom-btn {
  padding: 5px 10px;
  border-radius: 25px;
  font-weight: 400;
  /*text-transform: uppercase;*/
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.custom-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.custom-btn:hover::before {
  left: 100%;
}

.custom-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 140, 0, 0.3);
}

.btn-content {
  position: relative;
  z-index: 1;
}

/* Sección de tecnologías */
.tech-logo {
  transition: all 0.3s ease;
  border-radius: 10px;
  background-color: rgba(255, 140, 0, 0.05);
  border: 1px solid rgba(255, 140, 0, 0.2);
}

.tech-logo:hover {
  background-color: rgba(255, 140, 0, 0.2);
  transform: scale(1.1);
  border: 1px solid rgba(255, 140, 0, 0.5);
}

.tech-logo p {
  color: #ffffff !important;
}


/* Blue color classes - emulando Bootstrap */
:root {
  --blue: #007bff;
  --blue-rgb: 0, 123, 255;
}

.text-blue {
  color: #007bff !important;
}

.bg-blue {
  background-color: #007bff !important;
}

.bg-blue.bg-opacity-10 {
  background-color: rgba(0, 123, 255, 0.1) !important;
}

.bg-blue.bg-opacity-25 {
  background-color: rgba(0, 123, 255, 0.25) !important;
}

.bg-blue.bg-opacity-50 {
  background-color: rgba(0, 123, 255, 0.5) !important;
}

.bg-blue.bg-opacity-75 {
  background-color: rgba(0, 123, 255, 0.75) !important;
}

.btn-blue {
  --bs-btn-color: #fff;
  --bs-btn-bg: #007bff;
  --bs-btn-border-color: #007bff;
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: #0056b3;
  --bs-btn-hover-border-color: #0052a3;
  --bs-btn-focus-shadow-rgb: 38, 143, 255;
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: #0052a3;
  --bs-btn-active-border-color: #004e96;
  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: #fff;
  --bs-btn-disabled-bg: #007bff;
  --bs-btn-disabled-border-color: #007bff;
  background-color: var(--bs-btn-bg);
  border-color: var(--bs-btn-border-color);
  color: var(--bs-btn-color);
}

.btn-blue:hover {
  background-color: var(--bs-btn-hover-bg);
  border-color: var(--bs-btn-hover-border-color);
  color: var(--bs-btn-hover-color);
}

.btn-blue:focus {
  background-color: var(--bs-btn-hover-bg);
  border-color: var(--bs-btn-hover-border-color);
  color: var(--bs-btn-hover-color);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), 0.5);
}

.btn-blue:active,
.btn-blue.active {
  background-color: var(--bs-btn-active-bg);
  border-color: var(--bs-btn-active-border-color);
  color: var(--bs-btn-active-color);
  box-shadow: var(--bs-btn-active-shadow);
}

.btn-blue:disabled,
.btn-blue.disabled {
  background-color: var(--bs-btn-disabled-bg);
  border-color: var(--bs-btn-disabled-border-color);
  color: var(--bs-btn-disabled-color);
  opacity: 0.65;
}

.btn-outline-blue {
  --bs-btn-color: #007bff;
  --bs-btn-border-color: #007bff;
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: #007bff;
  --bs-btn-hover-border-color: #007bff;
  --bs-btn-focus-shadow-rgb: 0, 123, 255;
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: #007bff;
  --bs-btn-active-border-color: #007bff;
  --bs-btn-disabled-color: #007bff;
  --bs-btn-disabled-bg: transparent;
  --bs-btn-disabled-border-color: #007bff;
  color: var(--bs-btn-color);
  border-color: var(--bs-btn-border-color);
}

.border-blue {
  border-color: #007bff !important;
}

.alert-blue {
  --bs-alert-color: #084298;
  --bs-alert-bg: #cff4fc;
  --bs-alert-border-color: #b6effb;
  color: var(--bs-alert-color);
  background-color: var(--bs-alert-bg);
  border-color: var(--bs-alert-border-color);
}

/* Purple color classes - emulando Bootstrap */
:root {
  --purple: #6f42c1;
  --purple-rgb: 111, 66, 193;
}

.text-purple {
  color: #6f42c1 !important;
}

.bg-purple {
  background-color: #6f42c1 !important;
}

.bg-purple.bg-opacity-10 {
  background-color: rgba(111, 66, 193, 0.1) !important;
}

.bg-purple.bg-opacity-25 {
  background-color: rgba(111, 66, 193, 0.25) !important;
}

.bg-purple.bg-opacity-50 {
  background-color: rgba(111, 66, 193, 0.5) !important;
}

.bg-purple.bg-opacity-75 {
  background-color: rgba(111, 66, 193, 0.75) !important;
}

.btn-purple {
  --bs-btn-color: #fff;
  --bs-btn-bg: #6f42c1;
  --bs-btn-border-color: #6f42c1;
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: #5d39a6;
  --bs-btn-hover-border-color: #5a359a;
  --bs-btn-focus-shadow-rgb: 130, 95, 204;
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: #5a359a;
  --bs-btn-active-border-color: #56338e;
  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: #fff;
  --bs-btn-disabled-bg: #6f42c1;
  --bs-btn-disabled-border-color: #6f42c1;
  background-color: var(--bs-btn-bg);
  border-color: var(--bs-btn-border-color);
  color: var(--bs-btn-color);
}

.btn-purple:hover {
  background-color: var(--bs-btn-hover-bg);
  border-color: var(--bs-btn-hover-border-color);
  color: var(--bs-btn-hover-color);
}

.btn-purple:focus {
  background-color: var(--bs-btn-hover-bg);
  border-color: var(--bs-btn-hover-border-color);
  color: var(--bs-btn-hover-color);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), 0.5);
}

.btn-purple:active,
.btn-purple.active {
  background-color: var(--bs-btn-active-bg);
  border-color: var(--bs-btn-active-border-color);
  color: var(--bs-btn-active-color);
  box-shadow: var(--bs-btn-active-shadow);
}

.btn-purple:disabled,
.btn-purple.disabled {
  background-color: var(--bs-btn-disabled-bg);
  border-color: var(--bs-btn-disabled-border-color);
  color: var(--bs-btn-disabled-color);
  opacity: 0.65;
}

.btn-outline-purple {
  --bs-btn-color: #6f42c1;
  --bs-btn-border-color: #6f42c1;
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: #6f42c1;
  --bs-btn-hover-border-color: #6f42c1;
  --bs-btn-focus-shadow-rgb: 111, 66, 193;
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: #6f42c1;
  --bs-btn-active-border-color: #6f42c1;
  --bs-btn-disabled-color: #6f42c1;
  --bs-btn-disabled-bg: transparent;
  --bs-btn-disabled-border-color: #6f42c1;
  color: var(--bs-btn-color);
  border-color: var(--bs-btn-border-color);
}

.border-purple {
  border-color: #6f42c1 !important;
}

.alert-purple {
  --bs-alert-color: #41295a;
  --bs-alert-bg: #f7f3ff;
  --bs-alert-border-color: #e5d9f2;
  color: var(--bs-alert-color);
  background-color: var(--bs-alert-bg);
  border-color: var(--bs-alert-border-color);
}
</style>
