import fs from 'fs';
import path from 'path';
import PathIsNotADirectoryError from '../errors/PathIsNotADirectoryError';
import {copyFile} from './file';

export function copyDir(srcDir: string, destDir: string) {
    fs.mkdirSync(destDir, {recursive: true});

    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        copyFile(srcFile, destFile);
    }
}

export function emptyDir(dir: string) {
    if (!fs.existsSync(dir)) {
        return;
    }

    for (const folder of fs.readdirSync(dir)) {
        if (folder === '.git') {
            continue;
        }
        fs.rmSync(path.resolve(dir, folder), {
            recursive: true,
            force: true,
        });
    }
}

export function isDirEmpty(path: string) {
    if (!fs.existsSync(path)) {
        return true;
    }

    if (!fs.lstatSync(path).isDirectory()) {
        throw new PathIsNotADirectoryError(path);
    }

    const files = fs.readdirSync(path);
    return files.length === 0 || (files.length === 1 && files[0] === '.git');
}
