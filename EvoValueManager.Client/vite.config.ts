import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import Mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), Mkcert()],
  server: {
    https: true, 
    port: 7090,
    proxy: {
        '/api': {
            target: 'http://localhost:5163',
            changeOrigin: true,
            secure: false
        }
    }
  }
})
