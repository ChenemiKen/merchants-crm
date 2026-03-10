import { InferSelectModel } from 'drizzle-orm';
import { uuid, pgTable, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const merchantStatusEnum = pgEnum("merchant_status", [
    "PENDING_KYB",
    "ACTIVE",
    "SUSPENDED"
])

export const merchants = pgTable("merchants", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 255 }).notNull(),

    category: varchar("category", { length: 255 }).notNull(),

    city: varchar("city", { length: 255 }).notNull(),

    contactEmail: varchar("contact_email", { length: 255 }).notNull(),

    status: merchantStatusEnum("status").default("PENDING_KYB"),

    createdAt: timestamp("created_at").defaultNow(),

    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at")
})

export type MerchantEntity = InferSelectModel<typeof merchants>;
