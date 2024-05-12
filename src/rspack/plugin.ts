import { resolve } from 'node:path'
import type { Compiler, RuleSetRule } from '@rspack/core'
import type { Options } from '@/types'

export default function useRspackCompiler(compiler: Compiler, options: Options) {
  options = Object.freeze(options)
  if (!options.vue)
    return
  const LOADER = resolve(__dirname, __DEV__ ? '../../dist/rspack/loader' : 'rspack/loader')

  // 1.find vue loader rule
  const rules = compiler.options.module.rules as RuleSetRule[]
  if (!rules.length)
    return
  let rawVueRule: RuleSetRule | null = null
  let loaderIndex: number = -1
  let loader: string = LOADER
  for (const rule of rules) {
    if (!Array.isArray(rule.use))
      continue
    if (
      ~(loaderIndex = rule.use.findIndex((u) => {
        const f
          = u && typeof u !== 'function' && (typeof u === 'string' ? u.startsWith(LOADER) : u.loader.startsWith(LOADER))
        if (f)
          loader = typeof u === 'string' ? u : u.loader
        return f
      }))
    ) {
      rawVueRule = rule
      break
    }
  }
  // 2.remake vue loader rule
  if (!rawVueRule)
    throw new Error('[unplugin-conditional-definition] cannot find conditional-definition-loader rule.')
  ;(rawVueRule!.use as RuleSetRule[]).splice(loaderIndex, 1, { loader, options })
}
