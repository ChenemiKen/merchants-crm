import { MerchantController } from "@/controllers/merchant.controller";
import { Database } from "@/db/database";
import MerchantRepository from "@/db/repositories/merchant.repository";
import { CreateMerchantSchema, UpdateMerchantSchema, UpdateMerchantStatusSchema } from "@/models/schemas/merchant.schema";
import { auth, authorize } from "@/middleware/auth.middleware";
import { validateRequest } from "@/middleware/validation.middleware";
import MerchantService from "@/services/merchant.service";
import MerchantStatusHistoryService from "@/services/merchant_status_history.service";
import NotificationRepository from "@/db/repositories/notification.repository";
import NotificationSubscriberRepository from "@/db/repositories/notification_subscribers.repository";
import NotificationService from "@/services/notification.service";
import { Router } from "express";
import MerchantStatusHistoryRepository from "@/db/repositories/merchant_status_history.repository";

const router = Router();

const database = new Database();
const merchantRepository = new MerchantRepository(database);
const merchantStatusHistoryRepository = new MerchantStatusHistoryRepository(database);
const merchantStatusHistoryService = new MerchantStatusHistoryService(merchantStatusHistoryRepository);

const notificationRepo = new NotificationRepository(database);
const subscriberRepo = new NotificationSubscriberRepository(database);
const notificationService = new NotificationService(notificationRepo, subscriberRepo);

const merchantService = new MerchantService(merchantRepository, merchantStatusHistoryService, notificationService);
const merchantController = new MerchantController(merchantService, merchantStatusHistoryService);

/**
 * @openapi
 * /api/merchants:
 *   post:
 *     tags: [Merchants]
 *     summary: Create a new merchant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Merchant'
 *     responses:
 *       201:
 *         description: Merchant created
 */
router.post("/", auth, validateRequest(CreateMerchantSchema), merchantController.create)

/**
 * @openapi
 * /api/merchants:
 *   get:
 *     tags: [Merchants]
 *     summary: List all merchants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of merchants
 */
router.get("/", auth, merchantController.fetchAll)

/**
 * @openapi
 * /api/merchants/{id}:
 *   get:
 *     tags: [Merchants]
 *     summary: Get merchant by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Merchant details
 *       404:
 *         description: Merchant not found
 */
router.get("/:id", auth, merchantController.fetchOne)

/**
 * @openapi
 * /api/merchants/{id}:
 *   patch:
 *     tags: [Merchants]
 *     summary: Update merchant details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Merchant'
 *     responses:
 *       200:
 *         description: Merchant updated
 */
router.patch("/:id", auth, validateRequest(UpdateMerchantSchema), merchantController.update)

/**
 * @openapi
 * /api/merchants/{id}/status:
 *   patch:
 *     tags: [Merchants]
 *     summary: Update merchant status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMerchantStatus'
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch("/:id/status", auth, validateRequest(UpdateMerchantStatusSchema), merchantController.updateStatus)

/**
 * @openapi
 * /api/merchants/{id}/history:
 *   get:
 *     tags: [Merchants]
 *     summary: Get merchant status history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Status history
 */
router.get("/:id/history", auth, merchantController.history)

/**
 * @openapi
 * /api/merchants/{id}:
 *   delete:
 *     tags: [Merchants]
 *     summary: Soft delete a merchant (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Merchant deleted
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete("/:id", auth, authorize(['admin']), merchantController.delete)

export default router;

