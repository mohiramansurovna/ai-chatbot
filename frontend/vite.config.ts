import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
            routesDirectory: './src/app/routes',
            generatedRouteTree: './src/app/routeTree.gen.ts',
        }),
        react(),
        tailwindcss(),
        babel({ presets: [reactCompilerPreset()] }),
    ],
    resolve: { alias: { '@': import.meta.dirname + '/src' } },
});
