import { InvalidStateException, NotFoundException } from "@/constants/exceptions";
import MerchantRepository from "@/db/repositories/merchant.repository";
import { MerchantEntity } from "@/db/schemas/merchant.schema";
import {
    CreateMerchantDto, MerchantQueryDto, MerchantStatus,
    UpdateMerchantDto, UpdateMerchantStatusDto
} from "@/models/schemas/merchant.schema";
import MerchantStatusHistoryService from "./merchant_status_history.service";
import NotificationService from "./notification.service";


const transitions: Record<MerchantStatus, MerchantStatus[]> = {
    PENDING_KYB: ["ACTIVE", "SUSPENDED"],
    ACTIVE: ["SUSPENDED"],
    SUSPENDED: ["ACTIVE"]
}

export default class MerchantService {
    private readonly merchantRepository: MerchantRepository;
    private readonly merchantStatusHistoryService: MerchantStatusHistoryService;
    private readonly notificationService: NotificationService;

    constructor(merchantRepository: MerchantRepository,
        merchantStatusHistoryService: MerchantStatusHistoryService,
        notificationService: NotificationService
    ) {
        this.merchantRepository = merchantRepository;
        this.merchantStatusHistoryService = merchantStatusHistoryService;
        this.notificationService = notificationService;
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

    update = async (merchantId: string, data: UpdateMerchantDto): Promise<MerchantEntity> => {
        // Ensure merchant exists first
        await this.fetchOne(merchantId);
        return await this.merchantRepository.update(merchantId, data);
    }


    private validateTransition(changedFrom: MerchantStatus, changedTo: MerchantStatus) {
        if (!transitions[changedFrom].includes(changedTo)) {
            throw new InvalidStateException(
                `Invalid status transition, can't go from ${changedFrom} to ${changedTo}`)
        }
    }

    updateStatus = async (merchantId: string, data: UpdateMerchantStatusDto, userId: string)
        : Promise<MerchantEntity> => {
        let merchant = await this.fetchOne(merchantId);
        const changedFrom = merchant.status as MerchantStatus;
        this.validateTransition(changedFrom, data.status);

        merchant = await this.merchantRepository.update(merchantId, { status: data.status });

        await this.merchantStatusHistoryService.create(merchant, userId, changedFrom, data.reason);

        await this.notificationService.createNotification("merchant.status_changed", {
            merchantId: merchant.id,
            changedFrom,
            changedTo: merchant.status,
            reason: data.reason
        });

        return merchant;
    }

    delete = async (merchantId: string) => {
        return await this.merchantRepository.softDelete(merchantId);
    }
}