<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="bg-dark text-light mt-5">
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4">
          <h5 class="text-primary">Fennec Company</h5>
          <p class="mb-3">
            We provide modern business solutions to help your company grow and succeed in the
            digital age.
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
          <h6 class="text-uppercase fw-bold mb-3">Quick Links</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <RouterLink to="/" class="text-light text-decoration-none">Home</RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/about" class="text-light text-decoration-none">About</RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/services" class="text-light text-decoration-none"
                >Services</RouterLink
              >
            </li>
            <li class="mb-2">
              <RouterLink to="/portfolio" class="text-light text-decoration-none"
                >Portfolio</RouterLink
              >
            </li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
          <h6 class="text-uppercase fw-bold mb-3">Services</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <a href="#" class="text-light text-decoration-none">Web Development</a>
            </li>
            <li class="mb-2">
              <a href="#" class="text-light text-decoration-none">Mobile Apps</a>
            </li>
            <li class="mb-2">
              <a href="#" class="text-light text-decoration-none">Cloud Solutions</a>
            </li>
            <li class="mb-2">
              <a href="#" class="text-light text-decoration-none">Consulting</a>
            </li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
          <h6 class="text-uppercase fw-bold mb-3">Contact Info</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <FontAwesomeIcon icon="envelope" class="me-2" />
              info@fenneccompany.com
            </li>
            <li class="mb-2">
              <FontAwesomeIcon icon="phone" class="me-2" />
              +1 (555) 123-4567
            </li>
            <li class="mb-2">
              <FontAwesomeIcon icon="map-marker-alt" class="me-2" />
              123 Business St, City, State 12345
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-top border-secondary">
      <div class="container py-3">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0">
              &copy; {{ new Date().getFullYear() }} Fennec Company. All rights reserved.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <a href="#" class="text-light text-decoration-none me-3">Privacy Policy</a>
            <a href="#" class="text-light text-decoration-none">Terms of Service</a>
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
</style>
