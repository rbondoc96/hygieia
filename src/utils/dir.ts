import path from 'node:path';

import fs from 'fs-extra';

import NoSuchFileOrDirectoryError from '../errors/NoSuchFileOrDirectoryError';
import PathIsNotADirectoryError from '../errors/PathIsNotADirectoryError';

export function copyDir(srcDir: string, destDir: string): void {
    if (!fs.existsSync(srcDir)) {
        throw new NoSuchFileOrDirectoryError(srcDir);
    }

    fs.mkdirSync(destDir, {recursive: true});

    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        fs.copyFileSync(srcFile, destFile);
    }
}

export function emptyDir(dir: string): void {
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

export function isDirEmpty(path: string): boolean {
    if (!fs.existsSync(path)) {
        return true;
    }

    if (!fs.lstatSync(path).isDirectory()) {
        throw new PathIsNotADirectoryError(path);
    }

    const files = fs.readdirSync(path);
    return files.length === 0 || (files.length === 1 && files[0] === '.git');
}
