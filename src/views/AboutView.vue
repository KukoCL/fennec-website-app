<script setup lang="ts">
interface TeamMember {
  name: string
  position: string
  bio: string
  avatar: string
  social: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}

const teamMembers: TeamMember[] = [
  {
    name: 'John Smith',
    position: 'CEO & Founder',
    bio: 'With over 15 years of experience in technology and business strategy, John leads our vision for innovation.',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Sarah Davis',
    position: 'CTO',
    bio: 'Sarah is responsible for our technical strategy and ensures we stay at the forefront of technology trends.',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: 'Mike Johnson',
    position: 'Lead Developer',
    bio: 'Mike leads our development team and ensures we deliver high-quality solutions that exceed expectations.',
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#',
    },
  },
]
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center py-5">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">About Fennec Company</h1>
            <p class="lead">
              We are a forward-thinking technology company dedicated to helping businesses thrive in
              the digital age through innovative solutions and expert guidance.
            </p>
          </div>
          <div class="col-lg-6">
            <div class="bg-light rounded-3 p-4">
              <div class="row text-center">
                <div class="col-6 mb-3">
                  <h3 class="text-primary fw-bold">250+</h3>
                  <small class="text-muted">Projects</small>
                </div>
                <div class="col-6 mb-3">
                  <h3 class="text-primary fw-bold">50+</h3>
                  <small class="text-muted">Team Members</small>
                </div>
                <div class="col-6">
                  <h3 class="text-primary fw-bold">5+</h3>
                  <small class="text-muted">Years</small>
                </div>
                <div class="col-6">
                  <h3 class="text-primary fw-bold">98%</h3>
                  <small class="text-muted">Satisfaction</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-5">
      <div class="container">
        <div class="row g-5">
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body p-5 text-center">
                <div
                  class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style="width: 80px; height: 80px"
                >
                  <i class="fa-solid fa-bullseye text-primary fs-2"></i>
                </div>
                <h3 class="fw-bold mb-3">Our Mission</h3>
                <p class="text-muted">
                  To empower businesses with cutting-edge technology solutions that drive growth,
                  efficiency, and innovation in an ever-evolving digital landscape.
                </p>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body p-5 text-center">
                <div
                  class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style="width: 80px; height: 80px"
                >
                  <i class="fa-solid fa-eye text-success fs-2"></i>
                </div>
                <h3 class="fw-bold mb-3">Our Vision</h3>
                <p class="text-muted">
                  To be the leading technology partner for businesses worldwide, creating
                  sustainable digital transformations that make a positive impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h2 class="display-5 fw-bold mb-4">Our Story</h2>
            <p class="mb-4">
              Founded in 2019, Fennec Company started with a simple mission: to help businesses
              leverage technology for sustainable growth. What began as a small team of passionate
              developers has grown into a comprehensive technology solutions provider.
            </p>
            <p class="mb-4">
              Over the years, we've helped hundreds of companies transform their operations, reach
              new markets, and achieve their business goals through innovative technology solutions
              and strategic consulting.
            </p>
            <div class="row g-3">
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <i class="fa-solid fa-check-circle text-success me-2"></i>
                  <span>Expert Team</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <i class="fa-solid fa-check-circle text-success me-2"></i>
                  <span>Proven Results</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <i class="fa-solid fa-check-circle text-success me-2"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <i class="fa-solid fa-check-circle text-success me-2"></i>
                  <span>Global Reach</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="bg-primary rounded-3 p-4">
              <div class="row g-3 text-white text-center">
                <div class="col-12">
                  <h4 class="mb-3">Company Timeline</h4>
                </div>
                <div class="col-12">
                  <div class="border-bottom border-light pb-3 mb-3">
                    <strong>2019</strong> - Company Founded
                  </div>
                  <div class="border-bottom border-light pb-3 mb-3">
                    <strong>2020</strong> - First 50 Clients
                  </div>
                  <div class="border-bottom border-light pb-3 mb-3">
                    <strong>2021</strong> - International Expansion
                  </div>
                  <div class="border-bottom border-light pb-3 mb-3">
                    <strong>2022</strong> - 100+ Team Members
                  </div>
                  <div><strong>2024</strong> - Industry Leader</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3">Meet Our Team</h2>
            <p class="lead text-muted">
              Our diverse team of experts brings together years of experience and passion for
              innovation.
            </p>
          </div>
        </div>

        <div class="row g-4">
          <div v-for="member in teamMembers" :key="member.name" class="col-lg-4 col-md-6">
            <div class="card border-0 shadow-sm team-card">
              <div class="card-body text-center p-4">
                <img
                  :src="member.avatar"
                  :alt="member.name"
                  class="rounded-circle mb-3"
                  width="120"
                  height="120"
                  style="object-fit: cover"
                />
                <h5 class="fw-bold mb-1">{{ member.name }}</h5>
                <p class="text-primary mb-3">{{ member.position }}</p>
                <p class="text-muted small mb-3">{{ member.bio }}</p>

                <div class="d-flex justify-content-center gap-2">
                  <a
                    v-if="member.social.linkedin"
                    :href="member.social.linkedin"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <i class="fa-brands fa-linkedin-in"></i>
                  </a>
                  <a
                    v-if="member.social.twitter"
                    :href="member.social.twitter"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <i class="fa-brands fa-twitter"></i>
                  </a>
                  <a
                    v-if="member.social.github"
                    :href="member.social.github"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <i class="fa-brands fa-github"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3">Our Values</h2>
            <p class="lead text-muted">
              These core values guide everything we do and define who we are as a company.
            </p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="text-center">
              <div
                class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <i class="fa-solid fa-heart text-primary fs-2"></i>
              </div>
              <h5 class="fw-bold mb-2">Passion</h5>
              <p class="text-muted small">
                We are passionate about technology and helping our clients succeed.
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center">
              <div
                class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <i class="fa-solid fa-shield-halved text-success fs-2"></i>
              </div>
              <h5 class="fw-bold mb-2">Integrity</h5>
              <p class="text-muted small">
                We conduct business with honesty, transparency, and ethical practices.
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center">
              <div
                class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <i class="fa-solid fa-lightbulb text-warning fs-2"></i>
              </div>
              <h5 class="fw-bold mb-2">Innovation</h5>
              <p class="text-muted small">
                We continuously seek creative solutions and embrace new technologies.
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center">
              <div
                class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <i class="fa-solid fa-users text-info fs-2"></i>
              </div>
              <h5 class="fw-bold mb-2">Collaboration</h5>
              <p class="text-muted small">
                We believe in the power of teamwork and building strong partnerships.
              </p>
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

.team-card {
  transition: all 0.3s ease;
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}
</style>
