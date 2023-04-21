import fs from 'fs-extra';

export function createFile(name: string, content?: string) {
    fs.writeFileSync(name, content ?? 'test');
}
