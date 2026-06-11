import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      include: /\.(js|jsx)$/,
    }),
    {
      name: 'serve-images',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith('/images/')) {
            const fileName = req.url.substring('/images/'.length).split('?')[0];
            const filePath = path.join(__dirname, 'images', decodeURIComponent(fileName));
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', getMimeType(filePath));
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      }
    }
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

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}
