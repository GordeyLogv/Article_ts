export interface IJwtRepository {
    isTokenBlackListed: (token: string) => Promise<boolean>;
    addTokenToBlackList: (token: string) => Promise<boolean>;
}
