import { Database } from "@/db/database";
import { CreateMerchantDocumentSchema, UpdateMerchantDocumentSchema } from "@/models/schemas/merchant.schema";
import { auth } from "@/middleware/auth.middleware";
import { validateRequest } from "@/middleware/validation.middleware";
import { Router } from "express";
import MerchantDocumentRepository from "@/db/repositories/merchant_document.repository";
import MerchantDocumentService from "@/services/merchant_document.service";
import { MerchantDocumentController } from "@/controllers/merchant_document.controller";
import MerchantService from "@/services/merchant.service";
import MerchantRepository from "@/db/repositories/merchant.repository";
import MerchantStatusHistoryRepository from "@/db/repositories/merchant_status_history.repository";
import MerchantStatusHistoryService from "@/services/merchant_status_history.service";
import NotificationRepository from "@/db/repositories/notification.repository";
import NotificationSubscriberRepository from "@/db/repositories/notification_subscribers.repository";
import NotificationService from "@/services/notification.service";

const router = Router();

const database = new Database();
const merchantDocumentRepository = new MerchantDocumentRepository(database);
const merchantRepository = new MerchantRepository(database);
const merchantStatusHistoryRepository = new MerchantStatusHistoryRepository(database);
const merchantStatusHistoryService = new MerchantStatusHistoryService(merchantStatusHistoryRepository);

const notificationRepo = new NotificationRepository(database);
const subscriberRepo = new NotificationSubscriberRepository(database);
const notificationService = new NotificationService(notificationRepo, subscriberRepo);

const merchantService = new MerchantService(merchantRepository, merchantStatusHistoryService, notificationService);
const merchantDocumentService = new MerchantDocumentService(merchantDocumentRepository, merchantService);
const merchantDocumentController = new MerchantDocumentController(merchantDocumentService);

router.post("/:merchantId/documents", auth, validateRequest(CreateMerchantDocumentSchema), merchantDocumentController.create)
router.get("/:merchantId/documents", auth, merchantDocumentController.fetchByMerchantId)
router.patch("/documents/:id", auth, validateRequest(UpdateMerchantDocumentSchema), merchantDocumentController.update)
router.get("/documents/:id", auth, merchantDocumentController.fetchOne)
router.patch("/documents/:id/verify", auth, merchantDocumentController.verify)

export default router;

