import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/fireflies': {
        target: 'https://api.fireflies.ai/graphql',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fireflies/, ''),
        secure: true,
        timeout: 60000,
        proxyTimeout: 120000,
        // ✅ CORREÇÃO: Headers adicionais para melhor compatibilidade
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // ✅ CORREÇÃO: Garantir headers corretos
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
            
            // ✅ CORREÇÃO: Log para debug
            console.log('🔄 Proxying request to Fireflies:', {
              method: req.method,
              url: req.url,
              headers: proxyReq.getHeaders()
            });
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // ✅ CORREÇÃO: Adicionar CORP header para resolver bloqueio COEP
            proxyRes.headers['Cross-Origin-Resource-Policy'] = 'cross-origin';
            
            // ✅ CORREÇÃO: Log da resposta para debug
            console.log('📡 Fireflies response:', {
              status: proxyRes.statusCode,
              headers: proxyRes.headers,
              corpHeader: proxyRes.headers['Cross-Origin-Resource-Policy']
            });
          });
          
          proxy.on('error', (err, req, res) => {
            // ✅ CORREÇÃO: Log de erros
            console.error('❌ Proxy error:', err);
          });
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});