import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { Database } from "../db/database";
import { CreateNotificationSubscriberSchema, UpdateNotificationSubscriberSchema } from "../models/schemas/notification_subscriber.schema";
import NotificationSubscriberRepository from "../db/repositories/notification_subscribers.repository";
import NotificationSubscriberService from "../services/notification_subscriber.service";
import NotificationSubscriberController from "../controllers/notification_subscriber.controller";

const router = Router();
const database = new Database();
const subscriberRepo = new NotificationSubscriberRepository(database);
const subscriberService = new NotificationSubscriberService(subscriberRepo);
const subscriberController = new NotificationSubscriberController(subscriberService);

/**
 * @openapi
 * /api/notifications/subscribers:
 *   post:
 *     tags: [Notifications]
 *     summary: Create a new notification subscriber
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificationSubscriber'
 *     responses:
 *       201:
 *         description: Subscriber created
 */
router.post("/subscribers", auth, validateRequest(CreateNotificationSubscriberSchema), subscriberController.create);

/**
 * @openapi
 * /api/notifications/subscribers:
 *   get:
 *     tags: [Notifications]
 *     summary: List all notification subscribers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscribers
 */
router.get("/subscribers", auth, subscriberController.fetchAll);

/**
 * @openapi
 * /api/notifications/subscribers/{id}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get subscriber by ID
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
 *         description: Subscriber details
 */
router.get("/subscribers/:id", auth, subscriberController.fetchOne);

/**
 * @openapi
 * /api/notifications/subscribers/{id}:
 *   patch:
 *     tags: [Notifications]
 *     summary: Update subscriber details
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
 *             $ref: '#/components/schemas/CreateNotificationSubscriber'
 *     responses:
 *       200:
 *         description: Subscriber updated
 */
router.patch("/subscribers/:id", auth, validateRequest(UpdateNotificationSubscriberSchema), subscriberController.update);

/**
 * @openapi
 * /api/notifications/webhook:
 *   post:
 *     tags: [Notifications]
 *     summary: Webhook receiver endpoint
 *     description: Receives incoming webhooks from external systems
 *     responses:
 *       200:
 *         description: Webhook received successfully
 */
router.post("/webhook", subscriberController.handleWebhook);

export default router;
