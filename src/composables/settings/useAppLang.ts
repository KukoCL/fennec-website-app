import { appTexts as spanishTexts } from '@/infrastructure/lang/spanish';
import { appTexts as englishTexts } from '@/infrastructure/lang/english';
import { useAppSettingsStore } from '@/stores/appSettingsStore';
import { storeToRefs } from 'pinia';
import type { AppLanguages } from '@/infrastructure/types';

export default function useAppLang() {
  const getAppTexts = () => {
    const settingsStore = useAppSettingsStore();
    const { appLanguage } = storeToRefs(settingsStore);
    const localStoredLanguage = localStorage.getItem('appLanguage') as AppLanguages;
    if (localStoredLanguage) {
      appLanguage.value = localStoredLanguage;
    }

    switch (appLanguage.value) {
    case 'es':
      return spanishTexts;

    case 'en':
      return englishTexts;

      // Returns spanish as default language
    default:
      return spanishTexts;
    }
  };

  return {
    getAppTexts,
  };
}
