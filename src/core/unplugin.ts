import type { UnpluginContextMeta } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from '../types'
import useWebpackCompiler from '../webpack/plugin'
import { DEFAULT_INCLUDE, defaultOptions } from './constants'
import { createUnpluginContext } from './unpluginContext'

export default createUnplugin<Options>((options: Options, meta: UnpluginContextMeta) => {
  options = Object.assign(
    {},
    defaultOptions,
    meta.framework === 'webpack'
      ? {
          include: DEFAULT_INCLUDE,
        }
      : {},
    options,
  )
  const ctx = createUnpluginContext(options)
  return {
    name: 'unplugin-conditional-definition',
    enforce: 'pre',
    transformInclude(id) {
      return ctx.filter(id)
    },
    transform(code, id) {
      return ctx.transform(code, id)
    },
    webpack(compiler) {
      useWebpackCompiler(compiler, options)
    },
  }
})
