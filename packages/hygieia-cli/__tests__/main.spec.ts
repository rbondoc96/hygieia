import path from 'node:path';
import type {ExecaSyncReturnValue, SyncOptions} from 'execa';
import {execaCommandSync} from 'execa';
import fs from 'fs-extra';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';

import Messages from '@/messages';

const CLI_RUNNER = import.meta.env.VITE_TEST_BUILD === '1' ? 'node' : 'tsx';

const CLI_PATH =
    import.meta.env.VITE_TEST_BUILD === '1'
        ? path.join(__dirname, '..')
        : path.resolve(__dirname, '../src/index.ts');

const TEST_PROJECT_NAME = 'test-project';

function createEmptyDir(dir?: string) {
    const tempDir = dir ?? TEST_PROJECT_NAME;
    fs.mkdirpSync(tempDir);
}

function createNonEmptyDir(dir?: string) {
    const tempDir = dir ?? TEST_PROJECT_NAME;
    fs.mkdirpSync(tempDir);

    const dummyFile = path.join(tempDir, 'text.txt');
    fs.writeFileSync(dummyFile, 'test');
}

function run(args: string[], options: SyncOptions = {}): ExecaSyncReturnValue {
    const argsAsString = args.join(' ');
    return execaCommandSync(`${CLI_RUNNER} ${CLI_PATH} ${argsAsString}`, options);
}

describe('CLI', () => {
    beforeEach(() => {
        fs.removeSync(TEST_PROJECT_NAME);
    });

    afterEach(() => {
        fs.removeSync(TEST_PROJECT_NAME);
    });

    test('prompts for project name is none is given', () => {
        const {stdout} = run([]);
        expect(stdout).toContain(Messages.ProjectName);
    });

    test('does not prompt for project name is one is given', () => {
        const {stdout} = run([TEST_PROJECT_NAME]);
        expect(stdout).not.toContain(Messages.ProjectName);
        expect(stdout).toContain(Messages.UseRecommendedTSConfig);
    });

    test('prompts to clear directory if it already exists and contains a file', () => {
        createNonEmptyDir(TEST_PROJECT_NAME);
        const {stdout} = run([TEST_PROJECT_NAME]);
        expect(stdout).toContain(Messages.ShouldOverwriteDirectory(TEST_PROJECT_NAME));
    });

    test('prompts to clear current directory', () => {
        const {stdout} = run(['.']);
        expect(stdout).toContain(Messages.ShouldOverwriteDirectory('.'));
    });

    test('does not prompt to clear directory if it already exists and is empty', async () => {
        createEmptyDir(TEST_PROJECT_NAME);
        const {stdout} = run([TEST_PROJECT_NAME]);
        expect(stdout).not.toContain(Messages.ShouldOverwriteDirectory(TEST_PROJECT_NAME));
    });

    test('creates a `tsconfig.json` file from templates/recommended', () => {
        run([TEST_PROJECT_NAME], {
            input: 'y',
        });

        const files = fs.readdirSync(TEST_PROJECT_NAME);

        expect(files.length).toEqual(1);
        expect(files[0]).toEqual('tsconfig.json');
    });
});
