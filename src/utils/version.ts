import os from 'node:os';

import {execaCommandSync} from 'execa';
import osName from 'os-name';

import packageJson from '../../package.json';

export function outputVersionInformation(): void {
    const cliVersion = packageJson.version;
    const nodeVersion = process.versions.node;
    const architecture = os.arch();
    const platform = os.platform();
    let osString = osName(platform, os.release());

    if (platform === 'darwin') {
        const {stdout: darwinVersion} = execaCommandSync('sw_vers -productVersion');
        osString += ' ' + darwinVersion;
    }

    console.log(
        [
            `Hygieia: ${cliVersion}`,
            `Node: ${nodeVersion}`,
            `Architecture: ${architecture}`,
            `OS: ${osString}`,
        ].join('\n'),
    );
}
