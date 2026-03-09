import { NotFoundException } from "@/constants/exceptions";
import MerchantRepository from "@/db/repositories/merchant.repository";
import { CreateMerchantDto, MerchantQueryDto, UpdateMerchantDto } from "@/models/schemas/merchant.schema";

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
}