export interface IConfigService {
    get: (key: string) => string;

    readonly port: number;
    readonly host: string;

    readonly salt: number;
    readonly access_token_secret: string;
    readonly expiresInSecond: number;

    readonly dbPort: number;
    readonly dbHost: string;
    readonly dbUser: string;
    readonly dbPassword: string;
    readonly dbDatabase: string;
}
