/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_TEST_BUILD?: '1' | '0';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
