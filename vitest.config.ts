import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'c8',
            reportsDirectory: './__tests__/coverage',
        },
        exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/helpers/**'],
        testTimeout: 10000,
        // node14 often fails with a Segmentation Fault
        threads: !process.versions.node.startsWith('14'),
    },
    esbuild: {
        target: 'node14',
    },
});
