export class HttpError extends Error {
    public statusCode: number;
    public contex?: string;
    public details?: unknown;

    constructor(statusCode: number, message: string, contex?: string, details?: unknown) {
        super(message);

        this.statusCode = statusCode;
        this.contex = contex;
        this.details = details;

        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
