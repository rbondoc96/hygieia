export default class PathIsNotAFileError extends Error {
    override readonly name = 'PATH_IS_NOT_A_FILE';
    override readonly message: string;

    constructor(path: string) {
        super();
        this.message = path + ' is not a file.';
    }
}
