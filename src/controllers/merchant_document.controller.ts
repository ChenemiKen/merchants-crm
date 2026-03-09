import { ValidationException } from '@/constants/exceptions';
import { CreateMerchantDocumentDto, UpdateMerchantDocumentDto } from '@/models/schemas/merchant.schema';
import MerchantDocumentService from '@/services/merchant_document.service';
import { sendSuccess } from '@/utils/response.util';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const INVALID_MERCHANT_ID = "Invalid merchant ID";

export class MerchantDocumentController {
    private readonly merchantDocumentService: MerchantDocumentService;

    constructor(merchantDocumentService: MerchantDocumentService) {
        this.merchantDocumentService = merchantDocumentService;
    }

    create = async (req: Request<{ merchantId: string }, {}, CreateMerchantDocumentDto>,
        res: Response, next: NextFunction) => {

        const parsed = z.string().uuid(INVALID_MERCHANT_ID).safeParse(req.params.merchantId);
        if (!parsed.success) {
            throw new ValidationException(INVALID_MERCHANT_ID, INVALID_MERCHANT_ID);
        }
        try {
            const merchantId = parsed.data;
            const documentDto = req.body;
            const newDocument = await this.merchantDocumentService.create(merchantId, documentDto);
            sendSuccess(res, 201, newDocument);
        } catch (error) {
            next(error);
        }
    }

    fetchByMerchantId = async (req: Request<{ merchantId: string }>, res: Response, next: NextFunction) => {
        try {

            const parsed = z.string().uuid(INVALID_MERCHANT_ID).safeParse(req.params.merchantId);
            if (!parsed.success) {
                throw new ValidationException(INVALID_MERCHANT_ID, INVALID_MERCHANT_ID);
            }
            const merchantId = req.params.merchantId;
            const result = await this.merchantDocumentService.fetchByMerchantId(merchantId);
            sendSuccess(res, 200, result);
        } catch (error) {
            next(error);
        }
    }

    fetchOne = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const msg = "Invalid document ID";
            const parsed = z.string().uuid(msg).safeParse(req.params.id);
            if (!parsed.success) {
                throw new ValidationException(msg, msg);
            }
            const result = await this.merchantDocumentService.fetchOne(parsed.data);
            sendSuccess(res, 200, result);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request<{ id: string }, {}, UpdateMerchantDocumentDto>, res: Response, next: NextFunction) => {
        try {
            const msg = "Invalid document ID";
            const parsed = z.string().uuid(msg).safeParse(req.params.id);
            if (!parsed.success) {
                throw new ValidationException(msg, msg);
            }
            const updated = await this.merchantDocumentService.update(parsed.data, req.body);
            sendSuccess(res, 200, updated);
        } catch (error) {
            next(error);
        }
    }
}
