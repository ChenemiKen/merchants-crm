import { eq, sql } from "drizzle-orm";
import { Database } from "../database";
import { notificationSubscribers } from "../schemas/notification_subscriber.schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type NotificationSubscriberEntity = InferSelectModel<typeof notificationSubscribers>;
export type NotificationSubscriberInsert = InferInsertModel<typeof notificationSubscribers>;

export default class NotificationSubscriberRepository {
    private readonly database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    async create(data: NotificationSubscriberInsert) {
        const db = this.database.getInstance();
        const [subscriber] = await db.insert(notificationSubscribers).values(data).returning();
        return subscriber;
    }

    async fetchAll(limit: number, offset: number, searchTerm?: string) {
        const db = this.database.getInstance();

        let whereClause = undefined;
        if (searchTerm) {
            whereClause = sql`${notificationSubscribers.name} ILIKE ${'%' + searchTerm + '%'}`;
        }

        const [data, countResult] = await Promise.all([
            db.select().from(notificationSubscribers)
                .where(whereClause)
                .limit(limit)
                .offset(offset)
                .orderBy(notificationSubscribers.createdAt),
            db.select({ count: sql<number>`count(*)` })
                .from(notificationSubscribers)
                .where(whereClause)
        ]);

        return {
            data,
            total: Number(countResult[0]?.count ?? 0)
        };
    }

    async findOne(id: string) {
        const db = this.database.getInstance();
        const [subscriber] = await db.select().from(notificationSubscribers).where(eq(notificationSubscribers.id, id));
        return subscriber;
    }

    async findByUrl(url: string) {
        const db = this.database.getInstance();
        const [subscriber] = await db.select().from(notificationSubscribers).where(eq(notificationSubscribers.url, url));
        return subscriber;
    }

    async update(id: string, data: Partial<NotificationSubscriberInsert>) {
        const db = this.database.getInstance();
        const [subscriber] = await db.update(notificationSubscribers)
            .set({ ...data, updateAt: new Date() })
            .where(eq(notificationSubscribers.id, id))
            .returning();
        return subscriber;
    }
}