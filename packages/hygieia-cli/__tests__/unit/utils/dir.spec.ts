import path from 'node:path';
import fs from 'fs-extra';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';

import {
    createEmptyDir,
    createEmptyNestedDirs,
    createFile,
    createNonEmptyDir,
    createNonEmptyNestedDirs,
} from '!/helpers';

import NoSuchFileOrDirectoryError from '@/errors/NoSuchFileOrDirectoryError';
import PathIsNotADirectoryError from '@/errors/PathIsNotADirectoryError';
import * as dir from '@/utils/dir';

const TEST_DEST_DIR_PATH = path.join(__dirname, 'test-dest-dir');
const TEST_DIR_PATH = path.join(__dirname, 'test-dir');
const TEST_FILE_PATH = path.join(__dirname, 'test-file');

describe('utils/dir.ts tests', () => {
    describe('isDirEmpty()', () => {
        beforeEach(() => {
            fs.removeSync(TEST_DIR_PATH);
            fs.removeSync(TEST_FILE_PATH);
        });

        afterEach(() => {
            fs.removeSync(TEST_DIR_PATH);
            fs.removeSync(TEST_FILE_PATH);
        });

        test('returns true if given directory does not exist', () => {
            expect(dir.isDirEmpty('non-existent-directory')).toBe(true);
        });

        test('throws PathIsNotADirectoryError if the given path is not a directory', () => {
            createFile(TEST_FILE_PATH);
            expect(() => dir.isDirEmpty(TEST_FILE_PATH)).toThrowError(
                new PathIsNotADirectoryError(TEST_FILE_PATH).message,
            );
        });

        test('returns true if given directory exists and is empty', () => {
            createEmptyDir(TEST_DIR_PATH);
            expect(dir.isDirEmpty(TEST_DIR_PATH)).toBe(true);
        });

        test('returns true if the given directory exists, but only has a .git folder', () => {
            createEmptyDir(TEST_DIR_PATH);
            createFile(path.join(TEST_DIR_PATH, '.git'));
            expect(dir.isDirEmpty(TEST_DIR_PATH)).toBe(true);
        });
    });

    describe('emptyDir()', () => {
        beforeEach(() => {
            fs.removeSync(TEST_DIR_PATH);
        });

        afterEach(() => {
            fs.removeSync(TEST_DIR_PATH);
        });

        test('empties a flat directory with no files', () => {
            createEmptyDir(TEST_DIR_PATH);
            dir.emptyDir(TEST_DIR_PATH);
            expect(fs.readdirSync(TEST_DIR_PATH)).toEqual([]);
        });

        test('empties a flat directory with files', () => {
            createNonEmptyDir(TEST_DIR_PATH);
            dir.emptyDir(TEST_DIR_PATH);
            expect(fs.readdirSync(TEST_DIR_PATH)).toEqual([]);
        });

        test('ignores .git in a flat directory', () => {
            createNonEmptyDir(TEST_DIR_PATH, {
                files: ['.git', 'test.txt'],
            });
            dir.emptyDir(TEST_DIR_PATH);
            expect(fs.readdirSync(TEST_DIR_PATH)).toEqual(['.git']);
        });

        test('empties a directory with nested directories with no files', () => {
            createEmptyNestedDirs([TEST_DIR_PATH, 'nested-1', 'nested-2']);
            dir.emptyDir(TEST_DIR_PATH);
            expect(fs.readdirSync(TEST_DIR_PATH)).toEqual([]);
        });

        test('empties a directory with nested directories with files', () => {
            createNonEmptyNestedDirs([
                {
                    dir: TEST_DIR_PATH,
                    files: ['test.txt'],
                },
                {
                    dir: 'nested-1',
                    files: ['test.txt'],
                },
            ]);
            dir.emptyDir(TEST_DIR_PATH);
            expect(fs.readdirSync(TEST_DIR_PATH)).toEqual([]);
        });

        test('ignores .git in root directory when deleting nested directories', () => {
            createNonEmptyNestedDirs([
                {
                    dir: TEST_DIR_PATH,
                    files: ['.git', 'test.txt'],
                },
                {
                    dir: 'nested-1',
                    files: ['test.txt'],
                },
            ]);
            dir.emptyDir(TEST_DIR_PATH);
            expect(fs.readdirSync(TEST_DIR_PATH)).toEqual(['.git']);
        });

        test('return successfully if the given directory does not exist', () => {
            dir.emptyDir(TEST_DIR_PATH);
        });

        test('throws an error if the source path does not exist', () => {
            expect(() => dir.copyDir(TEST_DIR_PATH, TEST_DEST_DIR_PATH)).toThrowError(
                new NoSuchFileOrDirectoryError(TEST_DIR_PATH).message,
            );
        });
    });

    describe('copyDir()', () => {
        beforeEach(() => {
            fs.removeSync(TEST_DIR_PATH);
            fs.removeSync(TEST_DEST_DIR_PATH);
        });

        afterEach(() => {
            fs.removeSync(TEST_DIR_PATH);
            fs.removeSync(TEST_DEST_DIR_PATH);
        });

        test('copies all files in source directory', () => {
            createNonEmptyDir(TEST_DIR_PATH, {
                count: 2,
            });

            dir.copyDir(TEST_DIR_PATH, TEST_DEST_DIR_PATH);

            const filesInSrc = fs.readdirSync(TEST_DIR_PATH);
            const filesInDest = fs.readdirSync(TEST_DEST_DIR_PATH);
            expect(filesInDest).toEqual(filesInSrc);
        });
    });
});
