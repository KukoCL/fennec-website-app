<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, computed } from 'vue'
import useAppLang from '@/composables/settings/useAppLang'
import useApi from '@/composables/utils/useApi'

const { getAppTexts } = useAppLang()
const appTexts = computed(() => getAppTexts())
const { post } = useApi()

const form = ref({
  name: '',
  email: '',
  company: '',
  message: '',
})

const isSubmitting = ref(false)

const submitForm = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  try {
    const response = await post(
      'https://vwa336a3txkiyqqf2wvo453mva0zhpbl.lambda-url.us-east-1.on.aws/',
      {
        name: form.value.name,
        email: form.value.email,
        company: form.value.company,
        message: form.value.message,
      },
      {
        'Content-Type': 'text/plain',
      },
    )

    if (response.isOk) {
      alert(appTexts.value.contact.form.successMessage)

      // Reset form
      form.value = {
        name: '',
        email: '',
        company: '',
        message: '',
      }
    } else {
      throw new Error('Failed to send message')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error sending your message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center py-5">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="display-4 fw-bold mb-4">
              {{ appTexts.contact.hero.title }}
            </h1>
            <p class="lead">
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
                    <div class="col-12">
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
                        :disabled="isSubmitting"
                      >
                        <i
                          :class="isSubmitting ? 'fa-solid fa-spinner fa-spin me-2' : 'fa-solid fa-paper-plane me-2'"
                        ></i>
                        {{ isSubmitting ? 'Sending...' : appTexts.contact.form.sendButton }}
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
  background: linear-gradient(135deg, var(--primary-color) 0%, #004085 100%);
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
  border: 1px solid #e9ecef;
  padding: 0.75rem 1rem;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(0, 102, 204, 0.25);
}

.btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.accordion-button {
  font-weight: 600;
}

.accordion-button:not(.collapsed) {
  background-color: var(--primary-color);
  color: white;
}
</style>
