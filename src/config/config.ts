import dotenv from 'dotenv';
import { StringValue } from 'ms';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    JWT_SECRET?: string;
    JWT_EXPIRY: StringValue | number;
    REFRESH_TOKEN_SECRET?: string,
    REFRESH_TOKEN_EXPIRY_SEC: number;
    REDIS_HOST: string;
    REDIS_PORT: number;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY as StringValue || "15m",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY_SEC: Number(process.env.REFRESH_TOKEN_EXPIRY_SEC) || 3 * 24 * 60 * 60 * 1000,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
};

export default config;