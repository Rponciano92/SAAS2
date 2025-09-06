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
      },
      '/api': {
        target: 'http://72.60.52.39:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api/aethersaas': {
        target: 'http://72.60.52.39:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/aethersaas/, ''),
        secure: false,
        timeout: 60000,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Proxying AetherSaaS request:', {
              method: req.method,
              url: req.url
            });
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
          });
          
          proxy.on('error', (err, req, res) => {
            console.error('❌ AetherSaaS proxy error:', err);
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