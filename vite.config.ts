import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), legacy()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
});
