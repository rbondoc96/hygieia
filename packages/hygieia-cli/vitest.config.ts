import {defineProject} from 'vitest/config';

export default defineProject({
    test: {
        alias: {
            '@/': new URL('./src/', import.meta.url).pathname,
            '!/': new URL('./__tests__/', import.meta.url).pathname,
        },
        include: ['**/__tests__/**/*.spec.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/helpers/**'],
        testTimeout: 20000,
    },
    esbuild: {
        target: 'node16',
    },
});
