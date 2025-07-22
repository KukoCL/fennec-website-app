<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="hero-section bg-primary text-white">
    <div class="container">
      <div class="row align-items-center min-vh-100 py-5">
        <div class="col-lg-6">
          <h1 class="display-4 fw-bold mb-4">Modern Business Solutions for the Digital Age</h1>
          <p class="lead mb-4">
            We help companies transform their business with cutting-edge technology, innovative
            strategies, and expert consultation to drive growth and success.
          </p>
          <div class="d-flex flex-column flex-sm-row gap-3">
            <RouterLink to="/contact" class="btn btn-light btn-lg px-4"> Get Started </RouterLink>
            <RouterLink to="/services" class="btn btn-outline-light btn-lg px-4">
              Our Services
            </RouterLink>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="position-relative">
            <div class="bg-light rounded-3 p-4 shadow-lg">
              <div class="row g-3">
                <div class="col-6">
                  <div class="bg-dark bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="rocket" class="text-primary fs-2 mb-2" />
                    <h6 class="text-dark mb-0">Fast Delivery</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="bg-success bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="shield-halved" class="text-success fs-2 mb-2" />
                    <h6 class="text-dark mb-0">Secure</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="bg-warning bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="users" class="text-warning fs-2 mb-2" />
                    <h6 class="text-dark mb-0">24/7 Support</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="bg-info bg-opacity-10 rounded p-3 text-center">
                    <FontAwesomeIcon icon="chart-line" class="text-info fs-2 mb-2" />
                    <h6 class="text-dark mb-0">Analytics</h6>
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
