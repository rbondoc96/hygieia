import fs from 'fs';
import {reset} from 'kolorist';
import minimist from 'minimist';
import path from 'path';
import prompts from 'prompts';
import {fileURLToPath} from 'url';
import {copyFile, emptyDir, formatTargetDir, isDirEmpty} from './utils';
import OperationCancelledError from './errors/OperationCancelledError';

const Prompts = {
    CheckShouldOverwriteDirectory: {
        key: 'checkShouldOverwriteDirectory',
    },
    ProjectName: {
        key: 'projectName',
        message: reset('Project name:'),
    },
    ShouldOverwriteDirectory: {
        key: 'shouldOverwriteDirectory',
        message: (targetDir: string) =>
            (targetDir === '.'
                ? 'Current directory'
                : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
    },
    UseRecommendedTSConfig: {
        key: 'useRecommendedTSConfig',
        message: reset(
            'Install recommended a tsconfig.json file with recommended settings?',
        ),
    },
} as const;

type AnswerKey = (typeof Prompts)[keyof typeof Prompts]['key'];

const defaultProjectName = 'my-project';

export default async function main() {
    // If an argument consists of only numbers, it gets converted to a type of `number`.
    // The options object argument fixes that and prevents the auto-conversion to `number`.
    const argv = minimist(process.argv.slice(2), {
        string: ['_'],
    });

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
                        targetProjectName =
                            formatTargetDir(state.value) ?? defaultProjectName;
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
                        if (
                            previousResults[Prompts.ShouldOverwriteDirectory.key] ===
                            false
                        ) {
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
    const templatesRoot = path.resolve(
        fileURLToPath(import.meta.url),
        '../..',
        'templates',
    );
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
