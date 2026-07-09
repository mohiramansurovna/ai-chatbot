import { integer, pgTable, text, vector, timestamp, index } from "drizzle-orm/pg-core";
import { sessionsTable, usersTable, messageRoleEnum } from "../models";

export const embeddingsTable = pgTable('embeddings', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    user_id: integer('user_id').notNull().references(() => usersTable.id),
    session_id: integer('session_id').notNull().references(() => sessionsTable.id),
    role: messageRoleEnum('role').notNull(),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 768 }).notNull(),
    embedding_model: text('embedding_model').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    embeddingIdx: index('embeddings_embedding_idx')
        .using('hnsw', table.embedding.op('vector_cosine_ops')),
}));

export type EmbeddingsModel = typeof embeddingsTable.$inferSelect