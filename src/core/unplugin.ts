import { createUnplugin } from 'unplugin'
import type { Options } from '../types'
import { defaultOptions } from './constants'
import { createUnpluginContext } from './unpluginContext'

export default createUnplugin<Options>((options?: Options) => {
  const ctx = createUnpluginContext(Object.assign({}, defaultOptions, options))
  return {
    name: 'unplugin-conditional-definition',
    enforce: 'pre',
    transformInclude(id) {
      return ctx.filter(id)
    },
    transform(code, id) {
      return ctx.transform(code, id)
    },
  }
})
