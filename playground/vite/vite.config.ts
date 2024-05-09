import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import UnpluginConditionalDefinitionVite from 'unplugin-conditional-definition/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnpluginConditionalDefinitionVite({
      env: ['LABTOP'],
      vue: true,
      css: true,
    }),
    Inspect(),
  ],
})
