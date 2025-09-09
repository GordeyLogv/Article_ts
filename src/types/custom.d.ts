import { JwtPayloadDto } from '../common/jwt/dto/jwt.payload.dto.js';

declare global {
    namespace Express {
        export interface Request {
            token: string;
            user: JwtPayloadDto;
        }
    }
}
