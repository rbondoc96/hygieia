import {defineConfig, mergeConfig} from 'vitest/config';

import sharedConfig from '../../vitest.shared';

export default mergeConfig(
    sharedConfig,
    defineConfig({
        test: {
            alias: {
                '~/': new URL('./', import.meta.url).pathname,
                '@/': new URL('./src/', import.meta.url).pathname,
                '!/': new URL('./__tests__/', import.meta.url).pathname,
            },
        },
        esbuild: {
            target: 'node16',
        },
    }),
);
