<script setup lang="ts">
interface Service {
  id: string
  icon: string
  title: string
  description: string
  features: string[]
  color: string
  price: string
}

const services: Service[] = [
  {
    id: 'web-development',
    icon: 'code',
    title: 'Web Development',
    description: 'Custom web applications built with modern frameworks and technologies.',
    features: [
      'Responsive Design',
      'Performance Optimization',
      'SEO Friendly',
      'Cross-browser Compatible',
    ],
    color: 'dark',
    price: 'Starting at $2,999',
  },
  {
    id: 'mobile-apps',
    icon: 'mobile-screen-button',
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
    features: [
      'Native Performance',
      'Cross-platform',
      'App Store Optimization',
      'Push Notifications',
    ],
    color: 'success',
    price: 'Starting at $4,999',
  },
  {
    id: 'cloud-solutions',
    icon: 'cloud',
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and migration services.',
    features: ['Cloud Migration', 'Auto Scaling', 'Cost Optimization', '24/7 Monitoring'],
    color: 'info',
    price: 'Starting at $1,999',
  },
  {
    id: 'data-analytics',
    icon: 'chart-column',
    title: 'Data Analytics',
    description: 'Transform your data into actionable business insights.',
    features: [
      'Real-time Analytics',
      'Custom Dashboards',
      'Data Visualization',
      'Predictive Modeling',
    ],
    color: 'warning',
    price: 'Starting at $3,499',
  },
  {
    id: 'cybersecurity',
    icon: 'shield-halved',
    title: 'Cybersecurity',
    description: 'Comprehensive security solutions to protect your business.',
    features: ['Security Audits', 'Threat Detection', 'Compliance Management', 'Employee Training'],
    color: 'danger',
    price: 'Starting at $2,499',
  },
  {
    id: 'consulting',
    icon: 'handshake',
    title: 'IT Consulting',
    description: 'Expert consultation to optimize your technology strategy.',
    features: [
      'Strategy Planning',
      'Technology Assessment',
      'Digital Transformation',
      'Process Optimization',
    ],
    color: 'secondary',
    price: 'Starting at $199/hour',
  },
]
</script>

<template>
  <div class="services-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center py-5">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="display-4 fw-bold mb-4">Our Services</h1>
            <p class="lead">
              We offer comprehensive technology solutions designed to accelerate your business
              growth and digital transformation journey.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-5">
      <div class="container">
        <div class="row g-4">
          <div v-for="service in services" :key="service.id" class="col-lg-4 col-md-6">
            <div class="card h-100 border-0 shadow-sm service-card">
              <div class="card-body p-4">
                <div
                  class="service-icon mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  :class="`bg-${service.color} bg-opacity-10`"
                >
                  <FontAwesomeIcon :icon="service.icon" :class="`text-${service.color} fs-2`" />
                </div>

                <h4 class="card-title fw-bold text-center mb-3">{{ service.title }}</h4>
                <p class="card-text text-muted text-center mb-4">{{ service.description }}</p>

                <ul class="list-unstyled mb-4">
                  <li
                    v-for="feature in service.features"
                    :key="feature"
                    class="d-flex align-items-center mb-2"
                  >
                    <FontAwesomeIcon icon="check" class="text-success me-2" />
                    <span class="small">{{ feature }}</span>
                  </li>
                </ul>

                <div class="text-center">
                  <p class="fw-bold mb-3" :class="`text-${service.color}`">{{ service.price }}</p>
                  <router-link to="/contact" :class="`btn btn-${service.color} btn-sm`">
                    Get Started
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3">Our Process</h2>
            <p class="lead text-muted">
              We follow a proven methodology to ensure your project's success from start to finish.
            </p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="text-center process-step">
              <div
                class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <span class="fw-bold fs-4">1</span>
              </div>
              <h5 class="fw-bold mb-2">Discovery</h5>
              <p class="text-muted small">
                We analyze your business needs and requirements to create a comprehensive project
                plan.
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center process-step">
              <div
                class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <span class="fw-bold fs-4">2</span>
              </div>
              <h5 class="fw-bold mb-2">Design</h5>
              <p class="text-muted small">
                Our team creates detailed designs and prototypes to visualize your solution.
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center process-step">
              <div
                class="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <span class="fw-bold fs-4">3</span>
              </div>
              <h5 class="fw-bold mb-2">Development</h5>
              <p class="text-muted small">
                We build your solution using industry best practices and cutting-edge technologies.
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center process-step">
              <div
                class="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <span class="fw-bold fs-4">4</span>
              </div>
              <h5 class="fw-bold mb-2">Launch</h5>
              <p class="text-muted small">
                We deploy your solution and provide ongoing support to ensure smooth operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technologies Section -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3">Technologies We Use</h2>
            <p class="lead text-muted">
              We leverage the latest technologies and frameworks to build robust, scalable
              solutions.
            </p>
          </div>
        </div>

        <div class="row g-4 align-items-center justify-content-center">
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon :icon="['fab', 'react']" class="text-info" style="font-size: 3rem" />
              <p class="small mt-2 mb-0">React</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon
                :icon="['fab', 'vuejs']"
                class="text-success"
                style="font-size: 3rem"
              />
              <p class="small mt-2 mb-0">Vue.js</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon
                :icon="['fab', 'node-js']"
                class="text-success"
                style="font-size: 3rem"
              />
              <p class="small mt-2 mb-0">Node.js</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon
                :icon="['fab', 'python']"
                class="text-primary"
                style="font-size: 3rem"
              />
              <p class="small mt-2 mb-0">Python</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon
                :icon="['fab', 'aws']"
                class="text-warning"
                style="font-size: 3rem"
              />
              <p class="small mt-2 mb-0">AWS</p>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2 text-center">
            <div class="tech-logo p-3">
              <FontAwesomeIcon
                :icon="['fab', 'docker']"
                class="text-info"
                style="font-size: 3rem"
              />
              <p class="small mt-2 mb-0">Docker</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5 bg-primary text-white">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h2 class="display-6 fw-bold mb-3">Ready to Get Started?</h2>
            <p class="lead mb-0">
              Let's discuss your project and find the perfect solution for your business needs.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <router-link to="/contact" class="btn btn-light btn-lg">
              <FontAwesomeIcon icon="comment" class="me-2" />
              Contact Us Today
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

.service-card {
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.service-icon {
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
}

.service-card:hover .service-icon {
  transform: scale(1.1);
}

.process-step {
  transition: all 0.3s ease;
}

.process-step:hover {
  transform: translateY(-5px);
}

.tech-logo {
  transition: all 0.3s ease;
  border-radius: 10px;
}

.tech-logo:hover {
  background-color: var(--light-color);
  transform: scale(1.1);
}
</style>
