<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, computed } from 'vue'
import useAppLang from '@/composables/settings/useAppLang'
import useApi from '@/composables/utils/useApi'
import useValidations from '@/composables/utils/useValidations'
import { AWS_CONTACT_ENDPOINT } from '@/infrastructure/constants/constants'

const { getAppTexts } = useAppLang()
const appTexts = computed(() => getAppTexts())
const { post } = useApi()
const { validateEmail: validateEmailUtil } = useValidations()

const form = ref({
  name: '',
  email: '',
  company: '',
  message: '',
})

const isSubmitting = ref(false)
const showSuccessAlert = ref(false)
const formElement = ref<HTMLFormElement | null>(null)
const validationErrors = ref({
  name: '',
  email: '',
  message: '',
})

// Validation functions
const validateName = (name: string) => {
  if (!name || name.trim().length < 2) {
    return appTexts.value.contact.form.validation?.nameRequired || 'Name is required (minimum 2 characters)'
  }
  return ''
}

const validateEmail = (email: string) => {
  if (!email || email.trim().length === 0) {
    return appTexts.value.contact.form.validation?.emailRequired || 'Email is required'
  }
  if (!validateEmailUtil(email)) {
    return appTexts.value.contact.form.validation?.emailInvalid || 'Please enter a valid email address'
  }
  return ''
}

const validateMessage = (message: string) => {
  if (!message || message.trim().length < 10) {
    return appTexts.value.contact.form.validation?.messageRequired || 'Message is required (minimum 10 characters)'
  }
  return ''
}

// Validate individual field
const validateField = (fieldName: string) => {
  switch (fieldName) {
  case 'name':
    validationErrors.value.name = validateName(form.value.name)
    break
  case 'email':
    validationErrors.value.email = validateEmail(form.value.email)
    break
  case 'message':
    validationErrors.value.message = validateMessage(form.value.message)
    break
  }
}

// Validate entire form
const validateForm = () => {
  validationErrors.value.name = validateName(form.value.name)
  validationErrors.value.email = validateEmail(form.value.email)
  validationErrors.value.message = validateMessage(form.value.message)

  return !validationErrors.value.name && !validationErrors.value.email && !validationErrors.value.message
}

const resetFormAndShowSuccess = () => {
  showSuccessAlert.value = true

  // Reset form
  form.value = {
    name: '',
    email: '',
    company: '',
    message: '',
  }

  // Reset validation
  validationErrors.value = {
    name: '',
    email: '',
    message: '',
  }

  // Remove Bootstrap validation classes
  if (formElement.value) {
    formElement.value.classList.remove('was-validated')
  }

  // Hide alert after 10 seconds
  setTimeout(() => {
    showSuccessAlert.value = false
  }, 10000)
}

const submitForm = async () => {
  if (isSubmitting.value) return

  // Add Bootstrap validation classes
  if (formElement.value) {
    formElement.value.classList.add('was-validated')
  }

  // Validate form
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  try {
    // Check if running in development mode
    const isDevelopment = import.meta.env.DEV
      || window.location.hostname === 'localhost'
      || window.location.hostname === '127.0.0.1'

    if (isDevelopment) {
      // Simulate email sending with 2-second delay in development
      console.log('Development mode: Simulating email sending...')
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate successful response
      resetFormAndShowSuccess()
    } else {
      // Production mode: actual API call
      const response = await post(
        AWS_CONTACT_ENDPOINT,
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
        resetFormAndShowSuccess()
      } else {
        const errorDetails = response.statusText || 'Unknown error'
        throw new Error(`Failed to send message. Status: ${response.status}, Details: ${errorDetails}`)
      }
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
                <form
                  ref="formElement"
                  class="needs-validation"
                  novalidate
                  @submit.prevent="submitForm"
                >
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
                        :class="{
                          'is-invalid': validationErrors.name,
                          'is-valid': form.name && !validationErrors.name
                        }"
                        id="name"
                        required
                        @blur="validateField('name')"
                        @input="validationErrors.name && validateField('name')"
                      />
                      <div
                        v-if="validationErrors.name"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.name }}
                      </div>
                      <div
                        v-else-if="form.name && !validationErrors.name"
                        class="valid-feedback"
                      >
                        {{ appTexts.contact.form.validation?.looksGood }}
                      </div>
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
                        :class="{
                          'is-invalid': validationErrors.email,
                          'is-valid': form.email && !validationErrors.email
                        }"
                        id="email"
                        required
                        @blur="validateField('email')"
                        @input="validationErrors.email && validateField('email')"
                      />
                      <div
                        v-if="validationErrors.email"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.email }}
                      </div>
                      <div
                        v-else-if="form.email && !validationErrors.email"
                        class="valid-feedback"
                      >
                        {{ appTexts.contact.form.validation?.looksGood }}
                      </div>
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
                        :class="{ 'is-valid': form.company }"
                        id="company"
                      />
                      <div
                        v-if="form.company"
                        class="valid-feedback"
                      >
                        {{ appTexts.contact.form.validation?.looksGood }}
                      </div>
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
                        :class="{
                          'is-invalid': validationErrors.message,
                          'is-valid': form.message && !validationErrors.message
                        }"
                        id="message"
                        rows="5"
                        :placeholder="appTexts.contact.form.messagePlaceholder"
                        required
                        @blur="validateField('message')"
                        @input="validationErrors.message && validateField('message')"
                      ></textarea>
                      <div
                        v-if="validationErrors.message"
                        class="invalid-feedback"
                      >
                        {{ validationErrors.message }}
                      </div>
                      <div
                        v-else-if="form.message && !validationErrors.message"
                        class="valid-feedback"
                      >
                        {{ appTexts.contact.form.validation?.looksGood }}
                      </div>
                    </div>
                    <div class="col-12">
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg"
                        :disabled="isSubmitting"
                      >
                        <font-awesome-icon
                          :icon="isSubmitting ? 'fa-solid fa-spinner' : 'fa-solid fa-paper-plane'"
                          :class="isSubmitting ? 'fa-spin me-2' : 'me-2'"
                        />
                        {{ isSubmitting ? appTexts.contact.form.sendingButton : appTexts.contact.form.sendButton }}
                      </button>
                    </div>
                  </div>
                </form>

                <!-- Success Alert -->
                <div
                  v-if="showSuccessAlert"
                  class="alert alert-success alert-dismissible fade show mt-4"
                  role="alert"
                >
                  <font-awesome-icon icon="fa-solid fa-check-circle" class="me-2" />
                  {{ appTexts.contact.form.successMessage }}
                  <button
                    type="button"
                    class="btn-close"
                    @click="showSuccessAlert = false"
                    aria-label="Close"
                  ></button>
                </div>
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

/* Validation styles enhancement */
.form-control.is-valid,
.form-select.is-valid {
  border-color: var(--bs-success);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1'/&gt;%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.form-control.is-valid:focus,
.form-select.is-valid:focus {
  border-color: var(--bs-success);
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: var(--bs-danger);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.form-control.is-invalid:focus,
.form-select.is-invalid:focus {
  border-color: var(--bs-danger);
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.valid-feedback {
  display: block;
  color: var(--bs-success);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.invalid-feedback {
  display: block;
  color: var(--bs-danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Textarea specific validation styling */
textarea.form-control.is-valid {
  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);
}

textarea.form-control.is-invalid {
  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);
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
