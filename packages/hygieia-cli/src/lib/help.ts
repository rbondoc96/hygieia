import {bold, lightBlue, reset} from 'kolorist';

import {getHygieiaVersion} from '@/lib/version';

function getFormattedCommandText(command: string, description: string): string {
    const formattedCommand = lightBlue(command);
    const formattedDescription = reset(description);

    return [`  ${formattedCommand}`, `  ${formattedDescription}\n`].join('\n');
}

function getFormattedFlagText(flag: string, description: string): string {
    const formattedFlag = lightBlue(flag);
    const formattedDescription = reset(description);

    return `  ${formattedFlag}` + `  ${formattedDescription}\n`;
}

export function outputHelpInformation(): void {
    const hygieiaVersion = getHygieiaVersion();

    console.log(
        [
            `hygieia: A TypeScript project configuration tool - Version ${hygieiaVersion}`,
            bold('\nCOMMON COMMANDS\n'),
            getFormattedCommandText(
                'hygieia',
                'Starts the CLI tool (and prompts for a project name.)',
            ),
            getFormattedCommandText(
                'hygieia your-project-name',
                'Starts the CLI tool and sets the project name to "your-project-name".',
            ),
            bold('\nCOMMAND LINE FLAGS\n'),
            getFormattedFlagText('--help, -h', 'Print this message.'),
            getFormattedFlagText('--version, -v', "Prints the CLI's version number."),
            getFormattedFlagText(
                '--version-debug',
                "Prints the CLI's version number with system information.",
            ),
        ].join('\n'),
    );
}
