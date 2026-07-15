import { integer, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password_hash: text('password_hash').notNull(),
    deleted_at: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow().$onUpdate(()=>new Date()),
}, (table) => ({
    emailUnique: unique('idx_users_email').on(table.email),
}));

export const USERS_EMAIL_UNIQUE_INDEX = 'idx_users_email'

export type UserModel = typeof usersTable.$inferSelect;