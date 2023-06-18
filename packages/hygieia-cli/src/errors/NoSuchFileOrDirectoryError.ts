export default class NoSuchFileOrDirectoryError extends Error {
    override readonly name: string = 'NO_SUCH_FILE_OR_DIRECTORY';
    override readonly message: string;

    constructor(path: string) {
        super();
        this.message = `${path} does not exist.`;
    }
}
