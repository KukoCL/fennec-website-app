import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { AppLanguages } from '@/infrastructure/types';

export const useAppSettingsStore = defineStore('appSettingsStore', () => {
  const appLanguage = ref('es' as AppLanguages);

  return {
    appLanguage,
  };
});
