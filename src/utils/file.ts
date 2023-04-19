import type {BufferEncoding} from 'typescript';
import fs from 'fs';
import {copyDir} from './dir';

export function copyFile(src: string, dest: string) {
    const fileStats = fs.statSync(src);

    if (fileStats.isDirectory()) {
        copyDir(src, dest);
    } else {
        fs.copyFileSync(src, dest);
    }
}

export function editFile(
    file: string,
    callback: (content: string) => string,
    encoding: BufferEncoding = 'utf-8',
) {
    const contents = fs.readFileSync(file, encoding);
    fs.writeFileSync(file, callback(contents), encoding);
}
