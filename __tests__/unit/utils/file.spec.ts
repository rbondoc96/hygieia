import path from 'node:path';

import fs from 'fs-extra';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';

import NoSuchFileOrDirectoryError from '../../../src/errors/NoSuchFileOrDirectoryError';
import PathIsNotAFileError from '../../../src/errors/PathIsNotAFileError';
import * as file from '../../../src/utils/file';
import {createEmptyDir} from '../../helpers/dir';

const TEST_DIR_PATH = path.join(__dirname, 'test');
const TEST_FILE_PATH = path.join(__dirname, 'tmp-test.txt');
const COPY_FILE_PATH = path.join(__dirname, 'tmp-test-copy.txt');

describe('utils/file.ts tests', () => {
    describe('copyFile()', () => {
        beforeEach(() => {
            fs.removeSync(COPY_FILE_PATH);
            fs.removeSync(TEST_DIR_PATH);
            fs.removeSync(TEST_FILE_PATH);
        });

        afterEach(() => {
            fs.removeSync(COPY_FILE_PATH);
            fs.removeSync(TEST_DIR_PATH);
            fs.removeSync(TEST_FILE_PATH);
        });

        test('copies file successfully', () => {
            fs.writeFileSync(TEST_FILE_PATH, 'test');
            file.copyFile(TEST_FILE_PATH, COPY_FILE_PATH);
            expect(fs.existsSync(COPY_FILE_PATH)).toBe(true);
        });

        test('throws an error if the source path is not a file', () => {
            createEmptyDir(TEST_DIR_PATH);

            expect(() => file.copyFile(TEST_DIR_PATH, COPY_FILE_PATH)).toThrowError(
                new PathIsNotAFileError(TEST_DIR_PATH).message,
            );
        });

        test('throws an error if the source file does not exist', () => {
            expect(() => file.copyFile(TEST_DIR_PATH, COPY_FILE_PATH)).toThrowError(
                new NoSuchFileOrDirectoryError(TEST_DIR_PATH).message,
            );
        });
    });

    describe('editFile()', () => {
        beforeEach(() => {
            fs.removeSync(TEST_FILE_PATH);
        });

        afterEach(() => {
            fs.removeSync(TEST_FILE_PATH);
        });

        test('edits file successfully', () => {
            fs.writeFileSync(TEST_FILE_PATH, 'test');
            file.editFile(TEST_FILE_PATH, data => data + 'ing');
            expect(fs.readFileSync(TEST_FILE_PATH).toString()).toBe('testing');
        });

        test('creates file if file does not exist', () => {
            file.editFile(TEST_FILE_PATH, data => data + 'ing');
            expect(fs.readFileSync(TEST_FILE_PATH).toString()).toBe('ing');
        });
    });
});
