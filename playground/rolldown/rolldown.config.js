import { defineConfig } from 'rolldown'
import UnpluginConditionalDefinition from 'unplugin-conditional-definition/rolldown'

export default defineConfig({
  input: './index.js',
  output: {
    dir: 'dist',
  },
  plugins: [
    UnpluginConditionalDefinition({
      env: ['LABTOP'],
      scope: [],
    }),
  ],
})
