import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        react()
    ],
    test: {
        environment: 'jsdom',
        include: ['**/*.test.ts', '**/*.test.tsx'],
        setupFiles: ['./vitest-setup.ts'],
    },
});