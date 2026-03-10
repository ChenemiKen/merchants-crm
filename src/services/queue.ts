import { Worker, Queue } from "bullmq";
import config from "@/config/config";
import axios from "axios";
import crypto from "crypto";
import NotificationRepository from "@/db/repositories/notification.repository";
import NotificationSubscriberRepository from "@/db/repositories/notification_subscribers.repository";
import { Database } from "@/db/database";
import logger from "@/utils/logger.util";

const connection = { host: config.REDIS_HOST, port: config.REDIS_PORT };

export const notificationsQueue = new Queue("notifications", {
    connection
});

const database = new Database();
const notificationRepo = new NotificationRepository(database);
const subscriberRepo = new NotificationSubscriberRepository(database);

const worker = new Worker("notifications", async (job) => {
    const { notificationId, subscriberId, eventType, payload } = job.data;

    logger.info({ notificationId, subscriberId, eventType, retryCount: job.attemptsMade }, "Processing notification job");

    const subscriber = await subscriberRepo.findOne(subscriberId);
    if (!subscriber || !subscriber.url || !subscriber.isActive) {
        logger.warn({ subscriberId }, "Subscriber not found or inactive skipping");
        return;
    }

    const timestamp = Date.now();
    const body = JSON.stringify({
        id: notificationId,
        event: eventType,
        payload,
        timestamp
    });

    const signature = crypto
        .createHmac("sha256", subscriber.secret)
        .update(body)
        .digest("hex");

    try {
        const response = await axios.post(subscriber.url, body, {
            headers: {
                "Content-Type": "application/json",
                "X-Webhook-Signature": signature,
                "X-Webhook-Timestamp": timestamp.toString()
            },
            timeout: 10000 // 10 seconds timeout
        });

        await notificationRepo.update(notificationId, {
            status: 'COMPLETED',
            attempts: job.attemptsMade + 1,
            response: {
                status: response.status,
                body: response.data
            }
        });

        logger.info({ notificationId, subscriber: { name: subscriber.name, url: subscriber.url } },
            "Webhook delivered successfully");

    } catch (error: any) {
        const attempts = job.attemptsMade + 1;
        const isLastAttempt = attempts >= (job.opts.attempts || 1);

        await notificationRepo.update(notificationId, {
            status: isLastAttempt ? 'FAILED' : 'PENDING',
            attempts,
            response: {
                status: error.response?.status,
                body: error.response?.data
            }
        });

        logger.error({
            notificationId,
            subscriber: { name: subscriber.name, url: subscriber.url },
            attempts,
            error: error.message
        }, "Failed to deliver webhook");
        throw error; // Let BullMQ handle retries
    }
}, {
    connection,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 1000 }
});

worker.on("failed", (job, err) => {
    logger.error({ jobId: job?.id, error: err.message }, "Notification job failed");
});

export default worker;
