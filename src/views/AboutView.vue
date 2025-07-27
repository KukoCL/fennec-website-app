<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useAppLang from '@/composables/settings/useAppLang';

const { getAppTexts } = useAppLang();
const appTexts = computed(() => getAppTexts().about);

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
    name: appTexts.value.team.members.johnSmith.name,
    position: appTexts.value.team.members.johnSmith.position,
    bio: appTexts.value.team.members.johnSmith.bio,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: appTexts.value.team.members.sarahDavis.name,
    position: appTexts.value.team.members.sarahDavis.position,
    bio: appTexts.value.team.members.sarahDavis.bio,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: appTexts.value.team.members.mikeJohnson.name,
    position: appTexts.value.team.members.mikeJohnson.position,
    bio: appTexts.value.team.members.mikeJohnson.bio,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#',
    },
  },
];
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section d-flex align-items-center">
      <div class="container px-lg-5">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <h1 class="display-3 fw-bolder mb-4 mt-3 text-gradient">{{ appTexts.hero.title }}</h1>
            <p class="lead fs-4 mb-4 text-light-custom">
              {{ appTexts.hero.description }}
            </p>
          </div>
          <div class="col-lg-6">
            <div class="custom-dark-bg rounded-3 p-4 shadow-lg mt-3">
              <div class="row text-center g-3">
                <div class="col-6">
                  <div class="feature-card rounded p-3">
                    <h3 class="text-fennec-orange fw-bold">250+</h3>
                    <p class="text-white mb-0">{{ appTexts.hero.stats.projects }}</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="feature-card rounded p-3">
                    <h3 class="text-fennec-orange fw-bold">50+</h3>
                    <p class="text-white mb-0">{{ appTexts.hero.stats.teamMembers }}</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="feature-card rounded p-3">
                    <h3 class="text-fennec-orange fw-bold">5+</h3>
                    <p class="text-white mb-0">{{ appTexts.hero.stats.years }}</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="feature-card rounded p-3">
                    <h3 class="text-fennec-orange fw-bold">98%</h3>
                    <p class="text-white mb-0">{{ appTexts.hero.stats.satisfaction }}</p>
                  </div>
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
                  class="bg-dark bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style="width: 80px; height: 80px"
                >
                  <font-awesome-icon icon="fa-solid fa-crosshairs" class="text-primary fs-2" />
                </div>
                <h3 class="fw-bold mb-3">{{ appTexts.missionVision.mission.title }}</h3>
                <p class="text-muted">
                  {{ appTexts.missionVision.mission.description }}
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
                  <font-awesome-icon icon="fa-solid fa-eye" class="text-success fs-2" />
                </div>
                <h3 class="fw-bold mb-3">{{ appTexts.missionVision.vision.title }}</h3>
                <p class="text-muted">
                  {{ appTexts.missionVision.vision.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-5 bg-light">
      <div class="container px-lg-5">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h2 class="display-5 fw-bold mb-4">{{ appTexts.story.title }}</h2>
            <p class="mb-4">
              {{ appTexts.story.paragraphs[0] }}
            </p>
            <p class="mb-4">
              {{ appTexts.story.paragraphs[1] }}
            </p>
            <div class="row g-3">
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <i class="fa-solid fa-check-circle text-success me-2"></i>
                  <span>{{ appTexts.story.features.expertTeam }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <i class="fa-solid fa-check-circle text-success me-2"></i>
                  <span>{{ appTexts.story.features.provenResults }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <i class="fa-solid fa-check-circle text-success me-2"></i>
                  <span>{{ appTexts.story.features.support }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <i class="fa-solid fa-check-circle text-success me-2"></i>
                  <span>{{ appTexts.story.features.globalReach }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="bg-primary rounded-3 p-4">
              <div class="row g-3 text-white text-center">
                <div class="col-12">
                  <h4 class="mb-3">{{ appTexts.story.timeline.title }}</h4>
                </div>
                <div class="col-12">
                  <div class="border-bottom border-light pb-3 mb-3">
                    <strong>2019</strong> - {{ appTexts.story.timeline.events[2019] }}
                  </div>
                  <div class="border-bottom border-light pb-3 mb-3">
                    <strong>2020</strong> - {{ appTexts.story.timeline.events[2020] }}
                  </div>
                  <div class="border-bottom border-light pb-3 mb-3">
                    <strong>2021</strong> - {{ appTexts.story.timeline.events[2021] }}
                  </div>
                  <div class="border-bottom border-light pb-3 mb-3">
                    <strong>2022</strong> - {{ appTexts.story.timeline.events[2022] }}
                  </div>
                  <div><strong>2024</strong> - {{ appTexts.story.timeline.events[2024] }}</div>
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
            <h2 class="display-5 fw-bold mb-3">{{ appTexts.team.title }}</h2>
            <p class="lead text-muted">
              {{ appTexts.team.description }}
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
                    <font-awesome-icon icon="fa-brands fa-linkedin-in"></font-awesome-icon>
                  </a>
                  <a v-if="member.social.twitter" :href="member.social.twitter" class="btn btn-outline-primary btn-sm">
                    <font-awesome-icon icon="fa-brands fa-twitter"></font-awesome-icon>
                  </a>
                  <a v-if="member.social.github" :href="member.social.github" class="btn btn-outline-primary btn-sm">
                    <font-awesome-icon icon="fa-brands fa-github"></font-awesome-icon>
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
      <div class="container px-lg-5">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3">{{ appTexts.values.title }}</h2>
            <p class="lead text-muted">
              {{ appTexts.values.description }}
            </p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="text-center">
              <div
                class="bg-dark bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <font-awesome-icon icon="fa-solid fa-heart" class="text-primary fs-2"></font-awesome-icon>
              </div>
              <h5 class="fw-bold mb-2">{{ appTexts.values.items.passion.title }}</h5>
              <p class="text-muted small">
                {{ appTexts.values.items.passion.description }}
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center">
              <div
                class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <font-awesome-icon icon="fa-solid fa-shield-halved" class="text-success fs-2"></font-awesome-icon>
              </div>
              <h5 class="fw-bold mb-2">{{ appTexts.values.items.integrity.title }}</h5>
              <p class="text-muted small">
                {{ appTexts.values.items.integrity.description }}
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center">
              <div
                class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <font-awesome-icon icon="fa-solid fa-lightbulb" class="text-warning fs-2"></font-awesome-icon>
              </div>
              <h5 class="fw-bold mb-2">{{ appTexts.values.items.innovation.title }}</h5>
              <p class="text-muted small">
                {{ appTexts.values.items.innovation.description }}
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="text-center">
              <div
                class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style="width: 80px; height: 80px"
              >
                <font-awesome-icon icon="fa-solid fa-users" class="text-info fs-2"></font-awesome-icon>
              </div>
              <h5 class="fw-bold mb-2">{{ appTexts.values.items.collaboration.title }}</h5>
              <p class="text-muted small">
                {{ appTexts.values.items.collaboration.description }}
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
  background-color: rgb(17, 24, 39);
  position: relative;
  overflow: hidden;
  padding: 100px 0;
}

.text-gradient {
  background: linear-gradient(90deg, #FF8C00, #DAA520);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.custom-dark-bg {
  background-color: #1E1E1E;
  border: 1px solid #3D3D3D33;
}

.feature-card {
  background-color: #2D2D2D;
  transition: all 0.3s ease;
  border: 1px solid #3D3D3D33;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(255, 140, 0, 0.1);
}

.text-fennec-orange {
  color: #FF8C00;
}

.text-light-custom {
  color: #D1D5DB;
}

.team-card {
  transition: all 0.3s ease;
  background-color: #1E1E1E;
  border: 1px solid #3D3D3D33;
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
}

/* Estilos consistentes para las secciones */
section {
  background-color: rgb(17, 24, 39);
  position: relative;
  overflow: hidden;
  padding: 80px 0;
}

section.bg-light {
  background-color: rgb(22, 29, 44);
}

.card {
  background-color: #1E1E1E;
  border: 1px solid #3D3D3D33;
}

h2, h3, h4, h5 {
  color: #FFFFFF;
}

p {
  color: #D1D5DB;
}

.text-muted {
  color: #9CA3AF !important;
}
</style>
