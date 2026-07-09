import { pgTable, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { sessionsTable } from '../models'

export const messageRoleEnum = pgEnum('message_role', ['assistant', 'user'])
export type MessageRole = 'assistant' | 'user';

export const messagesTable = pgTable('messages', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    session_id: integer('session_id').notNull().references(() => sessionsTable.id),
    role: messageRoleEnum('role').notNull(),
    content: text('content').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
})

export type MessageModel = typeof messagesTable.$inferSelect