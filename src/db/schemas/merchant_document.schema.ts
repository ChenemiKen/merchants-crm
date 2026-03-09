import { uuid, pgTable, timestamp, text, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { merchants } from './merchant.schema';
import { userTable } from './user.schema';
import { InferSelectModel } from 'drizzle-orm';

export const documentTypeEnum = pgEnum("document_type", [
    "BUSINESS_REGISTRATION",
    "OWNER_ID",
    "BANK_ACCOUNT_PROOF"
])

export const merchantDocuments = pgTable("merchant_documents", {
    id: uuid("id").primaryKey().defaultRandom(),

    merchantId: uuid("merchant_id")
        .notNull()
        .references(() => merchants.id),

    type: documentTypeEnum("type").notNull(),

    fileUrl: text("file_url").notNull(),

    verified: boolean("verified").default(false),

    verifiedBy: uuid("verified_by").references(() => userTable.id),

    verifiedAt: timestamp("verified_at"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type MerchantDocumentEntity = InferSelectModel<typeof merchantDocuments>;