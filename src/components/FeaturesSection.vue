<script setup lang="ts">
interface Feature {
  icon: string
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: 'code',
    title: 'Web Development',
    description:
      'Custom web applications built with modern technologies and best practices for optimal performance.',
    color: 'dark',
  },
  {
    icon: 'mobile',
    title: 'Mobile Apps',
    description:
      'Native and cross-platform mobile applications that engage users and drive business growth.',
    color: 'success',
  },
  {
    icon: 'cloud',
    title: 'Cloud Solutions',
    description:
      'Scalable cloud infrastructure and services to power your business operations efficiently.',
    color: 'info',
  },
  {
    icon: 'chart-column',
    title: 'Data Analytics',
    description:
      'Transform your data into actionable insights with advanced analytics and visualization tools.',
    color: 'warning',
  },
  {
    icon: 'shield-halved',
    title: 'Cybersecurity',
    description:
      'Comprehensive security solutions to protect your business from digital threats and vulnerabilities.',
    color: 'danger',
  },
  {
    icon: 'handshake',
    title: 'Consulting',
    description:
      'Expert consultation services to guide your business through digital transformation and growth.',
    color: 'secondary',
  },
]
</script>

<template>
  <section class="features-section py-5 bg-light">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 class="display-5 fw-bold mb-3">Our Services</h2>
          <p class="lead text-muted">
            We offer comprehensive business solutions designed to accelerate your company's growth
            and digital transformation.
          </p>
        </div>
      </div>

      <div class="row g-4">
        <div v-for="feature in features" :key="feature.title" class="col-lg-4 col-md-6">
          <div class="card h-100 border-0 shadow-sm feature-card">
            <div class="card-body text-center p-4">
              <div
                class="feature-icon mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                :class="`bg-${feature.color} bg-opacity-10`"
              >
                <FontAwesomeIcon :icon="feature.icon" :class="`text-${feature.color} fs-2`" />
              </div>
              <h5 class="card-title fw-bold mb-3">{{ feature.title }}</h5>
              <p class="card-text text-muted">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-5">
        <router-link to="/services" class="btn btn-primary btn-lg"> View All Services </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.feature-icon {
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.card-title {
  color: var(--dark-color);
}
</style>
