import config from "@/config/config";
import { RefreshTokenRepository } from "@/db/repositories/refresh_token.repository";
import { RefreshTokenEntity } from "@/db/schemas/refresh_token.schema";
import { UserEntity } from "@/db/schemas/user.schema";
import { generateAccessToken, generateRefreshToken } from "@/utils/token.util";
import crypto from 'crypto';


export class TokenService {
    constructor(private readonly refreshTokenRepository: RefreshTokenRepository) { };

    async create(userId: string, token: string): Promise<RefreshTokenEntity | undefined> {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + config.REFRESH_TOKEN_EXPIRY_SEC * 1000)
        return this.refreshTokenRepository.create(userId, tokenHash, expiresAt)
    }

    async find(token: string) {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        return this.refreshTokenRepository.findByTokenHash(tokenHash);
    }

    async rotateToken(oldToken: RefreshTokenEntity, user: UserEntity) {
        await this.refreshTokenRepository.update(oldToken.id, {
            revokedAt: new Date()
        });

        const newAccessToken = generateAccessToken(user.id, user.email);
        const newRefreshToken = generateRefreshToken(user.id);
        await this.create(user.id, newRefreshToken);

        return { newAccessToken, newRefreshToken };
    }

    async logout(refreshToken: string) {
        const token = await this.find(refreshToken);
        if (token && !token.revokedAt) {
            await this.refreshTokenRepository.update(token.id, {
                revokedAt: new Date()
            });
        }
    }

}