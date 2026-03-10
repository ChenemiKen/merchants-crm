import MerchantService from '../src/services/merchant.service';
import MerchantRepository from '../src/db/repositories/merchant.repository';
import MerchantStatusHistoryService from '../src/services/merchant_status_history.service';
import NotificationService from '../src/services/notification.service';
import { InvalidStateException, NotFoundException } from '../src/constants/exceptions';
import { MerchantStatus } from '../src/models/schemas/merchant.schema';

// Mock dependencies
jest.mock('../src/db/repositories/merchant.repository');
jest.mock('../src/services/merchant_status_history.service');
jest.mock('../src/services/notification.service');

describe('MerchantService - Status Transitions', () => {
    let merchantService: MerchantService;
    let mockMerchantRepository: jest.Mocked<MerchantRepository>;
    let mockMerchantStatusHistoryService: jest.Mocked<MerchantStatusHistoryService>;
    let mockNotificationService: jest.Mocked<NotificationService>;

    const merchantId = 'merchant-123';
    const userId = 'user-456';

    beforeEach(() => {
        jest.clearAllMocks();
        mockMerchantRepository = new MerchantRepository({} as any) as jest.Mocked<MerchantRepository>;
        mockMerchantStatusHistoryService = new MerchantStatusHistoryService({} as any) as jest.Mocked<MerchantStatusHistoryService>;
        mockNotificationService = new NotificationService({} as any, {} as any) as jest.Mocked<NotificationService>;

        merchantService = new MerchantService(
            mockMerchantRepository,
            mockMerchantStatusHistoryService,
            mockNotificationService
        );
    });

    const testTransition = async (oldStatus: MerchantStatus, newStatus: MerchantStatus, shouldPass: boolean) => {
        const merchant = { id: merchantId, status: oldStatus } as any;

        // Mock fetchOne to return the merchant with oldStatus
        jest.spyOn(merchantService, 'fetchOne' as any).mockResolvedValue(merchant);

        if (shouldPass) {
            mockMerchantRepository.update.mockResolvedValue({ ...merchant, status: newStatus });

            const result = await merchantService.updateStatus(merchantId, { status: newStatus, reason: 'Test' }, userId);

            expect(result.status).toBe(newStatus);
            expect(mockMerchantRepository.update).toHaveBeenCalledWith(merchantId, { status: newStatus });
            expect(mockMerchantStatusHistoryService.create).toHaveBeenCalled();
            expect(mockNotificationService.createNotification).toHaveBeenCalled();
        } else {
            await expect(merchantService.updateStatus(merchantId, { status: newStatus, reason: 'Test' }, userId))
                .rejects.toThrow(InvalidStateException);

            expect(mockMerchantRepository.update).not.toHaveBeenCalled();
        }
    };

    describe('Valid Transitions', () => {
        it('should allow PENDING_KYB -> ACTIVE', async () => {
            await testTransition('PENDING_KYB', 'ACTIVE', true);
        });

        it('should allow PENDING_KYB -> SUSPENDED', async () => {
            await testTransition('PENDING_KYB', 'SUSPENDED', true);
        });

        it('should allow ACTIVE -> SUSPENDED', async () => {
            await testTransition('ACTIVE', 'SUSPENDED', true);
        });

        it('should allow SUSPENDED -> ACTIVE', async () => {
            await testTransition('SUSPENDED', 'ACTIVE', true);
        });
    });

    describe('Invalid Transitions', () => {
        it('should NOT allow ACTIVE -> PENDING_KYB', async () => {
            await testTransition('ACTIVE', 'PENDING_KYB', false);
        });

        it('should NOT allow SUSPENDED -> PENDING_KYB', async () => {
            await testTransition('SUSPENDED', 'PENDING_KYB', false);
        });

        it('should NOT allow PENDING_KYB -> PENDING_KYB', async () => {
            await testTransition('PENDING_KYB', 'PENDING_KYB', false);
        });

        it('should NOT allow ACTIVE -> ACTIVE', async () => {
            await testTransition('ACTIVE', 'ACTIVE', false);
        });

        it('should NOT allow SUSPENDED -> SUSPENDED', async () => {
            await testTransition('SUSPENDED', 'SUSPENDED', false);
        });
    });
});
