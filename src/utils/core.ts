import {
  CONDITIONAL_END_STATEMENT_REGEXP,
  CONDITIONAL_NOT_START_STATEMENT_REGEXP,
  CONDITIONAL_START_STATEMENT_REGEXP,
  ENVIRONMENT_REGEXP,
  LEGALITY_REGEXP,
} from '../core/constants'
import type { Options } from '@/types'

export function isConditionalStartStatement(val: string) {
  return CONDITIONAL_START_STATEMENT_REGEXP.test(val)
}
export function isConditionalEndStatement(val: string) {
  return CONDITIONAL_END_STATEMENT_REGEXP.test(val)
}
export const MODE_BEHAVIOR: Record<Options['mode'], (val: string) => any> = {
  strict: (val: string) => {
    throw new Error(`"${val}" doesn't follow variable naming conventions.`)
  },
  transform: val => wordFormat(val),
  ignore: val => val,
}
export function isCurrentEvironment(val: string, args: string[] = [], mode: Options['mode'] = 'strict') {
  const isNotDefine = CONDITIONAL_NOT_START_STATEMENT_REGEXP.test(val)
  const reg = new RegExp(ENVIRONMENT_REGEXP)
  val = val.replace(CONDITIONAL_START_STATEMENT_REGEXP, '')
  let result: RegExpExecArray | null
  while ((result = reg.exec(val))) {
    let env = result[0]
    if (!LEGALITY_REGEXP.test(env))
      env = MODE_BEHAVIOR[mode](env)

    if (args.includes(env))
      return !isNotDefine
  }
  return isNotDefine
}

export function wordFormat(val: string) {
  return val
    .replace(/(^[\d-]+)|(-$)/g, '')
    .replace(/_|--+/g, '-')
    .toUpperCase()
}

export function binarySearch<T>(
  list: T[] = [],
  target: T,
  leftShift: (target: T, item: T, index: number, list: T[]) => boolean,
  rightShift: (target: T, item: T, index: number, list: T[]) => boolean,
) {
  let low = 0
  let high = list.length - 1
  while (low <= high) {
    const mid = low + ((high - low) >> 1)
    if (rightShift(target, list[mid], mid, list))
      low = mid + 1
    else if (leftShift(target, list[mid], mid, list))
      high = mid - 1
    else return mid
  }
  return low
}

export function dfs<T extends Record<string, any>>(
  node: T,
  parentNode: T | null,
  handler: (node: T, parentNode: T | null) => boolean | void,
  scheduler: (node: T, parentNode: T | null) => T[] | void,
) {
  const flag = handler(node, parentNode)
  if (flag)
    return
  const children = scheduler(node, parentNode)
  if (children && Array.isArray(children)) {
    for (const childNode of children)
      dfs(childNode, node, handler, scheduler)
  }
}

export class Stack<T> extends Array<T> {
  peek() {
    return this[this.length - 1]
  }

  isEmpty() {
    return this.length === 0
  }

  clear() {
    this.length = 0
  }
}

export function throwError(msg: string, filename: string, line?: number, column?: number): never {
  throw new Error(
    `${msg}\n\t${line != null && column != null && `at line ${line},column ${column}`}\n\tat file ${filename}`,
  )
}

export function checkStack<T extends Stack<any>>(
  stack: T,
  filename: string,
  getLoc: (stack: T) => { line?: number, column?: number },
): never | void {
  if (stack.isEmpty())
    return
  const loc = getLoc(stack)
  throwError('The conditional comment is not closed.', filename, loc.line, loc.column)
}
