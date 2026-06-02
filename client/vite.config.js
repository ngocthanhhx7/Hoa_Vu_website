/* global process */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiTarget = process.env.VITE_PROXY_TARGET || 'http://localhost:9999';
const buildId = process.env.VITE_HOAVU_BUILD_ID || `${Date.now().toString(36)}`;

function buildVersionPlugin() {
  return {
    name: 'hoavu-build-version',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: `${JSON.stringify({
          version: buildId,
          builtAt: new Date().toISOString(),
        }, null, 2)}\n`,
      });
    },
  };
}

export default defineConfig({
  define: {
    'import.meta.env.VITE_HOAVU_BUILD_ID': JSON.stringify(buildId),
  },
  plugins: [react(), buildVersionPlugin()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': apiTarget,
      '/uploads': apiTarget,
    },
  },
});
