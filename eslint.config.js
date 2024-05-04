import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    'antfu/top-level-function': 'off',
    'node/prefer-global/process': 'off',
    'no-cond-assign': 'off',
    'unused-imports/no-unused-vars': 'off',
  },
})
