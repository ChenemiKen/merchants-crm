import { NextFunction, Request, Response } from "express";
import { CreateNotificationSubscriberDto, NotificationSubscriberQueryDto, NotificationSubscriberQuerySchema, UpdateNotificationSubscriberDto } from "@/models/schemas/notification_subscriber.schema";
import NotificationSubscriberService from "@/services/notification_subscriber.service";
import { sendSuccess } from "@/utils/response.util";
import { ValidationException } from "@/constants/exceptions";
import * as z from "zod";

export default class NotificationSubscriberController {
    private readonly service: NotificationSubscriberService;

    constructor(service: NotificationSubscriberService) {
        this.service = service;
    }

    private verifyUuid(id: string, message = "Invalid ID") {
        const parsed = z.string().uuid(message).safeParse(id);
        if (!parsed.success) {
            throw new ValidationException(message, message);
        }
    }

    create = async (req: Request<{}, {}, CreateNotificationSubscriberDto>, res: Response, next: NextFunction) => {
        try {
            const result = await this.service.create(req.body);
            sendSuccess(res, 201, result);
        } catch (error) {
            next(error);
        }
    }

    fetchAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query: NotificationSubscriberQueryDto = NotificationSubscriberQuerySchema.parse(req.query);
            const result = await this.service.fetchAll(query);
            sendSuccess(res, 200, result);
        } catch (error) {
            next(error);
        }
    }

    fetchOne = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            this.verifyUuid(req.params.id);
            const result = await this.service.fetchOne(req.params.id);
            sendSuccess(res, 200, result);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request<{ id: string }, {}, UpdateNotificationSubscriberDto>, res: Response, next: NextFunction) => {
        try {
            this.verifyUuid(req.params.id);
            const result = await this.service.update(req.params.id, req.body);
            sendSuccess(res, 200, result);
        } catch (error) {
            next(error);
        }
    }


    handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const result = await this.service.handleWebhook(req);
            sendSuccess(res, 200, "Webhook received successfully");
        } catch (error) {
            next(error);
        }
    }
}
