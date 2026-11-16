module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    // Override specific rules if needed
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: [
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
  ],
};