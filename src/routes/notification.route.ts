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

// Repositories
const subscriberRepo = new NotificationSubscriberRepository(database);

// Services
const subscriberService = new NotificationSubscriberService(subscriberRepo);

// Controllers
const subscriberController = new NotificationSubscriberController(subscriberService);

// Subscriber Routes
router.post("/subscribers", auth, validateRequest(CreateNotificationSubscriberSchema), subscriberController.create);
router.get("/subscribers", auth, subscriberController.fetchAll);
router.get("/subscribers/:id", auth, subscriberController.fetchOne);
router.patch("/subscribers/:id", auth, validateRequest(UpdateNotificationSubscriberSchema), subscriberController.update);

export default router;
