import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  skipFormatting,
  {
    rules: {
      eqeqeq: ['error', 'always'],
      'vue/max-len': ['error', {
        'code': 120,
        'template': 300,
        'comments': 120,
      }],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'no-multiple-empty-lines': ['error', {
        'max': 1,
        'maxEOF': 1,
        'maxBOF': 0,
      }],
      'no-trailing-spaces': 'error',
      'quotes': ['error', 'single', { 'avoidEscape': true }],
    },
  },
);
