import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import globals from 'globals';

export default defineConfigWithVueTs(
  {
    ignores: ['dist', 'node_modules', 'android', 'ios', 'build']
  },
  js.configs.recommended,
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
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
      // Demo views are intentionally single-word ("About", "Menu", "Tabs", ...).
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      // Menu.vue registers a few Ionic components it doesn't currently use.
      'vue/no-unused-components': 'off',
      // Vuex modules type RootState as `{}`; keep the generic as-is.
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
);
