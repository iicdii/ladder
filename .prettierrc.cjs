module.exports = {
  printWidth: 100,
  trailingComma: 'all', // 기본값
  tabWidth: 2, // 기본값
  semi: false,
  singleQuote: true,
  bracketSpacing: true, // 기본값. true인 경우 {foo:bar}는 { foo: bar }로 변환됨
  arrowParens: 'always', // 기본값
  useTabs: false, // 기본값
  importOrder: [
    '^react$',
    '^next',
    '<THIRD_PARTY_MODULES>',
    '^@[a-z]+/(.*)$',
    '^@/(.*)$',
    '^[./]',
    '^(.*).css$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: false,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
}