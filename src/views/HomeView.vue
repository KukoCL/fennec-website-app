<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue';
import FeaturesSection from '../components/FeaturesSection.vue';
import TestimonialsSection from '../components/TestimonialsSection.vue';
import CallToActionSection from '../components/CallToActionSection.vue';
</script>

<template>
  <div class="home">
    <HeroSection />
    <FeaturesSection />
    <TestimonialsSection />
    <CallToActionSection />
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}
</style>
