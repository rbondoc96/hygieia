import fs from 'fs-extra';
import path from 'path';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import PathIsNotADirectoryError from '../../../src/errors/PathIsNotADirectoryError';
import * as dir from '../../../src/utils/dir';

const TEST_FILE = 'tmp-test';
const TEST_DIR = 'tmp';

function createEmptyDir(dir?: string) {
    fs.mkdirpSync(dir ?? TEST_DIR);
}

function createEmptyNestedDirs(dirs: string[]) {
    if (dirs.length < 2) {
        throw new Error('At least two directories are required.');
    }

    fs.mkdirpSync(path.join(...dirs));
}

function createFile(name?: string) {
    fs.writeFileSync(name ?? TEST_FILE, 'test');
}

function createNonEmptyDir(
    options: {
        count?: number;
        dir?: string;
        files?: string[];
    } = {},
) {
    const tempDir = options.dir ?? TEST_DIR;
    fs.mkdirpSync(tempDir);

    if (options.files !== undefined && options.files.length > 0) {
        for (const file of options.files) {
            const dummyFile = path.join(tempDir, file);
            fs.writeFileSync(dummyFile, 'test');
        }
    } else {
        for (let i = 0; i < Math.max(options.count ?? 1, 1); i++) {
            const dummyFile = path.join(tempDir, `text-${i}.txt`);
            fs.writeFileSync(dummyFile, 'test');
        }
    }
}

function createNonEmptyNestedDirs(
    options: Array<{
        dir: string;
        files: string[];
    }>,
) {
    if (options.length < 2) {
        throw new Error('At least two directories are required.');
    }

    let root = '';
    for (const option of options) {
        const currentDir = path.join(root, option.dir);
        fs.mkdirpSync(currentDir);

        for (const file of option.files) {
            fs.writeFileSync(path.join(currentDir, file), 'test');
        }

        root = currentDir;
    }
}

describe('utils/dir.ts tests', () => {
    describe('isDirEmpty()', () => {
        beforeEach(() => {
            fs.removeSync(TEST_DIR);
            fs.removeSync(TEST_FILE);
        });

        afterEach(() => {
            fs.removeSync(TEST_DIR);
            fs.removeSync(TEST_FILE);
        });

        test('returns true if given directory does not exist', () => {
            expect(dir.isDirEmpty('non-existent-directory')).toBe(true);
        });

        test('throws PathIsNotADirectoryError if the given path is not a directory', () => {
            createFile(TEST_FILE);
            expect(() => dir.isDirEmpty(TEST_FILE)).toThrowError(
                new PathIsNotADirectoryError(TEST_FILE).message,
            );
        });

        test('returns true if given directory exists and is empty', () => {
            createEmptyDir(TEST_DIR);
            expect(dir.isDirEmpty(TEST_DIR)).toBe(true);
        });

        test('returns true if the given directory exists, but only has a .git folder', () => {
            createEmptyDir(TEST_DIR);
            createFile(path.join(TEST_DIR, '.git'));
            expect(dir.isDirEmpty(TEST_DIR)).toBe(true);
        });
    });

    describe('emptyDir()', () => {
        beforeEach(() => {
            fs.removeSync(TEST_DIR);
        });

        afterEach(() => {
            fs.removeSync(TEST_DIR);
        });

        test('empties a flat directory with no files', () => {
            createEmptyDir(TEST_DIR);
            dir.emptyDir(TEST_DIR);
            expect(fs.readdirSync(TEST_DIR)).toEqual([]);
        });

        test('empties a flat directory with files', () => {
            createNonEmptyDir({
                dir: TEST_DIR,
            });
            dir.emptyDir(TEST_DIR);
            expect(fs.readdirSync(TEST_DIR)).toEqual([]);
        });

        test('ignores .git in a flat directory', () => {
            createNonEmptyDir({
                dir: TEST_DIR,
                files: ['.git', 'test.txt'],
            });
            dir.emptyDir(TEST_DIR);
            expect(fs.readdirSync(TEST_DIR)).toEqual(['.git']);
        });

        test('empties a directory with nested directories with no files', () => {
            createEmptyNestedDirs([TEST_DIR, 'nested-1', 'nested-2']);
            dir.emptyDir(TEST_DIR);
            expect(fs.readdirSync(TEST_DIR)).toEqual([]);
        });

        test('empties a directory with nested directories with files', () => {
            createNonEmptyNestedDirs([
                {
                    dir: TEST_DIR,
                    files: ['test.txt'],
                },
                {
                    dir: 'nested-1',
                    files: ['test.txt'],
                },
            ]);
            dir.emptyDir(TEST_DIR);
            expect(fs.readdirSync(TEST_DIR)).toEqual([]);
        });

        test('ignores .git in root directory when deleting nested directories', () => {
            createNonEmptyNestedDirs([
                {
                    dir: TEST_DIR,
                    files: ['.git', 'test.txt'],
                },
                {
                    dir: 'nested-1',
                    files: ['test.txt'],
                },
            ]);
            dir.emptyDir(TEST_DIR);
            expect(fs.readdirSync(TEST_DIR)).toEqual(['.git']);
        });

        test('return successfully if the given directory does not exist', () => {
            dir.emptyDir(TEST_DIR);
        });
    });

    describe('copyDir()', () => {
        const TEST_DEST_DIR = 'tmp-copy';

        beforeEach(() => {
            fs.removeSync(TEST_DIR);
            fs.removeSync(TEST_DEST_DIR);
        });

        afterEach(() => {
            fs.removeSync(TEST_DIR);
            fs.removeSync(TEST_DEST_DIR);
        });

        test('copies all files in source directory', () => {
            createNonEmptyDir({
                dir: TEST_DIR,
                count: 2,
            });

            dir.copyDir(TEST_DIR, TEST_DEST_DIR);

            const filesInSrc = fs.readdirSync(TEST_DIR);
            const filesInDest = fs.readdirSync(TEST_DEST_DIR);
            expect(filesInDest).toEqual(filesInSrc);
        });
    });
});
