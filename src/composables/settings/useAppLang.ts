import { appTexts as spanishTexts } from '@/infrastructure/lang/spanish';
import { appTexts as englishTexts } from '@/infrastructure/lang/english';
import { useAppSettingsStore } from '@/stores/appSettingsStore';
import { storeToRefs } from 'pinia';

export default function useAppLang() {
  const getAppTexts = () => {
    const settingsStore = useAppSettingsStore();
    const { appLanguage } = storeToRefs(settingsStore);

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
