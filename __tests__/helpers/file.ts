import fs from 'fs-extra';

export function createFile(name: string, content?: string): void {
    fs.writeFileSync(name, content ?? 'test');
}
