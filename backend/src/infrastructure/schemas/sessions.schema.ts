import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './users.schema';

export const sessionsTable = pgTable('sessions', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    title: text('title').notNull(),
    user_id: integer('user_id').notNull().references(() => usersTable.id),
    deleted_at: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type SessionSelect = typeof sessionsTable.$inferSelect;
export type SessionInsert = typeof sessionsTable.$inferInsert;