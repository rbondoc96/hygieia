import path from 'node:path';
import {fileURLToPath} from 'node:url';

import fs from 'fs-extra';
import {reset} from 'kolorist';
import minimist from 'minimist';
import prompts from 'prompts';

import OperationCancelledError from '@/errors/OperationCancelledError';
import {outputHelpInformation} from '@/lib/help';
import {outputVersionDebugInformation, outputVersionInformation} from '@/lib/version';
import Messages from '@/messages';
import {copyFile, emptyDir, formatTargetDir, isDirEmpty} from '@/utils';

const Prompts = {
    CheckShouldOverwriteDirectory: {
        key: 'checkShouldOverwriteDirectory',
    },
    ProjectName: {
        key: 'projectName',
        message: reset(Messages.ProjectName),
    },
    ShouldOverwriteDirectory: {
        key: 'shouldOverwriteDirectory',
        message: Messages.ShouldOverwriteDirectory,
    },
    UseRecommendedTSConfig: {
        key: 'useRecommendedTSConfig',
        message: reset(Messages.UseRecommendedTSConfig),
    },
} as const;

type AnswerKey = (typeof Prompts)[keyof typeof Prompts]['key'];

const defaultProjectName = 'my-project';

export default async function main(): Promise<void> {
    // If an argument consists of only numbers, it gets converted to a type of `number`.
    // The options object argument fixes that and prevents the auto-conversion to `number`.
    const argv = minimist(process.argv.slice(2), {
        string: ['_'],
    });

    if (argv.v === true || argv.version === true) {
        outputVersionInformation();
        return;
    }

    if (argv['version-debug'] === true) {
        await outputVersionDebugInformation();
        return;
    }

    if (argv.help === true || argv.h === true) {
        outputHelpInformation();
        return;
    }

    const cwd = process.cwd();

    const projectNameArg = formatTargetDir(argv._[0]);

    let targetProjectName = projectNameArg ?? defaultProjectName;

    let results: prompts.Answers<AnswerKey>;

    try {
        results = await prompts(
            [
                {
                    type: projectNameArg !== undefined ? null : 'text',
                    name: Prompts.ProjectName.key,
                    message: Prompts.ProjectName.message,
                    initial: defaultProjectName,
                    onState: state => {
                        targetProjectName = formatTargetDir(state.value) ?? defaultProjectName;
                    },
                },
                {
                    type: () =>
                        !fs.existsSync(targetProjectName) || isDirEmpty(targetProjectName)
                            ? null
                            : 'confirm',
                    name: Prompts.ShouldOverwriteDirectory.key,
                    message: Prompts.ShouldOverwriteDirectory.message(targetProjectName),
                },
                {
                    type: (_, previousResults) => {
                        if (previousResults[Prompts.ShouldOverwriteDirectory.key] === false) {
                            throw new OperationCancelledError();
                        }
                        return null;
                    },
                    name: Prompts.CheckShouldOverwriteDirectory.key,
                },
                {
                    type: 'confirm',
                    name: Prompts.UseRecommendedTSConfig.key,
                    message: Prompts.UseRecommendedTSConfig.message,
                },
            ],
            {
                onCancel: () => {
                    throw new OperationCancelledError();
                },
            },
        );
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(error);
        }
        return;
    }

    const {
        [Prompts.ShouldOverwriteDirectory.key]: shouldOverwriteDirectory,
        [Prompts.UseRecommendedTSConfig.key]: useRecommendedTSConfig,
    }: {
        [Prompts.ShouldOverwriteDirectory.key]: boolean;
        [Prompts.UseRecommendedTSConfig.key]: boolean;
    } = results;

    const projectRoot = path.join(cwd, targetProjectName);
    const templatesRoot = path.resolve(fileURLToPath(import.meta.url), '../..', 'templates');
    const recommendedTemplatesRoot = path.resolve(templatesRoot, 'recommended');

    if (shouldOverwriteDirectory) {
        emptyDir(projectRoot);
    } else if (!fs.existsSync(projectRoot)) {
        fs.mkdirSync(projectRoot, {
            recursive: true,
        });
    }

    if (useRecommendedTSConfig) {
        copyFile(
            path.join(recommendedTemplatesRoot, 'tsconfig.json'),
            path.join(projectRoot, 'tsconfig.json'),
        );
    }
}
