import { DuplicateModelException, InvalidStateException, NotFoundException } from "@/constants/exceptions";
import MerchantDocumentRepository from "@/db/repositories/merchant_document.repository";
import { CreateMerchantDocumentDto, UpdateMerchantDocumentDto } from "@/models/schemas/merchant.schema";
import MerchantService from "./merchant.service";

export default class MerchantDocumentService {
    private readonly merchantDocumentRepository: MerchantDocumentRepository;
    private readonly merchantService: MerchantService;

    constructor(merchantDocumentRepository: MerchantDocumentRepository, merchantService: MerchantService) {
        this.merchantDocumentRepository = merchantDocumentRepository;
        this.merchantService = merchantService;
    }

    create = async (merchantId: string, documentDto: CreateMerchantDocumentDto) => {
        // Ensure merchant exists first
        await this.merchantService.fetchOne(merchantId);

        const doc = await this.merchantDocumentRepository.findByMerchantIdAndType(merchantId, documentDto.type)
        if (doc) {
            throw new DuplicateModelException(
                `document type ${documentDto.type} already exists for this merchant`)
        }

        return await this.merchantDocumentRepository.create(merchantId, documentDto);
    }

    fetchByMerchantId = async (merchantId: string) => {
        return await this.merchantDocumentRepository.fetchByMerchantId(merchantId);
    }

    fetchOne = async (id: string) => {
        const doc = await this.merchantDocumentRepository.fetchOne(id);
        if (!doc) {
            throw new NotFoundException("Document not found");
        }
        return doc;
    }

    update = async (merchantId: string, data: UpdateMerchantDocumentDto) => {
        // Ensure merchant exists first
        await this.fetchOne(merchantId);
        return await this.merchantDocumentRepository.update(merchantId, data);
    }
}