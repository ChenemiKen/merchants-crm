import { uuid, pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const notificationSubscribers = pgTable("notification_subscribers", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: text("name").notNull(),

    url: text("url").notNull().unique(),

    secret: text("secret").notNull(),

    isActive: boolean("is_active").default(true),

    createdAt: timestamp("created_at").defaultNow(),

    updateAt: timestamp("updated_at").defaultNow()
})