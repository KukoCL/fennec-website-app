<script setup lang="ts">
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import useAppLang from '../composables/settings/useAppLang'

const { getAppTexts } = useAppLang()
const appTexts = computed(() => getAppTexts().home.testimonialsSection)

interface Testimonial {
  name: string
  position: string
  company: string
  messageKey: keyof typeof appTexts.value.testimonials
  avatar: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    position: 'CEO',
    company: 'TechStart Inc.',
    messageKey: 'sarahJohnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    position: 'CTO',
    company: 'Global Solutions',
    messageKey: 'michaelChen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    position: 'Marketing Director',
    company: 'Creative Agency',
    messageKey: 'emilyRodriguez',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
  },
]
</script>

<template>
  <section class="testimonials-section py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 class="display-5 fw-bold mb-3">{{ appTexts.title }}</h2>
          <p class="lead text-muted">
            {{ appTexts.description }}
          </p>
        </div>
      </div>

      <div class="row g-4">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="col-lg-4 col-md-6"
        >
          <div class="card h-100 border-0 shadow-sm testimonial-card">
            <div class="card-body p-4">
              <!-- Stars Rating -->
              <div class="mb-3">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-warning"
                >
                  <FontAwesomeIcon :icon="star <= testimonial.rating ? 'star' : ['far', 'star']" />
                </span>
              </div>

              <!-- Testimonial Text -->
              <p class="card-text text-muted mb-4">"{{ appTexts.testimonials[testimonial.messageKey] }}"</p>

              <!-- Client Info -->
              <div class="d-flex align-items-center">
                <img
                  :src="testimonial.avatar"
                  :alt="testimonial.name"
                  class="rounded-circle me-3"
                  width="50"
                  height="50"
                  style="object-fit: cover"
                />
                <div>
                  <h6 class="mb-0 fw-bold">{{ testimonial.name }}</h6>
                  <small class="text-muted">{{ testimonial.position }}, {{ testimonial.company }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="row mt-5 pt-5 border-top">
        <div class="col-lg-3 col-md-6 text-center mb-4">
          <div class="stat-item">
            <h3 class="display-4 fw-bold text-primary mb-0">250+</h3>
            <p class="text-muted">{{ appTexts.stats.projectsCompleted }}</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 text-center mb-4">
          <div class="stat-item">
            <h3 class="display-4 fw-bold text-primary mb-0">98%</h3>
            <p class="text-muted">{{ appTexts.stats.clientSatisfaction }}</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 text-center mb-4">
          <div class="stat-item">
            <h3 class="display-4 fw-bold text-primary mb-0">50+</h3>
            <p class="text-muted">{{ appTexts.stats.teamMembers }}</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 text-center mb-4">
          <div class="stat-item">
            <h3 class="display-4 fw-bold text-primary mb-0">5+</h3>
            <p class="text-muted">{{ appTexts.stats.yearsExperience }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonial-card {
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
}

.stat-item {
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: scale(1.05);
}

.fa-star {
  font-size: 0.9rem;
}
</style>
