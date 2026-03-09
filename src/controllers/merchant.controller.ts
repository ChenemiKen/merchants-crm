import { ValidationException } from '@/constants/exceptions';
import { CreateMerchantDto, MerchantQueryDto, MerchantQuerySchema, UpdateMerchantDto } from '@/domain/models/schemas/merchant.schema';
import MerchantService from '@/services/merchant.service';
import { sendSuccess } from '@/utils/response.util';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export class MerchantController {
    private readonly merchantService: MerchantService;

    constructor(merchantService: MerchantService) {
        this.merchantService = merchantService;
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

    fetchOne = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const msg = "Invalid merchant ID";
            const parsed = z.string().uuid(msg).safeParse(req.params.id);
            if (!parsed.success) {
                throw new ValidationException(msg, msg);
            }
            const result = await this.merchantService.fetchOne(parsed.data);
            sendSuccess(res, 200, result);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request<{ id: string }, {}, UpdateMerchantDto>, res: Response, next: NextFunction) => {
        try {
            const msg = "Invalid merchant ID";
            const parsed = z.string().uuid(msg).safeParse(req.params.id);
            if (!parsed.success) {
                throw new ValidationException(msg, msg);
            }
            const updated = await this.merchantService.update(parsed.data, req.body);
            sendSuccess(res, 200, updated);
        } catch (error) {
            next(error);
        }
    }
}
