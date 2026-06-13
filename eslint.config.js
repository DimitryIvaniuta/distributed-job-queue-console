import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['dist','coverage','playwright-report','test-results','public','docker','eslint.config.js'] },
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  { files: ['src/**/*.ts','src/**/*.tsx','e2e/**/*.ts','vite.config.ts','playwright.config.ts','vitest.setup.ts'], languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } }, rules: { '@typescript-eslint/no-floating-promises': 'error', '@typescript-eslint/no-misused-promises': 'error', '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }], '@typescript-eslint/no-confusing-void-expression': 'off', '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }] } },
  { files: ['src/**/*.test.ts','src/**/*.test.tsx'], rules: { '@typescript-eslint/unbound-method': 'off' } }
);
