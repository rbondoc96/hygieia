import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        exclude: ['**/node_modules/**', '**/dist/**'],
        testTimeout: 10000,
        // node14 often fails with a Segmentation Fault
        threads: !process.versions.node.startsWith('14'),
    },
    esbuild: {
        target: 'node14',
    },
});
