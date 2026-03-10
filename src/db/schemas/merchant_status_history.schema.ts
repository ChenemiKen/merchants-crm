import { uuid, pgTable, timestamp, text } from 'drizzle-orm/pg-core';
import { merchants, merchantStatusEnum } from './merchant.schema';
import { userTable } from './user.schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';


export const merchantStatusHistory = pgTable("merchant_status_history", {
    id: uuid("id").primaryKey().defaultRandom(),

    merchantId: uuid("merchant_id")
        .notNull()
        .references(() => merchants.id),

    changedFrom: merchantStatusEnum("changed_from").notNull(),

    changedTo: merchantStatusEnum("changed_to").notNull(),

    changedBy: uuid("changed_by")
        .notNull()
        .references(() => userTable.id),

    reason: text("reason"),

    createdAt: timestamp("created_at").defaultNow()
})

export type MerchantStatusHistoryEntity = InferSelectModel<typeof merchantStatusHistory>;
export type MerchantStatusHistoryInsert = InferInsertModel<typeof merchantStatusHistory>;

