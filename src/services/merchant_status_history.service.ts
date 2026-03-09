import MerchantStatusHistoryRepository from "@/db/repositories/merchant_status_history.repository";
import { MerchantEntity } from "@/db/schemas/merchant.schema";
import { MerchantStatusHistoryInsert } from "@/db/schemas/merchant_status_history.schema";
import { MerchantHistoryQueryDto, MerchantStatus } from "@/models/schemas/merchant.schema";

export default class MerchantStatusHistoryService {
    private readonly merchantStatusHistoryRepo: MerchantStatusHistoryRepository;

    constructor(merchantStatusHistoryRepo: MerchantStatusHistoryRepository) {
        this.merchantStatusHistoryRepo = merchantStatusHistoryRepo;
    }

    async create(merchant: MerchantEntity, userId: string, oldStatus: MerchantStatus, reason?: string) {
        const record: MerchantStatusHistoryInsert = {
            merchantId: merchant.id,
            oldStatus,
            newStatus: merchant.status!,
            changedBy: userId,
            reason
        }

        return await this.merchantStatusHistoryRepo.create(record);
    }

    async findAllByMerchantId(merchantId: string, query: MerchantHistoryQueryDto) {
        const offset = (query.page - 1) * query.limit;
        const result = await this.merchantStatusHistoryRepo.findByMerchantId(merchantId, query.limit, offset);

        return {
            ...result,
            page: query.page,
            limit: query.limit,
            totalPages: Math.ceil(result.total / query.limit)
        };
    }
}