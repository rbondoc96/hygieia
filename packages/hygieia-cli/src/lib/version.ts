import os from 'node:os';
import {execaCommand} from 'execa';
import getLinuxOS from 'getos';
import osName from 'os-name';

import packageJson from '~/package.json';

async function getLinuxVersion(): Promise<string> {
    return new Promise((resolve, reject) => {
        getLinuxOS((err, os) => {
            if (err !== null) {
                reject(err);
                return;
            }

            if (os.os !== 'linux') {
                reject(os.os);
                return;
            }

            resolve(`${os.dist} ${os.release}`);
        });
    });
}

async function getMacVersion(): Promise<string> {
    const platformAndRelease = osName('darwin', os.release());
    const {stdout: version} = await execaCommand('sw_vers -productVersion');

    return `${platformAndRelease} ${version}`;
}

async function getOSVersion(): Promise<string> {
    switch (os.platform()) {
        case 'darwin':
            return getMacVersion();
        case 'linux':
            return getLinuxVersion();
        default:
            return osName(os.platform(), os.release());
    }
}

export function getHygieiaVersion(): string {
    return packageJson.version;
}

export function outputVersionInformation(): void {
    console.log('Version: ', getHygieiaVersion());
}

export async function outputVersionDebugInformation(): Promise<void> {
    const hygieiaVersion = getHygieiaVersion();
    const nodeVersion = process.versions.node;
    const architecture = os.arch();
    const platform = os.platform();
    const osVersion = await getOSVersion();

    console.log(
        [
            `Hygieia: ${hygieiaVersion}`,
            `Node: ${nodeVersion}`,
            `Architecture: ${architecture}`,
            `Platform: ${platform}`,
            `OS: ${osVersion}`,
        ].join('\n'),
    );
}
