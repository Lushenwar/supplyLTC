import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Images and the order template are served as static assets from public/.
// supply.js is a plain .js file that contains JSX, so esbuild is told to treat it as JSX.
export default defineConfig({
  plugins: [
    react({
      include: /\.(js|jsx)$/,
    }),
  ],
  esbuild: {
    loader: 'jsx',
    include: [
      /supply\.js/,
      /src\/.*\.js/,
      /src\/.*\.jsx/
    ],
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  }
})
