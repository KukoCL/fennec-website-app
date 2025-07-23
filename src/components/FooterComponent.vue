<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import useAppLang from '@/composables/settings/useAppLang';

const { getAppTexts } = useAppLang();
const appTexts = computed(() => getAppTexts().footer);
</script>

<template>
  <footer class="bg-dark text-light mt-5">
    <div class="container py-5 px-lg-5">
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4">
          <h5 class="company-name">{{ appTexts.companyInfo.title }}</h5>
          <p class="mb-3">
            {{ appTexts.companyInfo.description }}
          </p>
          <div class="d-flex">
            <a href="#" class="text-light me-3" aria-label="Facebook">
              <FontAwesomeIcon :icon="['fab', 'facebook-f']" />
            </a>
            <a href="#" class="text-light me-3" aria-label="Twitter">
              <FontAwesomeIcon :icon="['fab', 'twitter']" />
            </a>
            <a href="#" class="text-light me-3" aria-label="LinkedIn">
              <FontAwesomeIcon :icon="['fab', 'linkedin-in']" />
            </a>
            <a href="#" class="text-light" aria-label="Instagram">
              <FontAwesomeIcon :icon="['fab', 'instagram']" />
            </a>
          </div>
        </div>

        <div class="col-lg-2 col-md-6 mb-4">
          <h6 class="text-uppercase fw-bold mb-3">{{ appTexts.navigation.title }}</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <RouterLink to="/" class="text-light text-decoration-none">{{
                appTexts.navigation.links.home
              }}</RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/about" class="text-light text-decoration-none">{{
                appTexts.navigation.links.about
              }}</RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/services" class="text-light text-decoration-none">{{
                appTexts.navigation.links.services
              }}</RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/portfolio" class="text-light text-decoration-none">{{
                appTexts.navigation.links.portfolio
              }}</RouterLink>
            </li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
          <h6 class="text-uppercase fw-bold mb-3">{{ appTexts.services.title }}</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <a href="#" class="text-light text-decoration-none">{{ appTexts.services.links.webDevelopment }}</a>
            </li>
            <li class="mb-2">
              <a href="#" class="text-light text-decoration-none">{{ appTexts.services.links.mobileApps }}</a>
            </li>
            <li class="mb-2">
              <a href="#" class="text-light text-decoration-none">{{ appTexts.services.links.cloudSolutions }}</a>
            </li>
            <li class="mb-2">
              <a href="#" class="text-light text-decoration-none">{{ appTexts.services.links.consulting }}</a>
            </li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
          <h6 class="text-uppercase fw-bold mb-3">{{ appTexts.contact.title }}</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <FontAwesomeIcon icon="envelope" class="me-2" />
              {{ appTexts.contact.email }}
            </li>
            <li class="mb-2">
              <FontAwesomeIcon icon="phone" class="me-2" />
              {{ appTexts.contact.phone }}
            </li>
            <li class="mb-2">
              <FontAwesomeIcon icon="map-marker-alt" class="me-2" />
              {{ appTexts.contact.address }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-top border-secondary">
      <div class="container py-3 px-lg-5">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0">
              &copy; {{ new Date().getFullYear() }} {{ appTexts.companyInfo.title }}.
              {{ appTexts.copyright }}
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <a href="#" class="text-light text-decoration-none me-3">{{ appTexts.legalLinks.privacyPolicy }}</a>
            <a href="#" class="text-light text-decoration-none">{{ appTexts.legalLinks.termsOfService }}</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer a:hover {
  color: #ffffff !important;
}

.fas,
.fab {
  width: 20px;
  text-align: center;
}
.company-name {
  color: #ffd894;
}
</style>
