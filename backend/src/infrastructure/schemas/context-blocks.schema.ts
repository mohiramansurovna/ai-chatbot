import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { sessionsTable } from './sessions.schema';
import { messagesTable } from './messages.schema';


export const contextBlocksTable = pgTable('session_context_blocks', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    session_id: integer('session_id').notNull().references(() => sessionsTable.id, { onDelete: 'cascade' }),
    start_message_id: integer('start_message_id').notNull().references(() => messagesTable.id),
    message_count: integer('message_count').notNull(),
    content: text('content').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(()=>new Date()),
})

export type ContextBlockSelect = typeof contextBlocksTable.$inferSelect
export type ContextBlockInsert = typeof contextBlocksTable.$inferInsert