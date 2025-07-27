<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, computed } from 'vue'
import useAppLang from '@/composables/settings/useAppLang'

const { getAppTexts } = useAppLang()
const appTexts = computed(() => getAppTexts())

const form = ref({
  name: '',
  email: '',
  company: '',
  service: '',
  message: '',
  budget: '',
})

const services = computed(() => appTexts.value.contact.form.services)
const budgetRanges = computed(() => appTexts.value.contact.form.budgetRanges)

const submitForm = () => {
  // Handle form submission
  console.log('Form submitted:', form.value)
  alert(appTexts.value.contact.form.successMessage)

  // Reset form
  form.value = {
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
    budget: '',
  }
}
</script>

<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section d-flex align-items-center">
      <div class="container">
        <div class="row align-items-center py-5">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="display-3 fw-bolder text-gradient mb-4">
              {{ appTexts.contact.hero.title }}
            </h1>
            <p class="lead fs-4 text-light-custom">
              {{ appTexts.contact.hero.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="py-5">
      <div class="container">
        <div class="row g-5">
          <!-- Contact Form -->
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-5">
                <h2 class="h3 fw-bold mb-4">
                  {{ appTexts.contact.form.title }}
                </h2>
                <form @submit.prevent="submitForm">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label
                        for="name"
                        class="form-label"
                      >
                        {{ appTexts.contact.form.nameLabel }}
                      </label>
                      <input
                        v-model="form.name"
                        type="text"
                        class="form-control"
                        id="name"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label
                        for="email"
                        class="form-label"
                      >
                        {{ appTexts.contact.form.emailLabel }}
                      </label>
                      <input
                        v-model="form.email"
                        type="email"
                        class="form-control"
                        id="email"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label
                        for="company"
                        class="form-label"
                      >
                        {{ appTexts.contact.form.companyLabel }}
                      </label>
                      <input
                        v-model="form.company"
                        type="text"
                        class="form-control"
                        id="company"
                      />
                    </div>
                    <div class="col-md-6">
                      <label
                        for="service"
                        class="form-label"
                      >
                        {{ appTexts.contact.form.serviceLabel }}
                      </label>
                      <select
                        v-model="form.service"
                        class="form-select"
                        id="service"
                      >
                        <option value="">
                          {{ appTexts.contact.form.servicePlaceholder }}
                        </option>
                        <option
                          v-for="service in services"
                          :key="service"
                          :value="service"
                        >
                          {{ service }}
                        </option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label
                        for="budget"
                        class="form-label"
                      >
                        {{ appTexts.contact.form.budgetLabel }}
                      </label>
                      <select
                        v-model="form.budget"
                        class="form-select"
                        id="budget"
                      >
                        <option value="">
                          {{ appTexts.contact.form.budgetPlaceholder }}
                        </option>
                        <option
                          v-for="budget in budgetRanges"
                          :key="budget"
                          :value="budget"
                        >
                          {{ budget }}
                        </option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label
                        for="message"
                        class="form-label"
                      >
                        {{ appTexts.contact.form.messageLabel }}
                      </label>
                      <textarea
                        v-model="form.message"
                        class="form-control"
                        id="message"
                        rows="5"
                        :placeholder="appTexts.contact.form.messagePlaceholder"
                        required
                      ></textarea>
                    </div>
                    <div class="col-12">
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg"
                      >
                        <i class="fa-solid fa-paper-plane me-2"></i>
                        {{ appTexts.contact.form.sendButton }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="h4 fw-bold mb-4">
                  {{ appTexts.contact.info.title }}
                </h3>

                <div class="contact-item d-flex mb-4">
                  <div
                    class="contact-icon bg-dark bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                    style="width: 50px; height: 50px"
                  >
                    <font-awesome-icon
                      icon="fa-solid fa-map-marker-alt"
                      class="text-primary"
                    ></font-awesome-icon>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">
                      {{ appTexts.contact.info.addressLabel }}
                    </h6>
                    <p class="text-muted mb-0">
                      {{ appTexts.contact.info.address }}
                    </p>
                  </div>
                </div>

                <div class="contact-item d-flex mb-4">
                  <div
                    class="contact-icon bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                    style="width: 50px; height: 50px"
                  >
                    <font-awesome-icon
                      icon="fa-solid fa-phone"
                      class="text-success"
                    ></font-awesome-icon>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">
                      {{ appTexts.contact.info.phoneLabel }}
                    </h6>
                    <p class="text-muted mb-0">
                      <a
                        :href="`tel:${appTexts.contact.info.phone}`"
                        class="text-decoration-none"
                      >
                        {{ appTexts.contact.info.phone }}
                      </a>
                    </p>
                  </div>
                </div>

                <div class="contact-item d-flex mb-4">
                  <div
                    class="contact-icon bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                    style="width: 50px; height: 50px"
                  >
                    <font-awesome-icon
                      icon="fa-solid fa-envelope"
                      class="text-info"
                    ></font-awesome-icon>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">
                      {{ appTexts.contact.info.emailLabel }}
                    </h6>
                    <p class="text-muted mb-0">
                      <a
                        :href="`mailto:${appTexts.contact.info.email}`"
                        class="text-decoration-none"
                      >
                        {{ appTexts.contact.info.email }}
                      </a>
                    </p>
                  </div>
                </div>

                <div class="contact-item d-flex mb-4">
                  <div
                    class="contact-icon bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                    style="width: 50px; height: 50px"
                  >
                    <font-awesome-icon
                      icon="fa-solid fa-clock"
                      class="text-warning"
                    ></font-awesome-icon>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">
                      {{ appTexts.contact.info.hoursLabel }}
                    </h6>
                    <p class="text-muted mb-0">
                      <span
                        v-for="(line, idx) in appTexts.contact.info.hours"
                        :key="idx"
                      >
                        {{ line }}
                        <br
                          v-if="idx < appTexts.contact.info.hours.length - 1"
                        />
                      </span>
                    </p>
                  </div>
                </div>

                <hr />

                <h6 class="fw-bold mb-3">
                  {{ appTexts.contact.info.followUs }}
                </h6>
                <div class="d-flex gap-2">
                  <a
                    href="#"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <font-awesome-icon
                      icon="fa-brands fa-facebook-f"
                    ></font-awesome-icon>
                  </a>
                  <a
                    href="#"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <font-awesome-icon
                      icon="fa-brands fa-twitter"
                    ></font-awesome-icon>
                  </a>
                  <a
                    href="#"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <font-awesome-icon
                      icon="fa-brands fa-linkedin-in"
                    ></font-awesome-icon>
                  </a>
                  <a
                    href="#"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <font-awesome-icon
                      icon="fa-brands fa-instagram"
                    ></font-awesome-icon>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-0">
                <div
                  class="bg-secondary d-flex align-items-center justify-content-center"
                  style="height: 400px"
                >
                  <div class="text-center text-white">
                    <i class="fa-solid fa-map-marker-alt fa-3x mb-3"></i>
                    <h4>{{ appTexts.contact.map.title }}</h4>
                    <p class="mb-0">
                      {{ appTexts.contact.map.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="text-center mb-5">
              <h2 class="display-5 fw-bold mb-3">
                {{ appTexts.contact.faq.title }}
              </h2>
              <p class="lead text-muted">
                {{ appTexts.contact.faq.description }}
              </p>
            </div>

            <div
              class="accordion"
              id="faqAccordion"
            >
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq1"
                  >
                    {{ appTexts.contact.faq.items[0].question }}
                  </button>
                </h2>
                <div
                  id="faq1"
                  class="accordion-collapse collapse show"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body">
                    {{ appTexts.contact.faq.items[0].answer }}
                  </div>
                </div>
              </div>

              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq2"
                  >
                    {{ appTexts.contact.faq.items[1].question }}
                  </button>
                </h2>
                <div
                  id="faq2"
                  class="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body">
                    {{ appTexts.contact.faq.items[1].answer }}
                  </div>
                </div>
              </div>

              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq3"
                  >
                    {{ appTexts.contact.faq.items[2].question }}
                  </button>
                </h2>
                <div
                  id="faq3"
                  class="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body">
                    {{ appTexts.contact.faq.items[2].answer }}
                  </div>
                </div>
              </div>

              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq4"
                  >
                    {{ appTexts.contact.faq.items[3].question }}
                  </button>
                </h2>
                <div
                  id="faq4"
                  class="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body">
                    {{ appTexts.contact.faq.items[3].answer }}
                  </div>
                </div>
              </div>
            </div>
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

.contact-item {
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateX(5px);
}

.form-control,
.form-select {
  border-radius: 8px;
  background-color: #1E1E1E;
  border: 1px solid #3d3d3d33;
  color: #D1D5DB;
  padding: 0.75rem 1rem;
}

.form-control:focus,
.form-select:focus {
  background-color: #2D2D2D;
  border-color: #FF8C00;
  box-shadow: 0 0 0 0.2rem rgba(255, 140, 0, 0.25);
  color: #D1D5DB;
}

.form-control::placeholder {
  color: #6B7280;
}

.btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #FF8C00;
  border-color: #FF8C00;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(255, 140, 0, 0.3);
}

.accordion {
  background-color: #1E1E1E;
  border: 1px solid #3d3d3d33;
  border-radius: 8px;
}

.accordion-button {
  font-weight: 600;
  background-color: #1E1E1E;
  color: #D1D5DB;
}

.accordion-button:not(.collapsed) {
  background-color: #FF8C00;
  color: white;
}

.accordion-item {
  background-color: #1E1E1E;
  border: 1px solid #3d3d3d33;
}

.accordion-body {
  background-color: #2D2D2D;
  color: #D1D5DB;
}

.text-light-custom {
  color: #D1D5DB;
}

section {
  background-color: rgb(17, 24, 39);
}

section.bg-light {
  background-color: rgb(22, 29, 44);
}

.card {
  background-color: #1E1E1E;
  border: 1px solid #3d3d3d33;
}

.text-muted {
  color: #9CA3AF !important;
}

h2, h3, h4, h5, h6 {
  color: #FFFFFF;
}

.contact-icon {
  background-color: #2D2D2D !important;
}

.btn-outline-primary {
  border-color: #FF8C00;
  color: #FF8C00;
}

.btn-outline-primary:hover {
  background-color: #FF8C00;
  border-color: #FF8C00;
  color: white;
}
</style>
