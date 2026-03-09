import jwt, { Secret } from 'jsonwebtoken';
import { Response } from 'express';
import config from '@/config/config';


export function generateAccessToken(userId: string, email: string,
    role = "operator"): string {
    if (config.JWT_SECRET) {
        const token = jwt.sign(
            { userId, email, role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRY }
        );
        return token;
    }
    throw new Error('JWT_SECRET is undefined');
};

export function generateRefreshToken(userId: string): string {
    if (config.REFRESH_TOKEN_SECRET) {
        const token = jwt.sign(
            { userId },
            config.REFRESH_TOKEN_SECRET,
            { expiresIn: config.REFRESH_TOKEN_EXPIRY_SEC }
        );
        return token;
    }
    throw new Error('JWT_SECRET is undefined');
};

export function setRefreshCookie(res: Response, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        path: '/api/auth/refresh',
        maxAge: config.REFRESH_TOKEN_EXPIRY_SEC
    });
}