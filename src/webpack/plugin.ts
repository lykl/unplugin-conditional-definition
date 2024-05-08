import { resolve } from 'node:path'
import type { Compiler, RuleSetRule } from 'webpack'
import type { Options } from '@/types'

const LOADER = resolve(__dirname, __DEV__ ? '../../dist/webpack/loader' : 'webpack/loader')

export default function useWebpackCompiler(compiler: Compiler, options: Options) {
  options = Object.freeze(options)
  // 1.find vue loader rule
  const rules = compiler.options.module.rules as RuleSetRule[]
  if (!rules.length)
    return
  let rawVueRule: RuleSetRule | null = null
  let loaderIndex: number = -1
  for (const rule of rules) {
    if (!Array.isArray(rule.use))
      continue
    if (
      ~(loaderIndex = rule.use.findIndex(
        u => u && typeof u !== 'function' && (typeof u === 'string' ? u === LOADER : u.loader === LOADER),
      ))
    ) {
      rawVueRule = rule
      break
    }
  }
  // 2.remake vue loader rule
  if (rawVueRule) {
    if (Array.isArray(rawVueRule.use)) {
      rawVueRule.use.splice(loaderIndex, 1, { loader: LOADER, options })
    }
    else {
      let vueLoader = rawVueRule.loader
      if (!vueLoader && typeof rawVueRule.use === 'string')
        vueLoader = rawVueRule.use
      rawVueRule.use = [vueLoader, { loader: LOADER, options }]
    }
  }
}
