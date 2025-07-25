import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src/client'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/socket.io': {
                target: 'http://localhost:9001', // Updated port
                ws: true,
            },
            '/data': {
                target: 'http://localhost:9001', // Updated port
            },
            '/img': {
                target: 'http://localhost:9001', // Updated port
            },
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'public/index.html'),
                bigscreen: resolve(__dirname, 'public/bigscreen.html'),
                infoscreen: resolve(__dirname, 'public/infoscreen.html'),
                control: resolve(__dirname, 'public/control.html'),
            },
        },
    },
});