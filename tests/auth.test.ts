import request from 'supertest';
import app from '../src/app';
import { UserRepository } from '../src/db/repositories/user.repository';
import { RefreshTokenRepository } from '../src/db/repositories/refresh_token.repository';
import { Database } from '../src/db/database';

// Mock the dependencies
jest.mock('../src/db/repositories/user.repository');
jest.mock('../src/db/repositories/refresh_token.repository');
jest.mock('../src/db/database');

describe('Auth Flow', () => {
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockRefreshTokenRepository: jest.Mocked<RefreshTokenRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUserRepository = UserRepository.prototype as any;
        mockRefreshTokenRepository = RefreshTokenRepository.prototype as any;
    });

    describe('POST /api/auth/signup', () => {
        const signupData = {
            email: 'test@example.com',
            password: 'Password123!',
            password2: 'Password123!',
            name: 'Test User'
        };

        it('should successfully signup a new user', async () => {
            mockUserRepository.existsByEmail.mockResolvedValue(false);
            mockUserRepository.create.mockResolvedValue({
                id: 'user-123',
                email: signupData.email,
                name: signupData.name,
                password: 'hashed-password',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            });
            mockRefreshTokenRepository.create.mockResolvedValue({
                id: 'token-123',
                userId: 'user-123',
                token: 'token-hash',
                expiresAt: new Date(Date.now() + 10000),
                revokedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            } as any);

            const response = await request(app)
                .post('/api/auth/signup')
                .send(signupData);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data.user.email).toBe(signupData.email);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.headers['set-cookie']).toBeDefined();
        });

        it('should fail if user already exists', async () => {
            mockUserRepository.existsByEmail.mockResolvedValue(true);

            const response = await request(app)
                .post('/api/auth/signup')
                .send(signupData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        const loginData = {
            email: 'test@example.com',
            password: 'Password123!'
        };

        it('should successfully login an existing user', async () => {
            const bcrypt = require('bcrypt');
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

            mockUserRepository.findUserByEmail.mockResolvedValue({
                id: 'user-123',
                email: loginData.email,
                name: 'Test User',
                password: 'hashed-password',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            });
            mockRefreshTokenRepository.create.mockResolvedValue({} as any);

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(response.status).toBe(201);
            expect(response.body.data.user.email).toBe(loginData.email);
            expect(response.body.data).toHaveProperty('accessToken');
        });

        it('should fail with invalid credentials', async () => {
            const bcrypt = require('bcrypt');
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

            mockUserRepository.findUserByEmail.mockResolvedValue({
                id: 'user-123',
                email: loginData.email,
                password: 'hashed-password'
            } as any);

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });

    describe('POST /api/auth/refresh', () => {
        it('should successfully refresh access token', async () => {
            const jwt = require('jsonwebtoken');
            jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user-123' } as any);

            mockRefreshTokenRepository.findByTokenHash.mockResolvedValue({
                id: 'token-123',
                userId: 'user-123',
                token: 'old-token-hash',
                expiresAt: new Date(Date.now() + 10000),
                revokedAt: null,
                user: { id: 'user-123', email: 'test@example.com' }
            } as any);

            mockRefreshTokenRepository.update.mockResolvedValue({} as any);
            mockRefreshTokenRepository.create.mockResolvedValue({} as any);

            const response = await request(app)
                .post('/api/auth/refresh')
                .set('Cookie', ['refresh_token=valid-token']);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('accessToken');
        });

        it('should fail without refresh token', async () => {
            const response = await request(app)
                .post('/api/auth/refresh');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('No refresh token');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should successfully logout', async () => {
            mockRefreshTokenRepository.findByTokenHash.mockResolvedValue({
                id: 'token-123',
                revokedAt: null
            } as any);
            mockRefreshTokenRepository.update.mockResolvedValue({} as any);

            const response = await request(app)
                .post('/api/auth/logout')
                .set('Cookie', ['refresh_token=valid-token']);

            expect(response.status).toBe(200);
            expect(response.headers['set-cookie'][0]).toContain('refresh_token=;');
        });
    });
});
