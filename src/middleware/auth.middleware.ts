import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from '@/constants/exceptions';
import config from '@/config/config';

interface AuthPayload {
    userId: string;
    email: string;
}

export function auth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || '';
    const [scheme, tokenFromHeader] = authHeader.split(' ');
    const tokenFromCookie = req.cookies.access_token;

    const token = scheme === 'Bearer' && tokenFromHeader ? tokenFromHeader : tokenFromCookie;

    if (!token) {
        throw new UnauthorizedException('Missing or invalid auth token');
    }

    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET!) as AuthPayload;
        req.user = { id: decodedToken.userId, email: decodedToken.email };
        next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            throw new UnauthorizedException('Access token expired');
        }
        throw new UnauthorizedException('Invalid token');
    }
}