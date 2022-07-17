import { defineConfig } from 'vite'
import tsconfig from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfig()],
  build: {
    lib: {
      entry: 'lib/index.ts',
      formats: ['es'],
    },
  },
})
