<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import useAppLang from '@/composables/settings/useAppLang';
import { useCounterStore } from '@/stores/exampleStore';
// import useApi from '@/composables/utils/useApi';
import { storeToRefs } from 'pinia';
// import type { ExampleInterface } from '@/infrastructure/interfaces';

// const { get } = useApi();

// const obtenerCosas = async () => {
//   const resultado = await get<ExampleInterface>('unaUrl.com');
//   console.log(resultado);
//   // guardar en la store
//   count.value = resultado.data.exampleInt;
// };

const counterStore = useCounterStore();
const { count } = storeToRefs(counterStore);
const { increment } = counterStore;
const { getAppTexts } = useAppLang();
const appTexts = computed(() => getAppTexts().home.heroSection);
</script>

<template>
  <section class="hero-section bg-primary text-white">
    <div class="container">
      Cuenta: {{ count }}
      <button @click="increment" >Incrementar</button>
      <div class="row align-items-center p-lg-5">
        <div class="col-lg-6">
          <h1 class="display-4 fw-bold mb-4 mt-3">{{ appTexts.headerTitle }}</h1>
          <p class="lead mb-4">
            {{ appTexts.description }}
          </p>
          <div class="d-flex flex-column flex-sm-row gap-3">
            <RouterLink to="/contact" class="btn btn-light btn-lg px-4">{{ appTexts.buttons.getStarted }}</RouterLink>
            <RouterLink to="/services" class="btn btn-outline-light btn-lg px-4">
              {{ appTexts.buttons.ourServices }}
            </RouterLink>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="position-relative">
            <div class="bg-light rounded-3 p-4 shadow-lg mt-3">
              <div class="row g-3">
                <div class="col-6">
                  <div class="bg-dark bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="rocket" class="text-primary fs-2 mb-2" />
                    <h6 class="text-dark mb-0">{{ appTexts.features.fastDelivery }}</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="bg-success bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="shield-halved" class="text-success fs-2 mb-2" />
                    <h6 class="text-dark mb-0">{{ appTexts.features.secure }}</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="bg-warning bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="users" class="text-warning fs-2 mb-2" />
                    <h6 class="text-dark mb-0">{{ appTexts.features.support }}</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="bg-info bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="chart-line" class="text-info fs-2 mb-2" />
                    <h6 class="text-dark mb-0">{{ appTexts.features.analytics }}</h6>
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
  background: linear-gradient(135deg, var(--primary-color) 0%, #004085 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

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
