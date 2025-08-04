<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import useAppLang from '@/composables/settings/useAppLang';

const { getAppTexts } = useAppLang();
const appTexts = computed(() => getAppTexts().home.heroSection);
</script>

<template>
  <section class="hero-section text-white position-relative overflow-hidden">
    <div class="container position-relative">
      <div class="row align-items-center p-lg-5">
        <div class="col-lg-6">
          <h1 class="display-4 fw-bold mb-4 mt-3 hero-title">{{ appTexts.headerTitle }}</h1>
          <p class="lead mb-4 hero-description">
            {{ appTexts.description }}
          </p>
          <div class="d-flex flex-column flex-sm-row gap-3">
            <RouterLink to="/contact" class="btn hero-btn overflow-hidden">{{ appTexts.buttons.getStarted }}</RouterLink>
            <RouterLink to="/services" class="btn hero-btn overflow-hidden">
              {{ appTexts.buttons.ourServices }}
            </RouterLink>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="position-relative">
            <div class="bg-black rounded-3 p-4 shadow-lg mt-3">
              <div class="row g-3">
                <div class="col-6">
                  <div class="bg-dark bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="rocket" class="text-primary fs-2 mb-2" />
                    <h6 class="text-white mb-0">{{ appTexts.features.fastDelivery }}</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="bg-success bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="shield-halved" class="text-success fs-2 mb-2" />
                    <h6 class="text-white mb-0">{{ appTexts.features.secure }}</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="bg-warning bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="users" class="text-warning fs-2 mb-2" />
                    <h6 class="text-white mb-0">{{ appTexts.features.support }}</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="bg-info bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="chart-line" class="text-info fs-2 mb-2" />
                    <h6 class="text-white mb-0">{{ appTexts.features.analytics }}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="hero-decoration-1 position-absolute"></div>
    <div class="hero-decoration-2 position-absolute"></div>
    <div class="hero-decoration-3 position-absolute"></div>

    <!-- Scroll indicator -->
    <div class="text-center pb-4">
      <FontAwesomeIcon icon="chevron-down" class="fa-2x opacity-50 bounce" />
    </div>
  </section>
</template>

<style scoped>
.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
