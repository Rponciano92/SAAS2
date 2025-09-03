// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/fireflies": {
        target: "https://api.fireflies.ai/graphql",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api\/fireflies/, ""),
        secure: true,
        timeout: 6e4,
        proxyTimeout: 12e4,
        // ✅ CORREÇÃO: Headers adicionais para melhor compatibilidade
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            proxyReq.setHeader("Accept", "application/json");
            proxyReq.setHeader("Content-Type", "application/json");
            console.log("\u{1F504} Proxying request to Fireflies:", {
              method: req.method,
              url: req.url,
              headers: proxyReq.getHeaders()
            });
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            proxyRes.headers["Cross-Origin-Resource-Policy"] = "cross-origin";
            console.log("\u{1F4E1} Fireflies response:", {
              status: proxyRes.statusCode,
              headers: proxyRes.headers,
              corpHeader: proxyRes.headers["Cross-Origin-Resource-Policy"]
            });
          });
          proxy.on("error", (err, req, res) => {
            console.error("\u274C Proxy error:", err);
          });
        }
      }
    },
    "/api/aethersaas": {
      target: "http://72.60.52.39:8000",
      changeOrigin: true,
      rewrite: (path2) => path2.replace(/^\/api\/aethersaas/, ""),
      secure: false,
      timeout: 6e4,
      configure: (proxy, options) => {
        proxy.on("proxyReq", (proxyReq, req, res) => {
          console.log("\u{1F504} Proxying AetherSaaS request:", {
            method: req.method,
            url: req.url
          });
        });
        proxy.on("proxyRes", (proxyRes, req, res) => {
          proxyRes.headers["Access-Control-Allow-Origin"] = "*";
          proxyRes.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
          proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
        });
        proxy.on("error", (err, req, res) => {
          console.error("\u274C AetherSaaS proxy error:", err);
        });
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpL2ZpcmVmbGllcyc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9hcGkuZmlyZWZsaWVzLmFpL2dyYXBocWwnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGlcXC9maXJlZmxpZXMvLCAnJyksXG4gICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgdGltZW91dDogNjAwMDAsXG4gICAgICAgIHByb3h5VGltZW91dDogMTIwMDAwLFxuICAgICAgICAvLyBcdTI3MDUgQ09SUkVcdTAwQzdcdTAwQzNPOiBIZWFkZXJzIGFkaWNpb25haXMgcGFyYSBtZWxob3IgY29tcGF0aWJpbGlkYWRlXG4gICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgLy8gXHUyNzA1IENPUlJFXHUwMEM3XHUwMEMzTzogR2FyYW50aXIgaGVhZGVycyBjb3JyZXRvc1xuICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdTI3MDUgQ09SUkVcdTAwQzdcdTAwQzNPOiBMb2cgcGFyYSBkZWJ1Z1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1x1RDgzRFx1REQwNCBQcm94eWluZyByZXF1ZXN0IHRvIEZpcmVmbGllczonLCB7XG4gICAgICAgICAgICAgIG1ldGhvZDogcmVxLm1ldGhvZCxcbiAgICAgICAgICAgICAgdXJsOiByZXEudXJsLFxuICAgICAgICAgICAgICBoZWFkZXJzOiBwcm94eVJlcS5nZXRIZWFkZXJzKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCByZXMpID0+IHtcbiAgICAgICAgICAgIC8vIFx1MjcwNSBDT1JSRVx1MDBDN1x1MDBDM086IEFkaWNpb25hciBDT1JQIGhlYWRlciBwYXJhIHJlc29sdmVyIGJsb3F1ZWlvIENPRVBcbiAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ0Nyb3NzLU9yaWdpbi1SZXNvdXJjZS1Qb2xpY3knXSA9ICdjcm9zcy1vcmlnaW4nO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdTI3MDUgQ09SUkVcdTAwQzdcdTAwQzNPOiBMb2cgZGEgcmVzcG9zdGEgcGFyYSBkZWJ1Z1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1x1RDgzRFx1RENFMSBGaXJlZmxpZXMgcmVzcG9uc2U6Jywge1xuICAgICAgICAgICAgICBzdGF0dXM6IHByb3h5UmVzLnN0YXR1c0NvZGUsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHByb3h5UmVzLmhlYWRlcnMsXG4gICAgICAgICAgICAgIGNvcnBIZWFkZXI6IHByb3h5UmVzLmhlYWRlcnNbJ0Nyb3NzLU9yaWdpbi1SZXNvdXJjZS1Qb2xpY3knXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgcmVxLCByZXMpID0+IHtcbiAgICAgICAgICAgIC8vIFx1MjcwNSBDT1JSRVx1MDBDN1x1MDBDM086IExvZyBkZSBlcnJvc1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignXHUyNzRDIFByb3h5IGVycm9yOicsIGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgICcvYXBpL2FldGhlcnNhYXMnOiB7XG4gICAgICB0YXJnZXQ6ICdodHRwOi8vNzIuNjAuNTIuMzk6ODAwMCcsXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpXFwvYWV0aGVyc2Fhcy8sICcnKSxcbiAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICB0aW1lb3V0OiA2MDAwMCxcbiAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBvcHRpb25zKSA9PiB7XG4gICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcScsIChwcm94eVJlcSwgcmVxLCByZXMpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnXHVEODNEXHVERDA0IFByb3h5aW5nIEFldGhlclNhYVMgcmVxdWVzdDonLCB7XG4gICAgICAgICAgICBtZXRob2Q6IHJlcS5tZXRob2QsXG4gICAgICAgICAgICB1cmw6IHJlcS51cmxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSwgcmVzKSA9PiB7XG4gICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJ10gPSAnKic7XG4gICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyddID0gJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIE9QVElPTlMnO1xuICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSA9ICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24nO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIHJlcSwgcmVzKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignXHUyNzRDIEFldGhlclNhYVMgcHJveHkgZXJyb3I6JywgZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsa0JBQWtCO0FBQUEsUUFDaEIsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEscUJBQXFCLEVBQUU7QUFBQSxRQUN2RCxRQUFRO0FBQUEsUUFDUixTQUFTO0FBQUEsUUFDVCxjQUFjO0FBQUE7QUFBQSxRQUVkLFdBQVcsQ0FBQyxPQUFPLFlBQVk7QUFDN0IsZ0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFFBQVE7QUFFM0MscUJBQVMsVUFBVSxVQUFVLGtCQUFrQjtBQUMvQyxxQkFBUyxVQUFVLGdCQUFnQixrQkFBa0I7QUFHckQsb0JBQVEsSUFBSSw0Q0FBcUM7QUFBQSxjQUMvQyxRQUFRLElBQUk7QUFBQSxjQUNaLEtBQUssSUFBSTtBQUFBLGNBQ1QsU0FBUyxTQUFTLFdBQVc7QUFBQSxZQUMvQixDQUFDO0FBQUEsVUFDSCxDQUFDO0FBRUQsZ0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFFBQVE7QUFFM0MscUJBQVMsUUFBUSw4QkFBOEIsSUFBSTtBQUduRCxvQkFBUSxJQUFJLGlDQUEwQjtBQUFBLGNBQ3BDLFFBQVEsU0FBUztBQUFBLGNBQ2pCLFNBQVMsU0FBUztBQUFBLGNBQ2xCLFlBQVksU0FBUyxRQUFRLDhCQUE4QjtBQUFBLFlBQzdELENBQUM7QUFBQSxVQUNILENBQUM7QUFFRCxnQkFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEtBQUssUUFBUTtBQUVuQyxvQkFBUSxNQUFNLHVCQUFrQixHQUFHO0FBQUEsVUFDckMsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsbUJBQW1CO0FBQUEsTUFDakIsUUFBUTtBQUFBLE1BQ1IsY0FBYztBQUFBLE1BQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsc0JBQXNCLEVBQUU7QUFBQSxNQUN4RCxRQUFRO0FBQUEsTUFDUixTQUFTO0FBQUEsTUFDVCxXQUFXLENBQUMsT0FBTyxZQUFZO0FBQzdCLGNBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFFBQVE7QUFDM0Msa0JBQVEsSUFBSSwwQ0FBbUM7QUFBQSxZQUM3QyxRQUFRLElBQUk7QUFBQSxZQUNaLEtBQUssSUFBSTtBQUFBLFVBQ1gsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELGNBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFFBQVE7QUFDM0MsbUJBQVMsUUFBUSw2QkFBNkIsSUFBSTtBQUNsRCxtQkFBUyxRQUFRLDhCQUE4QixJQUFJO0FBQ25ELG1CQUFTLFFBQVEsOEJBQThCLElBQUk7QUFBQSxRQUNyRCxDQUFDO0FBRUQsY0FBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEtBQUssUUFBUTtBQUNuQyxrQkFBUSxNQUFNLGtDQUE2QixHQUFHO0FBQUEsUUFDaEQsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
