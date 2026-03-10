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

/**
 * @openapi
 * /api/merchants/{merchantId}/documents:
 *   post:
 *     tags: [Merchant Documents]
 *     summary: Create a new merchant document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The merchant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMerchantDocument'
 *     responses:
 *       201:
 *         description: Document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MerchantDocument'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Merchant not found
 */
router.post("/:merchantId/documents", auth, validateRequest(CreateMerchantDocumentSchema), merchantDocumentController.create)

/**
 * @openapi
 * /api/merchants/{merchantId}/documents:
 *   get:
 *     tags: [Merchant Documents]
 *     summary: Get all documents for a merchant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The merchant ID
 *     responses:
 *       200:
 *         description: List of merchant documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MerchantDocument'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Merchant not found
 */
router.get("/:merchantId/documents", auth, merchantDocumentController.fetchByMerchantId)

/**
 * @openapi
 * /api/merchant-documents/{id}:
 *   patch:
 *     tags: [Merchant Documents]
 *     summary: Update a merchant document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMerchantDocument'
 *     responses:
 *       200:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MerchantDocument'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.patch("/documents/:id", auth, validateRequest(UpdateMerchantDocumentSchema), merchantDocumentController.update)

/**
 * @openapi
 * /api/merchant-documents/{id}:
 *   get:
 *     tags: [Merchant Documents]
 *     summary: Get a specific merchant document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The document ID
 *     responses:
 *       200:
 *         description: Document details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MerchantDocument'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.get("/documents/:id", auth, merchantDocumentController.fetchOne)

/**
 * @openapi
 * /api/merchant-documents/{id}/verify:
 *   patch:
 *     tags: [Merchant Documents]
 *     summary: Verify a merchant document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The document ID
 *     responses:
 *       200:
 *         description: Document verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MerchantDocument'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Document not found
 */
router.patch("/documents/:id/verify", auth, merchantDocumentController.verify)

export default router;

