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

const teamMembers = computed<TeamMember[]>(() => {
  const members = appTexts.value.team.members;

  return [
    {
      name: members.gonzalo.name,
      position: members.gonzalo.position,
      bio: members.gonzalo.bio,
      avatar: avatar1,
      social: {
        linkedin: '#',
        twitter: '#',
      },
    },
    {
      name: members.francisco.name,
      position: members.francisco.position,
      bio: members.francisco.bio,
      avatar: 'src/assets/images/team/avatar2.png',
      social: {
        linkedin: 'https://www.linkedin.com/in/franciscopuebla/',
        github: 'https://github.com/fpueblaCL',
      },
    },
    {
      name: members.christian.name,
      position: members.christian.position,
      bio: members.christian.bio,
      avatar: 'src/assets/images/team/avatar3.png',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: members.daniel.name,
      position: members.daniel.position,
      bio: members.daniel.bio,
      avatar: 'src/assets/images/team/avatar4.png',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: members.jaime.name,
      position: members.jaime.position,
      bio: members.jaime.bio,
      avatar: 'src/assets/images/team/avatar5.png',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
  ];
});
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5 position-relative overflow-hidden">
      <div class="container px-lg-5 position-relative">
        <div class="row align-items-center py-5">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4 hero-title">{{ appTexts.hero.title }}</h1>
            <p class="lead hero-description">
              {{ appTexts.hero.description }}
            </p>
          </div>
          <div class="col-lg-6">
            <div class="bg-dark rounded-3 p-4">
              <div class="row text-center">
                <div class="col-6 mb-3">
                  <h3 class="gradient-text fw-bold">250+</h3>
                  <small class="text-white">{{ appTexts.hero.stats.projects }}</small>
                </div>
                <div class="col-6 mb-3">
                  <h3 class="gradient-text fw-bold">50+</h3>
                  <small class="text-white">{{ appTexts.hero.stats.teamMembers }}</small>
                </div>
                <div class="col-6">
                  <h3 class="gradient-text fw-bold">5+</h3>
                  <small class="text-white">{{ appTexts.hero.stats.years }}</small>
                </div>
                <div class="col-6">
                  <h3 class="gradient-text fw-bold">98%</h3>
                  <small class="text-white">{{ appTexts.hero.stats.satisfaction }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative elements -->
      <div class="hero-decoration-1 position-absolute"></div>
      <div class="hero-decoration-2 position-absolute"></div>
      <div class="hero-decoration-3 position-absolute"></div>
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
                  <font-awesome-icon icon="fa-solid fa-crosshairs" class="fs-2 icon-orange" />
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
                  <font-awesome-icon icon="fa-solid fa-eye" class="fs-2 icon-orange" />
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
    <section class="py-5 text-white">
      <div class="container px-lg-5">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h2 class="display-5 fw-bold mb-4 gradient-text">{{ appTexts.story.title }}</h2>
            <p class="mb-5 justified-text">
              {{ appTexts.story.paragraphs[0] }}
            </p>
            <p class="mb-4 justified-text">
              {{ appTexts.story.paragraphs[1] }}
            </p>
            <p class="mb-4 justified-text">
              {{ appTexts.story.paragraphs[2] }}
            </p>
            <p class="mb-4 justified-text">
              {{ appTexts.story.paragraphs[3] }}
            </p>
          </div>

          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100">
              <img
                src="/src/assets/images/team/team.jpg"
                alt="Team Image"
                class="img-fluid rounded-3"
                style="object-fit: cover; height: auto; width: 100%" />
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
            <h2 class="display-5 fw-bold mb-3 gradient-text">{{ appTexts.team.title }}</h2>
            <p class="lead text-white">
              {{ appTexts.team.description }}
            </p>
          </div>
        </div>

        <div class="row g-4 justify-content-center">
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
                  <a v-if="member.social.linkedin" :href="member.social.linkedin" class="btn btn-sm" target="_blank">
                    <font-awesome-icon icon="fa-brands fa-linkedin-in" class="icon-orange"></font-awesome-icon>
                  </a>
                  <a v-if="member.social.twitter" :href="member.social.twitter" class="btn btn-sm" target="_blank">
                    <font-awesome-icon icon="fa-brands fa-twitter" class="icon-orange"></font-awesome-icon>
                  </a>
                  <a v-if="member.social.github" :href="member.social.github" class="btn btn-sm" target="_blank">
                    <font-awesome-icon icon="fa-brands fa-github" class="icon-orange"></font-awesome-icon>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Background Section-->
    <section class="py-5 text-white">
      <div class="container px-lg-5">
        <div class="row align-items-center">
          <div class="col-lg-12">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body p-5 text-center">
                <h2 class="display-5 fw-bold mb-4 ">{{ appTexts.teamBackground.title }}</h2>
                <p class="mb-5 justified-text">
                  {{ appTexts.teamBackground.paragraphs[0] }}
                </p>
                <p class="mb-4 justified-text">
                  {{ appTexts.teamBackground.paragraphs[1] }}
                </p>
                <p class="mb-4 justified-text">
                  {{ appTexts.teamBackground.paragraphs[2] }}
                </p>
                <p class="mb-4 justified-text">
                  {{ appTexts.teamBackground.paragraphs[3] }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-5 text-white">
      <div class="container px-lg-5">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold mb-3 gradient-text">{{ appTexts.values.title }}</h2>
            <p class="lead text-white">
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
              <p class="text-white small">
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
              <p class="text-white small">
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
              <p class="text-white small">
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
              <p class="text-white small">
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
.team-card {
  transition: all 0.3s ease;
  min-height: 100%;
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.justified-text {
  text-align: justify;
}

.team-background-section {
  padding: 3rem 0;
  background-color: #f8f9fa; /* bg-light */
  color: #212529; /* text-dark */
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  max-width: 900px;
}
</style>
