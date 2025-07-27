<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import useAppLang from '@/composables/settings/useAppLang';

const { getAppTexts } = useAppLang();
const appTexts = computed(() => getAppTexts().home.heroSection);
</script>

<template>
  <section class="hero-section d-flex align-items-center">
    <div class="container py-5">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <h1 class="display-3 fw-bolder mb-4 mt-3 text-gradient">{{ appTexts.headerTitle }}</h1>
          <p class="lead fs-4 mb-4 text-light-custom">
            {{ appTexts.description }}
          </p>
          <div class="d-flex flex-column flex-sm-row gap-3">
            <RouterLink to="/contact" class="btn btn-orange-custom btn-lg px-4 py-3">{{ appTexts.buttons.getStarted }}</RouterLink>
            <RouterLink to="/services" class="btn btn-outline-orange-custom btn-lg px-4 py-3">
              {{ appTexts.buttons.ourServices }}
            </RouterLink>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="position-relative">
            <div class="custom-dark-bg rounded-3 p-4 shadow-lg mt-3">
              <div class="row g-3">
                <div class="col-6">
                  <div class="feature-card rounded p-3 text-center">
                    <FontAwesomeIcon icon="rocket" class="text-fennec-orange fs-2 mb-2" />
                    <h6 class="text-white mb-0">{{ appTexts.features.fastDelivery }}</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="feature-card rounded p-3 text-center">
                    <FontAwesomeIcon icon="shield-halved" class="text-fennec-orange fs-2 mb-2" />
                    <h6 class="text-white mb-0">{{ appTexts.features.secure }}</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="feature-card rounded p-3 text-center">
                    <FontAwesomeIcon icon="users" class="text-fennec-orange fs-2 mb-2" />
                    <h6 class="text-white mb-0">{{ appTexts.features.support }}</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="feature-card rounded p-3 text-center">
                    <FontAwesomeIcon icon="chart-line" class="text-fennec-orange fs-2 mb-2" />
                    <h6 class="text-white mb-0">{{ appTexts.features.analytics }}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="text-center pb-4">
      <FontAwesomeIcon icon="chevron-down" class="fa-2x opacity-50 bounce" />
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  background-color: rgb(17, 24, 39);
  position: relative;
  overflow: hidden;
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

.feature-card {
  background-color: #2D2D2D;
  transition: all 0.3s ease;
  border: 1px solid #3D3D3D33;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(255, 140, 0, 0.1);
}

.btn-orange-custom {
  background-color: #FF8C00;
  color: white;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-orange-custom:hover {
  background-color: #FF8C00;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(255, 140, 0, 0.3);
}

.btn-outline-orange-custom {
  border: 2px solid #FF8C00;
  color: #FF8C00;
  background-color: transparent;
  transition: all 0.3s ease;
}

.btn-outline-orange-custom:hover {
  background-color: rgba(255, 140, 0, 0.1);
  color: #FF8C00;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(255, 140, 0, 0.2);
}

.text-fennec-orange {
  color: #FF8C00;
}

.text-light-custom {
  color: #D1D5DB;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.bounce {
  animation: bounce 2s infinite;
}
</style>
