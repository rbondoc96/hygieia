import path from 'node:path';
import fs from 'fs-extra';

export function createEmptyDir(dir: string): void {
    fs.mkdirpSync(dir);
}

export function createEmptyNestedDirs(dirs: string[]): void {
    if (dirs.length < 2) {
        throw new Error('At least two directories are required.');
    }

    fs.mkdirpSync(path.join(...dirs));
}

export function createNonEmptyDir(
    dir: string,
    options: {
        count?: number;
        files?: string[] | Array<{name: string; content: string}>;
    } = {
        count: 1,
    },
): void {
    if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
        if (fs.readdirSync(dir).length > 0) {
            return;
        }
    } else if (fs.existsSync(dir) && fs.lstatSync(dir).isFile()) {
        throw new Error(`Path ${dir} already exists and is a file.`);
    }

    fs.mkdirpSync(dir);

    if (options.files !== undefined && options.files.length > 0) {
        for (const file of options.files) {
            if (typeof file === 'object') {
                fs.writeFileSync(path.join(dir, file.name), file.content);
            } else {
                fs.writeFileSync(path.join(dir, file), 'test');
            }
        }
    } else {
        for (let i = 0; i < Math.max(options.count ?? 1, 1); i++) {
            fs.writeFileSync(path.join(dir, `text-${i}.txt`), 'test');
        }
    }
}

export function createNonEmptyNestedDirs(
    options: Array<{
        dir: string;
        files: string[] | Array<{name: string; content: string}>;
    }>,
): void {
    if (options.length < 2) {
        throw new Error('At least two directories are required.');
    }

    let root = '';
    for (const option of options) {
        const currentDir = path.join(root, option.dir);
        fs.mkdirpSync(currentDir);

        for (const file of option.files) {
            if (typeof file === 'object') {
                fs.writeFileSync(path.join(currentDir, file.name), file.content);
            } else {
                fs.writeFileSync(path.join(currentDir, file), 'test');
            }
        }

        root = currentDir;
    }
}
