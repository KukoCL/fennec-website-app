<script setup lang="ts">
import { ref, computed } from 'vue'

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
    title: 'E-commerce Platform',
    description: 'Modern e-commerce solution with advanced analytics and inventory management.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=300&fit=crop',
    category: 'Web Development',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    link: '#',
    featured: true,
  },
  {
    id: 'mobile-banking-app',
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop',
    category: 'Mobile Development',
    technologies: ['React Native', 'Express.js', 'PostgreSQL', 'JWT'],
    link: '#',
    featured: true,
  },
  {
    id: 'cloud-migration',
    title: 'Enterprise Cloud Migration',
    description: 'Complete cloud infrastructure migration for a Fortune 500 company.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
    category: 'Cloud Solutions',
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    link: '#',
    featured: true,
  },
  {
    id: 'analytics-dashboard',
    title: 'Business Analytics Dashboard',
    description: 'Real-time analytics dashboard for monitoring business KPIs.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    category: 'Data Analytics',
    technologies: ['Vue.js', 'Python', 'D3.js', 'Flask'],
    link: '#',
    featured: false,
  },
  {
    id: 'iot-platform',
    title: 'IoT Management Platform',
    description: 'Comprehensive IoT device management and monitoring system.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop',
    category: 'IoT Solutions',
    technologies: ['Angular', 'MQTT', 'InfluxDB', 'Grafana'],
    link: '#',
    featured: false,
  },
  {
    id: 'healthcare-system',
    title: 'Healthcare Management System',
    description: 'Digital healthcare platform for patient and appointment management.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop',
    category: 'Web Development',
    technologies: ['React', 'Django', 'PostgreSQL', 'Redis'],
    link: '#',
    featured: false,
  },
]

const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]
const selectedCategory = ref('All')

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'All') {
    return projects
  }
  return projects.filter((project) => project.category === selectedCategory.value)
})

const featuredProjects = computed(() => projects.filter((p) => p.featured))
</script>

<template>
  <div class="portfolio-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center py-5">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="display-4 fw-bold mb-4">Our Portfolio</h1>
            <p class="lead">
              Explore our successful projects and see how we've helped businesses achieve their
              goals through innovative technology solutions.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3">Featured Projects</h2>
            <p class="lead text-muted">
              Here are some of our most successful and impactful projects.
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
                  <a :href="project.link" class="btn btn-light btn-sm">
                    <i class="fa-solid fa-external-link-alt me-1"></i>
                    View Project
                  </a>
                </div>
              </div>
              <div class="card-body p-4">
                <span class="badge bg-primary mb-2">{{ project.category }}</span>
                <h5 class="card-title fw-bold mb-2">{{ project.title }}</h5>
                <p class="card-text text-muted mb-3">{{ project.description }}</p>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="badge bg-light text-dark small"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Projects -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3">All Projects</h2>
            <p class="lead text-muted">
              Browse through our complete portfolio of successful projects.
            </p>
          </div>
        </div>

        <!-- Filter Buttons -->
        <div class="row mb-4">
          <div class="col-12 text-center">
            <div class="btn-group" role="group">
              <button
                v-for="category in categories"
                :key="category"
                type="button"
                class="btn"
                :class="selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'"
                @click="selectedCategory = category"
              >
                {{ category }}
              </button>
            </div>
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="row g-4">
          <div v-for="project in filteredProjects" :key="project.id" class="col-lg-4 col-md-6">
            <div class="card border-0 shadow-sm project-card h-100">
              <div class="position-relative overflow-hidden">
                <img
                  :src="project.image"
                  :alt="project.title"
                  class="card-img-top project-image"
                  style="height: 200px; object-fit: cover"
                />
                <div class="project-overlay d-flex align-items-center justify-content-center">
                  <a :href="project.link" class="btn btn-light btn-sm">
                    <i class="fa-solid fa-external-link-alt me-1"></i>
                    View Project
                  </a>
                </div>
              </div>
              <div class="card-body p-4">
                <span class="badge bg-primary mb-2">{{ project.category }}</span>
                <h5 class="card-title fw-bold mb-2">{{ project.title }}</h5>
                <p class="card-text text-muted mb-3">{{ project.description }}</p>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="badge bg-light text-dark small"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-5">
      <div class="container">
        <div class="row g-4 text-center">
          <div class="col-lg-3 col-md-6">
            <div class="stat-item">
              <h3 class="display-4 fw-bold text-primary mb-0">250+</h3>
              <p class="text-muted">Projects Completed</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="stat-item">
              <h3 class="display-4 fw-bold text-primary mb-0">150+</h3>
              <p class="text-muted">Happy Clients</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="stat-item">
              <h3 class="display-4 fw-bold text-primary mb-0">98%</h3>
              <p class="text-muted">Success Rate</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="stat-item">
              <h3 class="display-4 fw-bold text-primary mb-0">24/7</h3>
              <p class="text-muted">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5 bg-primary text-white">
      <div class="container px-lg-5">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h2 class="display-6 fw-bold mb-3">Ready to Start Your Project?</h2>
            <p class="lead mb-0">
              Let's bring your vision to life with our expertise and innovative solutions.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <router-link to="/contact" class="btn btn-light btn-lg">
              <i class="fa-solid fa-rocket me-2"></i>
              Start Your Project
            </router-link>
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: all 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
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
