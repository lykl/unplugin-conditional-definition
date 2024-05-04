import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/*.ts'],
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  banner: (ctx) => {
    if (ctx.format === 'esm') {
      return {
        js: `import {createRequire as __createRequire} from 'module';var require=__createRequire(import\.meta.url);`,
      }
    }
  },
})
