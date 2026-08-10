import { pgTable, integer, text, timestamp, vector } from 'drizzle-orm/pg-core'
import { usersTable } from './users.schema';


export const userMemoriesTable = pgTable('user_memories', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    user_id: integer('user_id').notNull().references(() => usersTable.id),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 768 }).notNull(),
    embedding_model: text('embedding_model').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
})

export type UserMemorySelect = typeof userMemoriesTable.$inferSelect
export type UserMemoryInsert = typeof userMemoriesTable.$inferInsert