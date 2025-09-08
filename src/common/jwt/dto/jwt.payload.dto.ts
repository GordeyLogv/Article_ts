import { PersonRole } from '../../../authorization/common/enums/roles.enum.js';
import { IJwtPayload } from '../common/jwtPayload.interface.js';

export class JwtPayloadDto {
    public readonly id: number;
    public readonly email: string;
    public readonly role: PersonRole;
    public readonly nickname: string;
    public readonly age: number;
    public readonly createdAt: Date;
    public readonly iat: number = Math.floor(Date.now() / 1000);
    public readonly exp: number;

    constructor(data: IJwtPayload, expiresInSecond: number) {
        this.id = data.id;
        this.email = data.email;
        this.role = data.role;
        this.nickname = data.nickname;
        this.age = data.age;
        this.createdAt = data.createdAt;
        this.exp = this.iat + expiresInSecond;
    }

    public getPayload() {
        const { id, email, role, nickname, age, createdAt, iat, exp } = this;
        return { id, email, role, nickname, age, createdAt, iat, exp };
    }
}
