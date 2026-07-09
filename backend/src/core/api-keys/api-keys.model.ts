import { pgTable, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { LlmProviderName } from '../llm/llm.types'
import { usersTable } from '../models';

export const apiKeyStatusEnum = pgEnum('api_key_status', ['active', 'revoked'])
export type ApiKeyStatus = 'active' | 'revoked';

export const apiKeysTable = pgTable('api_keys', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    user_id: integer('user_id').notNull().references(()=>usersTable.id),
    provider: text('provider').$type<LlmProviderName>().notNull(),
    encrypted_key: text('encrypted_key').notNull(),
    status: apiKeyStatusEnum('status').notNull().default('active'),
    created_at: timestamp('created_at').notNull().defaultNow(),
})

export type ApiKeyModel = typeof apiKeysTable.$inferSelect