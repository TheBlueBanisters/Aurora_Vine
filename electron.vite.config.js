import { defineConfig } from 'electron-vite'
import { resolve } from 'path'
import { createReadStream, existsSync, statSync } from 'fs'

const mimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp' }
function getMimeType(ext) {
  return mimeTypes[ext.toLowerCase()] || 'application/octet-stream'
}

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve(__dirname, 'main.js')
      },
      outDir: 'out/main'
    }
  },
  preload: {
    build: {
      lib: {
        entry: resolve(__dirname, 'preload.js')
      },
      outDir: 'out/preload'
    }
  },
  renderer: {
    root: 'renderer',
    build: {
      outDir: 'out/renderer',
      rollupOptions: {
        input: resolve(__dirname, 'renderer/index.html')
      },
      emptyOutDir: true
    },
    server: {
      fs: { allow: ['..'] }
    },
    plugins: [
      {
        name: 'serve-image',
        configureServer(server) {
          const path = require('path')
          server.middlewares.use('/image', (req, res, next) => {
            const filePath = path.join(__dirname, 'image', req.url)
            if (existsSync(filePath) && statSync(filePath).isFile()) {
              res.setHeader('Content-Type', getMimeType(path.extname(filePath)))
              createReadStream(filePath).pipe(res)
            } else {
              next()
            }
          })
        }
      }
    ]
  }
})
