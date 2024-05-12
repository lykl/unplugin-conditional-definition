import { defineConfig } from '@rsbuild/core'
import { pluginVue } from '@rsbuild/plugin-vue'
import UnpluginConditionalDefinition, {
  loader as ConditionalDefinitionLoader,
} from 'unplugin-conditional-definition/rspack'
// const ConditionalDefinitionLoader = require('unplugin-conditional-definition/rspack')
console.dir(ConditionalDefinitionLoader + '.cjs')
export default defineConfig({
  tools: {
    rspack: (config, options) => {
      const fakePath = 'fake.vue'
      // console.log(config.module?.rules)
      const rule = config.module?.rules?.find((rule) => (rule as any)?.test?.test(fakePath))
      // console.log(rule)
      ;(rule as any).use.push(ConditionalDefinitionLoader + '.cjs')
      console.log(rule)
      config.plugins?.push(
        UnpluginConditionalDefinition({
          env: ['LABTOP'],
          css: true,
          vue: true,
        }),
      )
      return config
    },
  },
  plugins: [pluginVue()],
})
