<script setup lang="ts">
import { RouterLink } from 'vue-router'

const subscribeNewsletter = () => {
  // Handle newsletter subscription
  alert("Thank you for subscribing! We'll be in touch soon.")
}
</script>

<template>
  <section class="cta-section bg-primary text-white py-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <h2 class="display-5 fw-bold mb-3">Ready to Transform Your Business?</h2>
          <p class="lead mb-0">
            Join hundreds of satisfied clients who have accelerated their growth with our innovative
            solutions. Let's discuss how we can help you achieve your business goals.
          </p>
        </div>
        <div class="col-lg-4 text-lg-end">
          <div class="d-flex flex-column flex-sm-row flex-lg-column gap-3">
            <RouterLink to="/contact" class="btn btn-light btn-lg">
              <FontAwesomeIcon icon="rocket" class="me-2" />
              Get Started Today
            </RouterLink>
            <a href="tel:+1-555-123-4567" class="btn btn-outline-light btn-lg">
              <FontAwesomeIcon icon="phone" class="me-2" />
              Call Us Now
            </a>
          </div>
        </div>
      </div>

      <!-- Newsletter Signup -->
      <div class="row mt-5 pt-5 border-top border-light border-opacity-25">
        <div class="col-lg-8 mx-auto text-center">
          <h3 class="h4 mb-3">Stay Updated with Our Latest News</h3>
          <p class="mb-4">
            Subscribe to our newsletter and get the latest updates on technology trends and business
            insights.
          </p>

          <form class="row g-3 justify-content-center" @submit.prevent="subscribeNewsletter">
            <div class="col-md-6">
              <input
                type="email"
                class="form-control form-control-lg"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div class="col-md-3">
              <button type="submit" class="btn btn-light btn-lg w-100">Subscribe</button>
            </div>
          </form>

          <small class="d-block mt-3 opacity-75">
            We respect your privacy. Unsubscribe at any time.
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
