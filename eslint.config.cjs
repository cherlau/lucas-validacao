// eslint.config.cjs

const vue = require('eslint-plugin-vue')
const vueParser = require('vue-eslint-parser')
const typescriptParser = require('@typescript-eslint/parser')
const eslintConfigPrettier = require('eslint-config-prettier')

module.exports = [
  // Aplica as regras recomendadas do Vue
  ...vue.configs['flat/recommended'],

  // Configuração principal para todos os seus arquivos
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    languageOptions: {
      // Define o parser do Vue como o principal
      parser: vueParser,
      parserOptions: {
        // Diz ao parser do Vue para usar o parser de TypeScript para os blocos <script>
        parser: typescriptParser,
        sourceType: 'module',
        ecmaVersion: 'latest', // 'latest' é mais moderno que '2021'
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        node: 'readonly',
      },
    },
    plugins: {
      // O plugin do vue já está sendo estendido acima
    },
    rules: {
      // Suas regras personalizadas para sobrescrever as recomendadas
      'vue/multi-word-component-names': 'off',
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'vue/require-prop-types': 'off',
    },
  },

  // Desativa regras que conflitam com o Prettier (deve vir por último)
  eslintConfigPrettier,

  // Bloco GLOBAL e SEPARADO para ignorar diretórios
  {
    ignores: [
      'node_modules/',
      '.nuxt/',
      'dist/',
      '**/*.d.ts', // Também é bom ignorar todos os arquivos de declaração de tipos
    ],
  },
]
