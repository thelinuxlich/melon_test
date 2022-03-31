import { defineConfig } from 'vitest/config'
import path from 'path'
import url from 'url'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(
        path.dirname(url.fileURLToPath(import.meta.url)),
        'packages/server/src/index.js'
      ),
      name: 'Template_JSDOC',
      fileName: format => `${format}.js`,
    },
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    includeSource: ['packages/**/*.{js,ts}'],
    globals: true,
  },
})
