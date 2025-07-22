<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  company: '',
  service: '',
  message: '',
  budget: '',
})

const services = [
  'Web Development',
  'Mobile App Development',
  'Cloud Solutions',
  'Data Analytics',
  'Cybersecurity',
  'IT Consulting',
  'Other',
]

const budgetRanges = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000+',
  "Let's discuss",
]

const submitForm = () => {
  // Handle form submission
  console.log('Form submitted:', form.value)
  alert("Thank you for your message! We'll get back to you within 24 hours.")

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
    <section class="hero-section bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center py-5">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="display-4 fw-bold mb-4">Get In Touch</h1>
            <p class="lead">
              Ready to transform your business? Let's discuss your project and find the perfect
              solution for your needs.
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
                <h2 class="h3 fw-bold mb-4">Send us a Message</h2>
                <form @submit.prevent="submitForm">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label for="name" class="form-label">Full Name *</label>
                      <input
                        v-model="form.name"
                        type="text"
                        class="form-control"
                        id="name"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label for="email" class="form-label">Email Address *</label>
                      <input
                        v-model="form.email"
                        type="email"
                        class="form-control"
                        id="email"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label for="company" class="form-label">Company</label>
                      <input v-model="form.company" type="text" class="form-control" id="company" />
                    </div>
                    <div class="col-md-6">
                      <label for="service" class="form-label">Service Interested In</label>
                      <select v-model="form.service" class="form-select" id="service">
                        <option value="">Select a service</option>
                        <option v-for="service in services" :key="service" :value="service">
                          {{ service }}
                        </option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label for="budget" class="form-label">Project Budget</label>
                      <select v-model="form.budget" class="form-select" id="budget">
                        <option value="">Select budget range</option>
                        <option v-for="budget in budgetRanges" :key="budget" :value="budget">
                          {{ budget }}
                        </option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label for="message" class="form-label">Project Details *</label>
                      <textarea
                        v-model="form.message"
                        class="form-control"
                        id="message"
                        rows="5"
                        placeholder="Tell us about your project, goals, and any specific requirements..."
                        required
                      ></textarea>
                    </div>
                    <div class="col-12">
                      <button type="submit" class="btn btn-primary btn-lg">
                        <i class="fa-solid fa-paper-plane me-2"></i>
                        Send Message
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
                <h3 class="h4 fw-bold mb-4">Contact Information</h3>

                <div class="contact-item d-flex mb-4">
                  <div
                    class="contact-icon bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                    style="width: 50px; height: 50px"
                  >
                    <i class="fa-solid fa-map-marker-alt text-primary"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">Address</h6>
                    <p class="text-muted mb-0">
                      123 Business Street<br />Suite 100<br />City, State 12345
                    </p>
                  </div>
                </div>

                <div class="contact-item d-flex mb-4">
                  <div
                    class="contact-icon bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                    style="width: 50px; height: 50px"
                  >
                    <i class="fa-solid fa-phone text-success"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">Phone</h6>
                    <p class="text-muted mb-0">
                      <a href="tel:+1-555-123-4567" class="text-decoration-none"
                        >+1 (555) 123-4567</a
                      >
                    </p>
                  </div>
                </div>

                <div class="contact-item d-flex mb-4">
                  <div
                    class="contact-icon bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                    style="width: 50px; height: 50px"
                  >
                    <i class="fa-solid fa-envelope text-info"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">Email</h6>
                    <p class="text-muted mb-0">
                      <a href="mailto:info@fenneccompany.com" class="text-decoration-none"
                        >info@fenneccompany.com</a
                      >
                    </p>
                  </div>
                </div>

                <div class="contact-item d-flex mb-4">
                  <div
                    class="contact-icon bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                    style="width: 50px; height: 50px"
                  >
                    <i class="fa-solid fa-clock text-warning"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">Business Hours</h6>
                    <p class="text-muted mb-0">
                      Mon - Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 10:00 AM - 4:00 PM<br />
                      Sun: Closed
                    </p>
                  </div>
                </div>

                <hr />

                <h6 class="fw-bold mb-3">Follow Us</h6>
                <div class="d-flex gap-2">
                  <a href="#" class="btn btn-outline-primary btn-sm">
                    <i class="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="#" class="btn btn-outline-primary btn-sm">
                    <i class="fa-brands fa-twitter"></i>
                  </a>
                  <a href="#" class="btn btn-outline-primary btn-sm">
                    <i class="fa-brands fa-linkedin-in"></i>
                  </a>
                  <a href="#" class="btn btn-outline-primary btn-sm">
                    <i class="fa-brands fa-instagram"></i>
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
                    <h4>Interactive Map</h4>
                    <p class="mb-0">
                      Map integration would go here<br />(Google Maps, Mapbox, etc.)
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
              <h2 class="display-5 fw-bold mb-3">Frequently Asked Questions</h2>
              <p class="lead text-muted">
                Quick answers to common questions about our services and process.
              </p>
            </div>

            <div class="accordion" id="faqAccordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq1"
                  >
                    How long does a typical project take?
                  </button>
                </h2>
                <div
                  id="faq1"
                  class="accordion-collapse collapse show"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body">
                    Project timelines vary depending on complexity and scope. Simple websites
                    typically take 2-4 weeks, while complex applications can take 3-6 months. We'll
                    provide a detailed timeline during our initial consultation.
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
                    What is your development process?
                  </button>
                </h2>
                <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    We follow a structured 4-phase process: Discovery (understanding your needs),
                    Design (creating prototypes), Development (building your solution), and Launch
                    (deployment and support). We maintain constant communication throughout.
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
                    Do you provide ongoing support?
                  </button>
                </h2>
                <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    Yes, we offer comprehensive support packages including maintenance, updates,
                    monitoring, and technical support. We believe in long-term partnerships with our
                    clients.
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
                    What technologies do you specialize in?
                  </button>
                </h2>
                <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    We specialize in modern web technologies including React, Vue.js, Node.js,
                    Python, cloud platforms like AWS, mobile development with React Native, and
                    various databases and DevOps tools.
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
