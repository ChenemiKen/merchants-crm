import request from 'supertest';
import app from '../src/app';
import MerchantRepository from '../src/db/repositories/merchant.repository';
import MerchantStatusHistoryRepository from '../src/db/repositories/merchant_status_history.repository';
import NotificationRepository from '../src/db/repositories/notification.repository';
import NotificationSubscriberRepository from '../src/db/repositories/notification_subscribers.repository';
import NotificationService from '../src/services/notification.service';
import { Database } from '../src/db/database';
import jwt from 'jsonwebtoken';
import config from '../src/config/config';

// Mock the dependencies
jest.mock('../src/db/repositories/merchant.repository');
jest.mock('../src/db/repositories/merchant_status_history.repository');
jest.mock('../src/db/repositories/notification.repository');
jest.mock('../src/db/repositories/notification_subscribers.repository');
jest.mock('../src/services/notification.service');
jest.mock('../src/db/database');
jest.mock('jsonwebtoken');

describe('Merchant Management Flow', () => {
    let mockMerchantRepository: jest.Mocked<MerchantRepository>;
    let mockMerchantStatusHistoryRepository: jest.Mocked<MerchantStatusHistoryRepository>;
    let mockNotificationService: jest.Mocked<NotificationService>;

    const merchantId = '550e8400-e29b-41d4-a716-446655440000'; // UUID format
    const userId = 'user-123';
    const authToken = 'valid-token';

    beforeEach(() => {
        jest.clearAllMocks();
        mockMerchantRepository = MerchantRepository.prototype as any;
        mockMerchantStatusHistoryRepository = MerchantStatusHistoryRepository.prototype as any;
        mockNotificationService = NotificationService.prototype as any;

        // Mock auth middleware
        (jwt.verify as jest.Mock).mockReturnValue({ userId, email: 'admin@example.com' });
    });

    describe('POST /api/merchants', () => {
        const merchantData = {
            name: 'Test Merchant',
            category: 'Retail',
            city: 'New York',
            contactEmail: 'test@merchant.com'
        };

        it('should successfully create a new merchant', async () => {
            mockMerchantRepository.create.mockResolvedValue({
                id: merchantId,
                ...merchantData,
                status: 'PENDING_KYB',
                createdAt: new Date(),
                updatedAt: new Date()
            } as any);

            const response = await request(app)
                .post('/api/merchants')
                .set('Authorization', `Bearer ${authToken}`)
                .send(merchantData);

            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe(merchantData.name);
            expect(response.body.data.status).toBe('PENDING_KYB');
        });
    });

    describe('GET /api/merchants', () => {
        it('should return a list of merchants', async () => {
            mockMerchantRepository.fetchAll.mockResolvedValue({
                data: [],
                meta: {
                    total: 0,
                    page: 1,
                    limit: 20,
                    totalPages: 0
                }
            });

            const response = await request(app)
                .get('/api/merchants')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('data');
            expect(Array.isArray(response.body.data.data)).toBe(true);
        });
    });

    describe('GET /api/merchants/:id', () => {
        it('should fetch a single merchant by id', async () => {
            mockMerchantRepository.fetchOne.mockResolvedValue({
                id: merchantId,
                name: 'Test Merchant',
                status: 'ACTIVE'
            } as any);

            const response = await request(app)
                .get(`/api/merchants/${merchantId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(merchantId);
        });

        it('should return 400 for invalid UUID', async () => {
            const response = await request(app)
                .get('/api/merchants/invalid-id')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid merchant Id');
        });
    });

    describe('PATCH /api/merchants/:id', () => {
        it('should successfully update merchant details', async () => {
            mockMerchantRepository.fetchOne.mockResolvedValue({ id: merchantId } as any);
            mockMerchantRepository.update.mockResolvedValue({
                id: merchantId,
                name: 'Updated Name'
            } as any);

            const response = await request(app)
                .patch(`/api/merchants/${merchantId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Updated Name' });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Updated Name');
        });
    });

    describe('PATCH /api/merchants/:id/status', () => {
        it('should successfully update merchant status and log history', async () => {
            mockMerchantRepository.fetchOne.mockResolvedValue({
                id: merchantId,
                status: 'PENDING_KYB'
            } as any);
            mockMerchantRepository.update.mockResolvedValue({
                id: merchantId,
                status: 'ACTIVE'
            } as any);
            mockMerchantStatusHistoryRepository.create.mockResolvedValue({} as any);

            const response = await request(app)
                .patch(`/api/merchants/${merchantId}/status`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ status: 'ACTIVE', reason: 'KYB Verified' });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe('ACTIVE');
            expect(mockMerchantRepository.update).toHaveBeenCalledWith(merchantId, { status: 'ACTIVE' });
        });

        it('should fail on invalid transition', async () => {
            mockMerchantRepository.fetchOne.mockResolvedValue({
                id: merchantId,
                status: 'ACTIVE'
            } as any);

            const response = await request(app)
                .patch(`/api/merchants/${merchantId}/status`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ status: 'PENDING_KYB', reason: 'Rollback' });

            expect(response.status).toBe(400); // InvalidStateException returns 400
            expect(response.body.message).toContain('Invalid status transition');
        });
    });

    describe('GET /api/merchants/:id/history', () => {
        it('should fetch status history for a merchant', async () => {
            mockMerchantStatusHistoryRepository.findByMerchantId.mockResolvedValue({
                data: [],
                total: 0
            });

            const response = await request(app)
                .get(`/api/merchants/${merchantId}/history`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('data');
        });
    });
});
