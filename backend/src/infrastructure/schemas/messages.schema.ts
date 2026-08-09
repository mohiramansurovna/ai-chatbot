import { pgTable, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { sessionsTable } from './sessions.schema'
import { Core } from '@/core'

export const messageRoleEnum = pgEnum('message_role', ['assistant', 'user'] as const satisfies Core.Messages.MessageRole[])
export const messageStatusEnum = pgEnum('message_status', ['compressed', 'compressing', 'raw'] as const satisfies Core.Messages.MessageStatus[])
export const messagesTable = pgTable('messages', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    session_id: integer('session_id').notNull().references(() => sessionsTable.id),
    role: messageRoleEnum('role').notNull(),
    content: text('content').notNull(),
    status:messageStatusEnum('status').default('raw').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
})

export type MessageSelect = typeof messagesTable.$inferSelect;
export type MessageInsert = typeof messagesTable.$inferInsert;