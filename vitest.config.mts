import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        react()
    ],
    test: {
        globalSetup: './vitest-global-setup.ts',
        environment: 'jsdom',
        alias: {
            'server-only': path.resolve(__dirname, './test/dummy-server-only.ts'),
        },
        include: ['**/*.test.ts', '**/*.test.tsx'],
        setupFiles: ['./vitest-setup.ts'],
    },
});