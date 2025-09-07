export class HttpError extends Error {
    public statusCode: number;
    public contex?: string;

    constructor(statusCode: number, message: string, contex?: string) {
        super(message);

        this.statusCode = statusCode;
        this.contex = contex;

        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
