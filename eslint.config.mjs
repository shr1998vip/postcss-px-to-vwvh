import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
      }
    },

    rules: {
      // JS 通用规则
      semi: 0, // 末尾不用分号
      'no-cond-assign': 2,
      'key-spacing': [2, { beforeColon: false, afterColon: true }],
      'comma-spacing': 2,
      indent: [2, 2, { SwitchCase: 1 }],
      quotes: [2, 'single', { allowTemplateLiterals: true }],
      'no-unused-vars': 0,
      'no-debugger': 0,
      'no-unreachable': 0
    }
  },
])