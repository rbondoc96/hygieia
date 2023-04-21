import {red} from 'kolorist';

export default class OperationCancelledError extends Error {
    override readonly name = 'OPERATION_CANCELLED';
    override readonly message: string;

    constructor() {
        super();
        this.message = red('x') + ' Operation cancelled.';
    }
}
