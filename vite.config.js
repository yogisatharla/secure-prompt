import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    assetsInclude: ['**/*.glb'],
    server: {
        host: '0.0.0.0',
        port: 3000
    },
    build: {
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
                        return 'three-vendor';
                    }
                    if (id.includes('node_modules/lucide-react')) {
                        return 'lucide-vendor';
                    }
                }
            }
        }
    }
});
