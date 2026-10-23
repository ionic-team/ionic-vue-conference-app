import js from '@eslint/js';
import ionic from '@ionic/eslint-config/recommended.js';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  ...defineConfigWithVueTs(
    {
      ignores: ['dist', 'node_modules', 'android', 'ios', 'build']
    },
    js.configs.recommended,
    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended
  ),
  // Kept outside defineConfigWithVueTs: it treats `consistent-type-imports` as
  // type-aware and would turn on project-based parsing for every .ts file.
  ...ionic,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/no-deprecated-slot-attribute': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // Ionic's base level; `recommended` makes it an error, which is meant for libraries.
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      // Demo views are intentionally single-word ("About", "Menu", "Tabs", ...).
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      // Menu.vue registers a few Ionic components it doesn't currently use.
      'vue/no-unused-components': 'off',
      // Vuex modules type RootState as `{}`; keep the generic as-is.
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
];
