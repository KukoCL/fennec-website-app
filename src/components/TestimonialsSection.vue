<script setup lang="ts">
interface Testimonial {
  name: string
  position: string
  company: string
  message: string
  avatar: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    position: 'CEO',
    company: 'TechStart Inc.',
    message:
      'Fennec Company transformed our business with their innovative solutions. Our productivity increased by 300% and customer satisfaction is at an all-time high.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    position: 'CTO',
    company: 'Global Solutions',
    message:
      'The team at Fennec delivered exceptional results. Their expertise in cloud solutions helped us scale our operations seamlessly.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    position: 'Marketing Director',
    company: 'Creative Agency',
    message:
      'Outstanding service and support. They understood our vision and delivered a solution that exceeded our expectations.',
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
          <h2 class="display-5 fw-bold mb-3">What Our Clients Say</h2>
          <p class="lead text-muted">
            Don't just take our word for it. Here's what our satisfied clients have to say about
            working with us.
          </p>
        </div>
      </div>

      <div class="row g-4">
        <div v-for="testimonial in testimonials" :key="testimonial.name" class="col-lg-4 col-md-6">
          <div class="card h-100 border-0 shadow-sm testimonial-card">
            <div class="card-body p-4">
              <!-- Stars Rating -->
              <div class="mb-3">
                <span v-for="star in 5" :key="star" class="text-warning">
                  <FontAwesomeIcon :icon="star <= testimonial.rating ? 'star' : ['far', 'star']" />
                </span>
              </div>

              <!-- Testimonial Text -->
              <p class="card-text text-muted mb-4">"{{ testimonial.message }}"</p>

              <!-- Client Info -->
              <div class="d-flex align-items-center">
                <img
                  :src="testimonial.avatar"
                  :alt="testimonial.name"
                  class="rounded-circle me-3"
                  width="50"
                  height="50"
                  style="object-fit: cover"
                  onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNGMEYwRjAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMyIgeT0iMTMiPgo8cGF0aCBkPSJNMTIgMTJDMTQuMjA5MSAxMiAxNiAxMC4yMDkxIDE2IDhDMTYgNS43OTA5IDE0LjIwOTEgNCAxMiA0QzkuNzkwODYgNCA4IDUuNzkwOSA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjOTk5OTk5Ii8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDE0IDcgMTYuMzMgNyAxOVYyMEgxN1YxOUMxNyAxNi4zMyAxNC42NyAxNCAxMiAxNFoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+Cjwvc3ZnPgo='"
                />
                <div>
                  <h6 class="mb-0 fw-bold">{{ testimonial.name }}</h6>
                  <small class="text-muted">
                    {{ testimonial.position }}, {{ testimonial.company }}
                  </small>
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
            <p class="text-muted">Projects Completed</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 text-center mb-4">
          <div class="stat-item">
            <h3 class="display-4 fw-bold text-primary mb-0">98%</h3>
            <p class="text-muted">Client Satisfaction</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 text-center mb-4">
          <div class="stat-item">
            <h3 class="display-4 fw-bold text-primary mb-0">50+</h3>
            <p class="text-muted">Team Members</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 text-center mb-4">
          <div class="stat-item">
            <h3 class="display-4 fw-bold text-primary mb-0">5+</h3>
            <p class="text-muted">Years Experience</p>
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
