import { conditionalDefinition } from '../src/utils'
import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const vueCoreCode = fs.readFileSync(path.resolve(__dirname, './test-code/vue/core.vue'), 'utf-8')
const vueClosedCode = fs.readFileSync(path.resolve(__dirname, './test-code/vue/closed.vue'), 'utf-8')
const vueScopeCode = fs.readFileSync(path.resolve(__dirname, './test-code/vue/scope.vue'), 'utf-8')
const styleCoreCode = fs.readFileSync(path.resolve(__dirname, './test-code/style/core.scss'), 'utf-8')
const styleCloseCode = fs.readFileSync(path.resolve(__dirname, './test-code/style/closed.scss'), 'utf-8')
const styleScopeCode = fs.readFileSync(path.resolve(__dirname, './test-code/style/scope.scss'), 'utf-8')
const htmlCode = fs.readFileSync(path.resolve(__dirname, './test-code/html/core.html'), 'utf-8')

describe('test conditionalDefinition', () => {
  it('test core', () => {
    const code = `
        // #ifdef MOBILE
        const a = 1
        // #endif
    `
    const code1 = `
        // #ifdef MOBILE | LABTOP
        const a = 1
        // #endif
    `
    const code2 = `
        // #ifdef MOBILE | ELECTRON
        const a = 1
        // #endif
    `
    const code3 = `
        // #ifndef MOBILE
        const a = 1
        // #endif
    `
    const code4 = `
        const list = [1,2
            // #ifndef MOBILE
            ,3
            // #endif
        ]
        const b = 4
        const c = 5
    `
    const code5 = `
        // #ifdef MOBILE
        const obj = {
            a:1,
            b:2,
            c:{
                // #ifdef LABTOP
                d:3,
                e:4,
                // #endif
                f:5
            },
            g:[6,7,8],
            f:function(){
                // #ifdef LABTOP
                const a = 9
                // #endif
                return 10
            }
        }
        // #endif
    `
    const env = ['MOBILE']
    const env1 = ['LABTOP']
    expect(conditionalDefinition(code, 'test.js', env).code).toContain('const a = 1')
    expect(conditionalDefinition(code, 'test.js', env1).code).toBe('')
    expect(conditionalDefinition(code1, 'test.js', env).code).toContain('const a = 1')
    expect(conditionalDefinition(code1, 'test.js', env1).code).toContain('const a = 1')
    expect(conditionalDefinition(code2, 'test.js', env).code).toContain('const a = 1')
    expect(conditionalDefinition(code2, 'test.js', env1).code).toBe('')
    expect(conditionalDefinition(code3, 'test.js', env).code).toBe('')
    expect(conditionalDefinition(code3, 'test.js', env1).code).toContain('const a = 1')
    expect(conditionalDefinition(code4, 'test.js', env).code).not.toContain('3')
    expect(conditionalDefinition(code5, 'test.js', env).code).not.toContain('3')
    expect(conditionalDefinition(code5, 'test.js', env).code).toContain('5')
    expect(conditionalDefinition(code5, 'test.js', env).code).not.toContain('const a = 1')
    expect(conditionalDefinition(code5, 'test.js', env).code).toContain('return 10')
    expect(conditionalDefinition(vueCoreCode, 'test.vue', env).code).not.toContain('console.log(data)')
    expect(conditionalDefinition(vueCoreCode, 'test.vue', env).code).toContain(
      '<span>voluptatum quis facilis accusantium? Saepe nostrum atque laboriosam quisquam.</span>',
    )
    expect(conditionalDefinition(vueCoreCode, 'test.vue', env).code).not.toContain('height: 100px')
    expect(conditionalDefinition(styleCoreCode, 'test.css', env).code).not.toContain(
      'font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;',
    )
    expect(conditionalDefinition(styleCoreCode, 'test.css', env).code).not.toContain('a {')
  })
  it('test legality', () => {
    const code = `
        // #ifdef mobile
        const a = 1
        // #endif
    `
    const code1 = `
        // #ifdef MOBILE
        const a = 1
        // #endif
    `
    const env = ['MOBILE']
    const env1 = ['LAPTOP']
    const env2 = ['mobile']
    const env3 = ['laptop']
    expect(() => conditionalDefinition(code, 'test.js', env)).toThrowError("doesn't follow variable naming conventions")
    expect(() => conditionalDefinition(code, 'test.js', env1)).toThrowError(
      "doesn't follow variable naming conventions",
    )
    expect(() => conditionalDefinition(code, 'test.js', env2)).toThrowError(
      "doesn't follow variable naming conventions",
    )
    expect(() => conditionalDefinition(code, 'test.js', env3)).toThrowError(
      "doesn't follow variable naming conventions",
    )
    expect(() => conditionalDefinition(code1, 'test.js', env)).not.toThrowError()
    expect(conditionalDefinition(code, 'test.js', env, 'transform').code).toContain('const a = 1')
    expect(conditionalDefinition(code, 'test.js', env, 'ignore').code).toBe('')
  })
  it('test closed', () => {
    const code = `
        // #ifdef MOBILE
        const a = 1
    `
    const code1 = `
        const a = 1
        // #endif
    `
    const code2 = `
        // #ifdef MOBILE
        const a = 1
        // #endif
    `
    const code3 = `
        // #ifdef MOBILE
        // #ifdef LABTOP
        const a = 1
        // #endif
    `
    const code4 = `
        // #ifdef MOBILE
        const a = 1
        // #endif
        // #endif
    `
    const env = ['MOBILE']
    expect(() => conditionalDefinition(code, 'test.js', env)).toThrowError('not closed')
    expect(() => conditionalDefinition(code, 'test.js', env)).toThrowError('line 2,column 8')
    expect(() => conditionalDefinition(code1, 'test.js', env)).toThrowError('not closed')
    expect(() => conditionalDefinition(code1, 'test.js', env)).toThrowError('line 3,column 8')
    expect(() => conditionalDefinition(code2, 'test.js', env)).not.toThrowError()
    expect(conditionalDefinition(code2, 'test.js', env).code).toContain('const a = 1')
    expect(() => conditionalDefinition(code3, 'test.js', env)).toThrowError('not closed')
    expect(() => conditionalDefinition(code3, 'test.js', env)).toThrowError('line 2,column 8')
    expect(() => conditionalDefinition(code4, 'test.js', env)).toThrowError('not closed')
    expect(() => conditionalDefinition(code4, 'test.js', env)).toThrowError('line 5,column 8')
    expect(() => conditionalDefinition(vueClosedCode, 'test.vue', env)).toThrowError('not closed')
    expect(() => conditionalDefinition(vueClosedCode, 'test.vue', env)).toThrowError('line 51,column 5')
    expect(() => conditionalDefinition(styleCloseCode, 'test.scss', env)).toThrowError('not closed')
    expect(() => conditionalDefinition(styleCloseCode, 'test.scss', env)).toThrowError('line 2,column 3')
    expect(() => conditionalDefinition(htmlCode, 'test.html', env)).toThrowError('not closed')
    expect(() => conditionalDefinition(htmlCode, 'test.html', env)).toThrowError('line 31,column 7')
  })
  it('test scope', () => {
    const code = `
        // #ifdef MOBILE
        function fn(){

        }
        // #endif
    `
    const code1 = `
        // #ifdef MOBILE
        function fn(){
            // #endif
        }
    `
    const code2 = `
        function fn(){
            // #ifdef MOBILE
        }
        // #endif
    `
    const code3 = `
        // #ifdef MOBILE
        function fn3(){
            function fn2(){
                function fn(){
                    // #endif
                }
            }
        }
    `
    const env = ['ELECTRON']
    expect(conditionalDefinition(code, 'test.js', env).code).toBe('')
    expect(() => conditionalDefinition(code1, 'test.js', env)).toThrowError('in the same scope')
    expect(() => conditionalDefinition(code2, 'test.js', env)).toThrowError('in the same scope')
    expect(() => conditionalDefinition(code3, 'test.js', env)).toThrowError('in the same scope')
    expect(() => conditionalDefinition(vueScopeCode, 'test.vue', env)).toThrowError('in the same scope')
    expect(() => conditionalDefinition(vueScopeCode, 'test.vue', env)).toThrowError('line 30,column 9')
    expect(() => conditionalDefinition(styleScopeCode, 'test.scss', env)).toThrowError('in the same scope')
    expect(() => conditionalDefinition(styleScopeCode, 'test.scss', env)).toThrowError('line 8,column 3')
  })
  it('integrative test', () => {
    const code = `
    function hello(name) {
        // aaa
        // #ifdef A
        const a = 1
        const b = 2
        // #endif
        // 注释1
        // #ifdef LABTOP | MOBILE
        // 注释2
        const c = 3
        // #endif
        // 注释3
        // 注释4
        // bbb
        const d = 4
        // 注释5
        // #ifndef ELECTRON | B
        const e = 5
        const f = 6
        // #endif
        return a + b
    }

    var arr=[1,2,3,
        /* bbb */
        4,
        5]
    
    const temp=<div>
    {/* #ifdef A */}
    <p>a</p>
    {/* #endif */}
    {/* #ifdef B */}
    <i></i>
    {/* #endif */}
    </div>;

    // #ifdef A
    (function(){
    })();
    // #endif

    const obj={}
    obj.fn=function(){
        const m=0
        // #ifdef A
        const innerFn = function(){
        return 'c'
        // #endif
        }
        return 'nn'
    }

    debugger;

    obj.fn(()=>1)
    `
    const env = ['B']
    expect(() => conditionalDefinition(code, 'test.jsx', env)).toThrowError('in the same scope')
    expect(() => conditionalDefinition(code, 'test.jsx', env)).toThrowError('line 48,column 14')
  })
})
