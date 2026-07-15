import { pgTable, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { sessionsTable } from './sessions.schema'
import { InferSelectModel } from 'drizzle-orm'
import { boolean } from 'drizzle-orm/pg-core'

export const messageRoleEnum = pgEnum('message_role', ['assistant', 'user'])
export const messagesTable = pgTable('messages', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    session_id: integer('session_id').notNull().references(() => sessionsTable.id),
    role: messageRoleEnum('role').notNull(),
    content: text('content').notNull(),
    is_compressed:boolean('is_compressed').default(false),
    created_at: timestamp('created_at').notNull().defaultNow(),
})

export type MessageSelect = typeof messagesTable.$inferSelect
export type MessageRole = InferSelectModel<typeof messagesTable>['role'];