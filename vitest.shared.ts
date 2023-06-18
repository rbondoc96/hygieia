import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'c8',
        },
        exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/helpers/**'],
        include: ['**/__tests__/**/*.spec.ts'],
        testTimeout: 20000,
    },
});
