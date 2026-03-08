import type { InferSelectModel } from 'drizzle-orm';
import { uuid, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
});

export type UserEntity = InferSelectModel<typeof userTable>;
