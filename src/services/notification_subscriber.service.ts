import NotificationSubscriberRepository from "@/db/repositories/notification_subscribers.repository";
import { CreateNotificationSubscriberDto, NotificationSubscriberQueryDto, UpdateNotificationSubscriberDto } from "@/models/schemas/notification_subscriber.schema";
import { NotFoundException, DuplicateModelException } from "@/constants/exceptions";
import bcrypt from "bcrypt";

export default class NotificationSubscriberService {
    private readonly repository: NotificationSubscriberRepository;

    constructor(repository: NotificationSubscriberRepository) {
        this.repository = repository;
    }

    create = async (dto: CreateNotificationSubscriberDto) => {
        const existing = await this.repository.findByUrl(dto.url);
        if (existing) {
            throw new DuplicateModelException("A subscriber with this URL already exists");
        }

        const hashedSecret = await bcrypt.hash(dto.secret, 10);
        return await this.repository.create({
            ...dto,
            secret: hashedSecret
        });
    }

    fetchAll = async (query: NotificationSubscriberQueryDto) => {
        const offset = (query.page - 1) * query.limit;
        const result = await this.repository.fetchAll(query.limit, offset, query.search || query.name);

        return {
            ...result,
            page: query.page,
            limit: query.limit,
            totalPages: Math.ceil(result.total / query.limit)
        };
    }

    fetchOne = async (id: string) => {
        const subscriber = await this.repository.findOne(id);
        if (!subscriber) {
            throw new NotFoundException("Notification subscriber not found");
        }
        return subscriber;
    }

    update = async (id: string, dto: UpdateNotificationSubscriberDto) => {
        const subscriber = await this.fetchOne(id); // Ensure exists

        if (dto.url && dto.url !== subscriber.url) {
            const existing = await this.repository.findByUrl(dto.url);
            if (existing) {
                throw new DuplicateModelException("A subscriber with this URL already exists");
            }
        }

        let updateData = { ...dto } as any;
        if (dto.secret) {
            updateData.secret = await bcrypt.hash(dto.secret, 10);
        }

        return await this.repository.update(id, updateData);
    }
}
