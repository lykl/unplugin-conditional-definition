import { resolve } from 'node:path'
import unplugin from './core/unplugin'
import type { Options } from './types'

export const loader = resolve(__dirname, 'webpack/loader')
export default unplugin.webpack as (options?: Options) => ReturnType<typeof unplugin.webpack>
