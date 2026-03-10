import { ValidationException } from '@/constants/exceptions';
import { CreateMerchantDto, MerchantHistoryQueryDto, MerchantHistoryQuerySchema, MerchantQueryDto, MerchantQuerySchema, UpdateMerchantDto, UpdateMerchantStatusDto } from '@/models/schemas/merchant.schema';
import MerchantService from '@/services/merchant.service';
import MerchantStatusHistoryService from '@/services/merchant_status_history.service';
import { sendSuccess } from '@/utils/response.util';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';


export class MerchantController {
    private readonly merchantService: MerchantService;
    private readonly merchantStatusHistoryService: MerchantStatusHistoryService;

    constructor(merchantService: MerchantService,
        merchantStatusHistoryService: MerchantStatusHistoryService) {
        this.merchantService = merchantService;
        this.merchantStatusHistoryService = merchantStatusHistoryService;
    }

    create = async (req: Request<{}, {}, CreateMerchantDto>, res: Response, next: NextFunction) => {
        try {
            const merchantDto = req.body;
            const newMerchant = await this.merchantService.create(merchantDto);
            sendSuccess(res, 201, newMerchant);
        } catch (error) {
            next(error);
        }
    }

    fetchAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query: MerchantQueryDto = MerchantQuerySchema.parse(req.query);
            const result = await this.merchantService.fetchAll(query);
            sendSuccess(res, 200, result);
        } catch (error) {
            next(error);
        }
    }

    private verifyMerchantId(merchantId: string) {
        const INVALID_MERCHANT_ID = "Invalid merchant Id";
        const parsed = z.string().uuid(INVALID_MERCHANT_ID).safeParse(merchantId);
        if (!parsed.success) {
            throw new ValidationException(INVALID_MERCHANT_ID, INVALID_MERCHANT_ID);
        }
    }

    fetchOne = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const merchantId = req.params.id;
            this.verifyMerchantId(merchantId);
            const result = await this.merchantService.fetchOne(merchantId);
            sendSuccess(res, 200, result);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request<{ id: string }, {}, UpdateMerchantDto>, res: Response, next: NextFunction) => {
        try {
            const merchantId = req.params.id;
            this.verifyMerchantId(merchantId);
            const updated = await this.merchantService.update(merchantId, req.body);
            sendSuccess(res, 200, updated);
        } catch (error) {
            next(error);
        }
    }

    updateStatus = async (req: Request<{ id: string }, {}, UpdateMerchantStatusDto>, res: Response, next: NextFunction) => {
        try {
            const merchantId = req.params.id;
            this.verifyMerchantId(merchantId);
            const updated = await this.merchantService.updateStatus(merchantId, req.body, req.user?.id);
            sendSuccess(res, 200, updated);
        } catch (error) {
            next(error);
        }
    }


    history = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const merchantId = req.params.id;
            this.verifyMerchantId(merchantId);
            const query: MerchantHistoryQueryDto = MerchantHistoryQuerySchema.parse(req.query);
            const result = await this.merchantStatusHistoryService.findAllByMerchantId(merchantId, query);
            sendSuccess(res, 200, result);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const merchantId = req.params.id;
            this.verifyMerchantId(merchantId);
            const deleted = await this.merchantService.delete(merchantId);
            sendSuccess(res, 200, deleted);
        } catch (error) {
            next(error);
        }
    }

}
