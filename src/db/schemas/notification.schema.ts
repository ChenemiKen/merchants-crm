import { uuid, pgTable, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { notificationSubscribers } from './notification_subscriber.schema';


export const notifications = pgTable("notifications", {
    id: uuid("id").primaryKey().defaultRandom(),

    subscriberId: uuid("subscriber_id")
        .references(() => notificationSubscribers.id),

    eventType: text("event_type").notNull(),

    payload: jsonb("payload").notNull(),

    status: text("status").default("PENDING"),

    attempts: integer("attempts").default(0),

    nextRetryAt: timestamp("next_retry_at"),

    createdAt: timestamp("created_at").defaultNow(),

    updateAt: timestamp("updated_at").defaultNow()
})