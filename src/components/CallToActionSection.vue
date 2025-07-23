<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import useAppLang from '../composables/settings/useAppLang'

const { getAppTexts } = useAppLang()
const appTexts = computed(() => getAppTexts().home.callToActionSection)

const subscribeNewsletter = () => {
  // Handle newsletter subscription
  alert(appTexts.value.newsletter.successMessage)
}
</script>

<template>
  <section class="cta-section bg-primary text-white py-5">
    <div class="container px-lg-5">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <h2 class="display-5 fw-bold mb-3">{{ appTexts.title }}</h2>
          <p class="lead mb-0">
            {{ appTexts.description }}
          </p>
        </div>
        <div class="col-lg-4 text-lg-end">
          <div class="d-flex flex-column flex-sm-row flex-lg-column gap-3">
            <RouterLink to="/contact" class="btn btn-light btn-lg">
              <FontAwesomeIcon icon="rocket" class="me-2" />
              {{ appTexts.buttons.getStarted }}
            </RouterLink>
            <a href="tel:+1-555-123-4567" class="btn btn-outline-light btn-lg">
              <FontAwesomeIcon icon="phone" class="me-2" />
              {{ appTexts.buttons.callUs }}
            </a>
          </div>
        </div>
      </div>

      <!-- Newsletter Signup -->
      <div class="row mt-5 pt-5 border-top border-light border-opacity-25">
        <div class="col-lg-8 mx-auto text-center">
          <h3 class="h4 mb-3">{{ appTexts.newsletter.title }}</h3>
          <p class="mb-4">
            {{ appTexts.newsletter.description }}
          </p>

          <form class="row g-3 justify-content-center" @submit.prevent="subscribeNewsletter">
            <div class="col-md-6">
              <input
                type="email"
                class="form-control form-control-lg"
                :placeholder="appTexts.newsletter.placeholder"
                required
              />
            </div>
            <div class="col-md-3">
              <button type="submit" class="btn btn-light btn-lg w-100">
                {{ appTexts.newsletter.button }}
              </button>
            </div>
          </form>

          <small class="d-block mt-3 opacity-75">
            {{ appTexts.newsletter.privacyNote }}
          </small>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, #004085 100%);
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  pointer-events: none;
}

.btn {
  transition: all 0.3s ease;
  border-radius: 50px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.form-control {
  border-radius: 50px;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-control:focus {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-color: transparent;
}
</style>
