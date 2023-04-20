import type {BufferEncoding} from 'typescript';
import fs from 'fs';
import PathIsNotAFileError from '../errors/PathIsNotAFileError';

export function copyFile(src: string, dest: string) {
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
) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, 'test');
    }

    const contents = fs.readFileSync(file, encoding);
    fs.writeFileSync(file, callback(contents), encoding);
}
