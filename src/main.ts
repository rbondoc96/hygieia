import minimist from 'minimist';
import path from 'path';
import prompts from 'prompts';
import {fileURLToPath} from 'url';
import {formatTargetDir} from '@/utils';
import OperationCancelledError from '@/errors/OperationCancelledError';

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

    let results;

    try {
        results = await prompts(
            [
                {
                    type: projectNameArg !== undefined ? null : 'text',
                    name: 'projectName',
                    message: 'Project name:',
                    initial: defaultProjectName,
                    onState: state => {
                        targetProjectName =
                            formatTargetDir(state.value) ?? defaultProjectName;
                    },
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

    console.log(results);

    const projectRoot = path.join(cwd, targetProjectName);

    console.log(projectRoot);

    console.log(path.resolve(fileURLToPath(import.meta.url), '../..', 'templates'));
}
