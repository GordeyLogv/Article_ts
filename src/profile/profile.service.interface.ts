import { JwtPayloadDto } from '../common/jwt/dto/jwt.payload.dto.js';
import { ProfileUpdateDto } from './dto/profile.update.dto.js';

export interface IProfileService {
    updateProfile: (user: JwtPayloadDto, token: string, dto: ProfileUpdateDto) => Promise<string>;
    deleteProfile: (id: number, token: string) => Promise<boolean>;
    logout: (token: string) => Promise<boolean>;
}
