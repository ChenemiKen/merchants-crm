import type { InferSelectModel } from 'drizzle-orm';
import { uuid, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import { relations } from 'drizzle-orm';

export const refreshTokensTable = pgTable('refresh_token', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => userTable.id),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
});

export type RefreshTokenEntity = InferSelectModel<typeof refreshTokensTable>;

export const refreshTokenRelations = relations(refreshTokensTable, ({ one }) => ({
    user: one(userTable, {
        fields: [refreshTokensTable.userId],
        references: [userTable.id]
    })
}))
