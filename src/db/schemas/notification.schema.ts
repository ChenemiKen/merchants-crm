import { uuid, pgTable, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { notificationSubscribers } from './notification_subscriber.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';


export const notifications = pgTable("notifications", {
    id: uuid("id").primaryKey().defaultRandom(),

    subscriberId: uuid("subscriber_id")
        .references(() => notificationSubscribers.id),

    eventType: text("event_type").notNull(),

    payload: jsonb("payload").notNull(),

    status: text("status").default("PENDING"),

    attempts: integer("attempts").default(0),

    response: jsonb("response"),

    createdAt: timestamp("created_at").defaultNow(),

    updateAt: timestamp("updated_at").defaultNow()
})

export type NotificationEntity = InferSelectModel<typeof notifications>;
export type NotificationInsert = InferInsertModel<typeof notifications>;