<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const isNavCollapsed = ref(true)

const toggleNav = () => {
  isNavCollapsed.value = !isNavCollapsed.value
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand fw-bold" to="/">
        <img
          src="/favicon.ico"
          alt="Logo"
          width="30"
          height="30"
          class="d-inline-block align-top me-2"
        />
        Fennec
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: !isNavCollapsed }" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" @click="isNavCollapsed = true">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about" @click="isNavCollapsed = true"
              >About</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/services" @click="isNavCollapsed = true"
              >Services</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/portfolio" @click="isNavCollapsed = true"
              >Portfolio</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/contact" @click="isNavCollapsed = true"
              >Contact</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="btn btn-primary ms-2" to="/contact" @click="isNavCollapsed = true"
              >Get Started</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: relative;
  z-index: 1000;
}

.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ffffff !important;
}

.router-link-active:not(.btn) {
  color: #ffffff !important;
  font-weight: bold;
}

.btn-primary {
  padding: 0.5rem 1rem;
  border-radius: 25px;
}
</style>
