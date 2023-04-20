import fs from 'fs-extra';
import path from 'path';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import PathIsNotAFileError from '../../../src/errors/PathIsNotAFileError';
import * as file from '../../../src/utils/file';

const TEST_DIR = 'tmp';
const TEST_FILE = 'tmp-test.txt';

function createEmptyDir(dir?: string) {
    fs.mkdirpSync(dir ?? TEST_DIR);
}

describe('utils/file.ts tests', () => {
    describe('copyFile()', () => {
        const TEST_FILE_COPY = 'tmp-test-copy.txt';

        beforeEach(() => {
            fs.removeSync(path.join(__dirname, TEST_FILE));
            fs.removeSync(path.join(__dirname, TEST_FILE_COPY));
        });

        afterEach(() => {
            fs.removeSync(path.join(__dirname, TEST_FILE));
            fs.removeSync(path.join(__dirname, TEST_FILE_COPY));
        });

        test('copies file successfully', () => {
            const filePath = path.join(__dirname, TEST_FILE);
            fs.writeFileSync(filePath, 'test');
            file.copyFile(filePath, path.join(__dirname, TEST_FILE_COPY));
            expect(fs.existsSync(path.join(__dirname, TEST_FILE_COPY))).toBe(true);
        });

        test('throws an error if the source path is not a file', () => {
            createEmptyDir(TEST_DIR);

            expect(() => file.copyFile(TEST_DIR, TEST_FILE_COPY)).toThrowError(
                new PathIsNotAFileError(TEST_DIR).message,
            );
        });
    });

    describe('editFile()', () => {
        beforeEach(() => {
            fs.removeSync(path.join(__dirname, TEST_FILE));
        });

        afterEach(() => {
            fs.removeSync(path.join(__dirname, TEST_FILE));
        });

        test('edits file successfully', () => {
            const filePath = path.join(__dirname, TEST_FILE);
            fs.writeFileSync(filePath, 'test');
            file.editFile(filePath, data => data + 'ing');
            expect(fs.readFileSync(filePath).toString()).toBe('testing');
        });

        test('creates file if file does not exist', () => {
            const filePath = path.join(__dirname, TEST_FILE);
            file.editFile(filePath, data => data + 'ing');
            expect(fs.readFileSync(filePath).toString()).toBe('testing');
        });
    });
});
