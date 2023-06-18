import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'fs-extra';

const PROJECT_ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const templatesDir = path.resolve(PROJECT_ROOT, 'templates');

fs.copy(templatesDir, path.resolve(PROJECT_ROOT, 'dist', 'templates'))
    .then(() => console.log('Templates copied successfully.'))
    .catch(error => console.log(error));
