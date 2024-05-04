import type { NodePath } from '@babel/traverse'
import type * as t from '@babel/types'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import generator, { type GeneratorResult } from '@babel/generator'
import { ConditionalDefinitionImpl, type Options, type TransformOptions } from '../types'
import {
  Stack,
  binarySearch,
  checkStack,
  isConditionalEndStatement,
  isConditionalStartStatement,
  isCurrentEvironment,
  throwError,
} from './core'

class ConditionalDefinition extends ConditionalDefinitionImpl<t.Comment, NodePath> {
  protected stack = new Stack<t.Comment>()
  env: string[] = []
  protected scope: [number, number][] = []
  protected id: string
  protected mode: Options['mode']
  protected startOffset: number
  protected startLine: number
  protected startColumn: number
  constructor(id: string, env: string[], opts: Omit<TransformOptions, 'sourceMaps'>) {
    super()
    this.id = id
    this.env = env
    this.mode = opts.mode
    this.startOffset = opts.startOffset ?? 0
    this.startLine = opts.startLine ?? 0
    this.startColumn = opts.startColumn ?? 0
  }

  initScope(comments: t.Comment[] = []) {
    let currentCommentType
    for (let i = 0, len = comments.length; i < len; i++) {
      const comment = comments[i]
      currentCommentType && currentCommentType !== comment.type && this.checkStack()
      currentCommentType = comment.type
      if (isConditionalStartStatement(comment.value)) {
        this.stack.push(comment)
      }
      else if (isConditionalEndStatement(comment.value)) {
        const lc = this.stack.pop()
        if (!lc)
          this.throwError('The conditional comment is not closed.', comment.loc)
        if (!isCurrentEvironment(lc.value, this.env, this.mode) && lc.end && comment.start)
          this.scope.push([lc.end, comment.start])
      }
    }
    this.checkStack()
  }

  tryRemove(path: NodePath) {
    if (!path.node || !this.scope.length)
      return
    const { start: pStart, end: pEnd } = path.node
    if (!pStart || !pEnd)
      return
    const index = binarySearch(
      this.scope,
      [pStart, pEnd],
      (target, item) => item[0] > target[1],
      (target, item) => item[1] < target[0],
    )
    if (index > this.scope.length - 1 || index < 0)
      return
    const [start, end] = this.scope[index]
    const { start: scopeStart, end: scopeEnd } = path.scope.block
    if (this.shouldThrowError(path, start, end, pStart, pEnd, scopeStart, scopeEnd)) {
      this.throwError(
        'The current path cannot be removed correctly. Make sure that the conditional comments are closed and that the same pair of comments are in the same scope.',
        path.node.loc,
      )
    }
    if (pStart >= start && pEnd <= end)
      path.remove()
  }

  protected shouldThrowError(
    path: NodePath,
    start: number,
    end: number,
    pStart: number,
    pEnd: number,
    scopeStart: Nullable<number>,
    scopeEnd: Nullable<number>,
  ) {
    if (
      path.isIdentifier()
      && path.parentPath?.isVariableDeclarator()
      && path.parent.start != null
      && path.parent.end != null
    )
      return path.parent.start > start && path.parent.end > end

    return (
      scopeStart != null
      && scopeEnd != null
      && ((start > scopeStart && end > scopeEnd && start < scopeEnd)
      || (start < scopeStart && end < scopeEnd && end > scopeStart))
    )
  }

  protected checkStack() {
    checkStack(this.stack, this.id, (stack) => {
      const c = stack.peek()
      const line = c.loc?.start.line ? c.loc?.start.line + this.startLine : void 0
      const column = c.loc?.start.column ? c.loc?.start.column + this.startColumn : void 0
      return {
        line,
        column,
      }
    })
  }

  protected throwError(msg: string, loc?: t.SourceLocation | null): never {
    const line = loc?.start.line ? loc.start.line + this.startLine : void 0
    const column = loc?.start.column ? loc.start.column + this.startColumn : void 0
    throwError(msg, this.id, line, column)
  }

  clear() {
    this.stack.clear()
    this.scope.length = 0
  }
}

/**
 * @description: Conditional compilation function
 * @param {string} code
 * @param {string} id
 * @param {string} env env variable
 * @param {TransformOptions} opts
 * @return {GeneratorResult}
 */
export function transformScript(code: string, id: string, env: string[], opts: TransformOptions): GeneratorResult {
  const ast = parser.parse(code, {
    plugins: ['jsx', ['typescript', {}]],
    sourceType: 'unambiguous',
  })

  const cc = new ConditionalDefinition(id, env, opts)

  const traverser: typeof traverse = (traverse as any).default ? (traverse as any).default : traverse
  traverser(ast, {
    enter(path) {
      if (path.isProgram()) {
        const { comments } = path.parent as t.File
        comments && cc.initScope(comments)
      }
      else {
        cc.tryRemove(path)
      }
    },
  })

  const mergedGenerator: typeof generator = (generator as any).default ?? generator
  return mergedGenerator(
    ast,
    {
      sourceMaps: opts.sourceMaps,
      filename: id,
      retainLines: true,
    },
    code,
  )
}
