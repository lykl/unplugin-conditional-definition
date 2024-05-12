import { defineConfig } from 'rollup'
import UnpluginConditionalDefinition from 'unplugin-conditional-definition/rollup'
import { terser } from 'rollup-plugin-terser'

export default defineConfig({
  input: './index.js',
  output: { dir: 'dist', format: 'es' },
  plugins: [
    UnpluginConditionalDefinition({
      env: ['LABTOP'],
      scope: [],
    }),
    terser({
      output: {
        comments: false, // 移除所有注释
      },
    }),
  ],
})
