import fs from 'fs-extra';
import type {BufferEncoding} from 'typescript';

import NoSuchFileOrDirectoryError from '../errors/NoSuchFileOrDirectoryError';
import PathIsNotAFileError from '../errors/PathIsNotAFileError';

export function copyFile(src: string, dest: string): void {
    if (!fs.existsSync(src)) {
        throw new NoSuchFileOrDirectoryError(src);
    }

    const srcFileStats = fs.statSync(src);

    if (!srcFileStats.isFile()) {
        throw new PathIsNotAFileError(src);
    }

    fs.copyFileSync(src, dest);
}

export function editFile(
    file: string,
    callback: (content: string) => string,
    encoding: BufferEncoding = 'utf-8',
): void {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, callback(''), encoding);
        return;
    }

    const contents = fs.readFileSync(file, encoding);
    fs.writeFileSync(file, callback(contents), encoding);
}
