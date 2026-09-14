import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Providers, shadcn/ui primitives and a few shared helpers deliberately export hooks or
      // constants next to their components; fast refresh just reloads those files in full
      'react-refresh/only-export-components': [
        'error',
        {
          allowConstantExport: true,
          allowExportNames: [
            'useEvent',
            'useGuest',
            'useTheme',
            'useWedding',
            'useHeader',
            'useFormField',
            'useSidebar',
            'badgeVariants',
            'buttonVariants',
            'tabsListVariants',
            'getSideBadgeStyles',
            'formatSide',
          ],
        },
      ],
    },
  },
])
