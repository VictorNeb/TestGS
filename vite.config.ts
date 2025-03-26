import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

const WS_HMR_TOKEN = Math.random().toString(36).slice(2);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  define: {
    __WS_TOKEN__: JSON.stringify(WS_HMR_TOKEN)
  },
  server: {
    hmr: {
      clientPort: 443,
      host: 'localhost',
      protocol: 'ws',
      timeout: 5000,
      overlay: true,
      path: '/@vite/client',
      wsToken: WS_HMR_TOKEN
    },
    setupMiddleware: (middleware, server) => {
      // Ensure blog-posts.json exists
      const publicDir = path.resolve(__dirname, 'public');
      const blogPostsPath = path.join(publicDir, 'blog-posts.json');
      
      if (!fs.existsSync(blogPostsPath)) {
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        fs.writeFileSync(blogPostsPath, JSON.stringify({ posts: [] }, null, 2));
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
