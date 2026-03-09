import { InvalidStateException, NotFoundException } from "@/constants/exceptions";
import MerchantRepository from "@/db/repositories/merchant.repository";
import {
    CreateMerchantDto, MerchantQueryDto, MerchantStatus,
    UpdateMerchantDto, UpdateMerchantStatusDto
} from "@/models/schemas/merchant.schema";


const transitions: Record<MerchantStatus, MerchantStatus[]> = {
    PENDING_KYB: ["ACTIVE", "SUSPENDED"],
    ACTIVE: ["SUSPENDED"],
    SUSPENDED: ["ACTIVE"]
}

export default class MerchantService {
    private readonly merchantRepository: MerchantRepository;

    constructor(merchantRepository: MerchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    create = async (merchantDto: CreateMerchantDto) => {
        return await this.merchantRepository.create(merchantDto);
    }

    fetchAll = async (query: MerchantQueryDto) => {
        return await this.merchantRepository.fetchAll(query);
    }

    fetchOne = async (merchantId: string) => {
        const merchant = await this.merchantRepository.fetchOne(merchantId);
        if (!merchant) {
            throw new NotFoundException("Merchant not found");
        }
        return merchant;
    }

    update = async (merchantId: string, data: UpdateMerchantDto) => {
        // Ensure merchant exists first
        await this.fetchOne(merchantId);
        return await this.merchantRepository.update(merchantId, data);
    }


    private validateTransition(oldStatus: MerchantStatus, newStatus: MerchantStatus) {
        if (!transitions[oldStatus].includes(newStatus)) {
            throw new InvalidStateException(
                `Invalid status transition, can't go from ${oldStatus} to ${newStatus}`)
        }
    }

    updateStatus = async (merchantId: string, data: UpdateMerchantStatusDto) => {
        const merchant = await this.fetchOne(merchantId);
        this.validateTransition(merchant.status as MerchantStatus, data.status);

        return await this.merchantRepository.update(merchantId, { status: data.status });
    }
}