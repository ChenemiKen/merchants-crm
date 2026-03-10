import { eq } from "drizzle-orm";
import { Database } from "../database";
import { NotificationInsert, notifications } from "../schemas/notification.schema";


export default class NotificationRepository {
    private readonly database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    async create(data: NotificationInsert) {
        const db = this.database.getInstance();
        const [subscriber] = await db.insert(notifications).values(data).returning();
        return subscriber;
    }

    async update(id: string, data: Partial<NotificationInsert>) {
        const db = this.database.getInstance();
        const [notification] = await db.update(notifications)
            .set({ ...data, updateAt: new Date() })
            .where(eq(notifications.id, id))
            .returning();
        return notification;
    }
}