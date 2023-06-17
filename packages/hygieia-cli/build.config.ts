import path from 'node:path';

import {defineBuildConfig} from 'unbuild';

export default defineBuildConfig({
    alias: {
        '@': path.resolve(__dirname, 'src'),
    },
    clean: true,
    declaration: true,
    entries: ['src/index'],
    outDir: 'dist',
    rollup: {
        inlineDependencies: true,
        esbuild: {
            minify: true,
        },
    },
});
