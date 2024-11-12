import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: '/index.html',
    },
  },
  server:{
    proxy:{
      '/api':{
        target:'https://food-app-backend-green.vercel.app',
        changeOrigin:true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});
