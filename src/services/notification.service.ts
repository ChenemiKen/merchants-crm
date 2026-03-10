import NotificationRepository from "@/db/repositories/notification.repository";
import { NotificationInsert } from "@/db/schemas/notification.schema";
import { notificationsQueue } from "./queue";
import NotificationSubscriberRepository from "@/db/repositories/notification_subscribers.repository";
import logger from "@/utils/logger.util";

export default class NotificationService {
    private readonly repository: NotificationRepository;
    private readonly notificationSubscriberRepository: NotificationSubscriberRepository;

    constructor(repository: NotificationRepository,
        notificationSubscriberRepository: NotificationSubscriberRepository) {

        this.repository = repository;
        this.notificationSubscriberRepository = notificationSubscriberRepository;
    }

    async createNotification(eventType: string, payload: any) {
        try {
            const subscribers = await this.notificationSubscriberRepository.fetchAllActive();

            for (const subscriber of subscribers) {
                const data: NotificationInsert = {
                    subscriberId: subscriber.id,
                    eventType,
                    payload,
                    status: 'PENDING',
                    attempts: 0,
                };

                const notification = await this.repository.create(data);

                if (notification) {
                    await notificationsQueue.add("webhook", {
                        notificationId: notification.id,
                        subscriberId: subscriber.id,
                        eventType,
                        payload
                    }, {
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 3000,
                        },
                    });
                }
            }

            logger.info({ eventType }, `Notifications created and queued for ${subscribers.length} active subscribers`);
        } catch (error: any) {
            logger.error({ error: error.message, eventType }, "Failed to create/queue notifications");
            throw error;
        }
    }
}