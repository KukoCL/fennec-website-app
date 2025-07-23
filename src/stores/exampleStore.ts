import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// This is an example of a Pinia store for a counter. This is a "setup store"
// examples and documentation: https://pinia.vuejs.org/core-concepts/#Setup-Stores
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Pedro')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, name, doubleCount, increment }
})
