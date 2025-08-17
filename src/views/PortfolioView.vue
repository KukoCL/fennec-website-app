<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed } from 'vue'
import useAppLang from '@/composables/settings/useAppLang'

const { getAppTexts } = useAppLang()
const appTexts = computed(() => getAppTexts().portfolio)

interface Project {
  id: string
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  link: string
  featured: boolean
}

const projects: Project[] = [
  {
    id: 'ecommerce-platform',
    title: appTexts.value.projects.ecommercePlatform.title,
    description: appTexts.value.projects.ecommercePlatform.description,
    image: 'https://www.revistaei.cl/wp-content/uploads/2024/01/red-movilidad-nuevos-buses.jpg',
    category: appTexts.value.projects.ecommercePlatform.category,
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    link: '#',
    featured: true,
  },
  {
    id: 'mobile-banking-app',
    title: appTexts.value.projects.mobileBankingApp.title,
    description: appTexts.value.projects.mobileBankingApp.description,
    image: 'https://derechoequidad.com/wp-content/uploads/2022/10/img-la-propiedad-industrial-en-colombia-leyes-y-regulacion-1.jpg',
    category: appTexts.value.projects.mobileBankingApp.category,
    technologies: ['React Native', 'Express.js', 'PostgreSQL', 'JWT'],
    link: '#',
    featured: true,
  },
  {
    id: 'cloud-migration',
    title: appTexts.value.projects.cloudMigration.title,
    description: appTexts.value.projects.cloudMigration.description,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
    category: appTexts.value.projects.cloudMigration.category,
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    link: '#',
    featured: true,
  },
  {
    id: 'analytics-dashboard',
    title: appTexts.value.projects.analyticsDashboard.title,
    description: appTexts.value.projects.analyticsDashboard.description,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    category: appTexts.value.projects.analyticsDashboard.category,
    technologies: ['Vue.js', 'Python', 'D3.js', 'Flask'],
    link: '#',
    featured: false,
  },
  {
    id: 'iot-platform',
    title: appTexts.value.projects.iotPlatform.title,
    description: appTexts.value.projects.iotPlatform.description,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop',
    category: appTexts.value.projects.iotPlatform.category,
    technologies: ['Angular', 'MQTT', 'InfluxDB', 'Grafana'],
    link: '#',
    featured: false,
  },
  {
    id: 'healthcare-system',
    title: appTexts.value.projects.healthcareSystem.title,
    description: appTexts.value.projects.healthcareSystem.description,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop',
    category: appTexts.value.projects.healthcareSystem.category,
    technologies: ['React', 'Django', 'PostgreSQL', 'Redis'],
    link: '#',
    featured: false,
  },
]

const featuredProjects = computed(() => projects.filter((p) => p.featured))
</script>

<template>
  <div class="portfolio-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5 position-relative overflow-hidden">
      <div class="container position-relative">
        <div class="row align-items-center py-5">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="display-4 fw-bold mb-4 hero-title">{{ appTexts.hero.title }}</h1>
            <p class="lead hero-description">
              {{ appTexts.hero.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Decorative elements -->
      <div class="hero-decoration-1 position-absolute"></div>
      <div class="hero-decoration-2 position-absolute"></div>
      <div class="hero-decoration-3 position-absolute"></div>
    </section>

    <!-- Featured Projects -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3 text-white">{{ appTexts.featured.title }}</h2>
            <p class="lead text-white">
              {{ appTexts.featured.description }}
            </p>
          </div>
        </div>

        <div class="row g-4">
          <div v-for="project in featuredProjects" :key="project.id" class="col-lg-4 col-md-6">
            <div class="card border-0 shadow-sm project-card h-100">
              <div class="position-relative overflow-hidden">
                <img
                  :src="project.image"
                  :alt="project.title"
                  class="card-img-top project-image"
                  style="height: 200px; object-fit: cover"
                />
                <div class="project-overlay d-flex align-items-center justify-content-center">
                </div>
              </div>
              <div class="card-body p-4">
                <span class="badge bg-primary mb-2">{{ project.category }}</span>
                <h5 class="card-title fw-bold mb-2">{{ project.title }}</h5>
                <p class="card-text text-muted mb-3">{{ project.description }}</p>
                <div class="d-flex flex-wrap gap-1">
                  <span v-for="tech in project.technologies" :key="tech" class="badge bg-light text-dark small">
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5 cta-section text-white">
      <div class="container px-lg-5">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h2 class="display-6 fw-bold mb-3">{{ appTexts.cta.title }}</h2>
            <p class="lead mb-0">
              {{ appTexts.cta.description }}
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <router-link to="/contact" class="btn hero-btn btn-light btn-lg overflow-hidden">
              <font-awesome-icon icon="fa-solid fa-rocket" class="me-2" />
              {{ appTexts.cta.button }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cta-section {
  background: linear-gradient(135deg, #000000 0%, var(--orange) 100%);
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
  background: linear-gradient(135deg, #1a1a1a 0%, var(--orange-dark) 100%);
  opacity: 0.9;
  z-index: -1;
}

.project-card {
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.project-image {
  transition: all 0.3s ease;
}

.project-overlay {
  display: none !important;
}

.project-card:hover .project-image {
  transform: scale(1.1);
}

.stat-item {
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: scale(1.05);
}

.btn-group .btn {
  margin: 0 2px;
  border-radius: 25px !important;
}
</style>
