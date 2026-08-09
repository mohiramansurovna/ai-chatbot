import { Database } from '../database';
import { Injectable } from '@nestjs/common';
import { and, eq, isNull, sql, asc } from 'drizzle-orm';
import { Core } from '@/core';
import { Mappers } from '../mappers';
import { Schemas } from '../schemas';
import { Repository } from './repository';

@Injectable()
export class SessionsRepository
    extends Repository<Core.Sessions.Session, typeof Schemas.sessionsTable>
    implements Core.Sessions.ISessionsRepository
{
    constructor(databaseService: Database.DatabaseService, mapper: Mappers.SessionsMapper) {
        super({
            table: Schemas.sessionsTable,
            pk: Schemas.sessionsTable.id,
            databaseService,
            mapper,
        });
    }

    async listUserSessions(
        userId: Core.Sessions.Session['userId']
    ): Promise<Core.Sessions.Session[]> {
        const sessions = await this.databaseService.db
            .select()
            .from(Schemas.sessionsTable)
            .where(
                and(
                    eq(Schemas.sessionsTable.user_id, userId),
                    isNull(Schemas.sessionsTable.deleted_at)
                )
            );
        return sessions?.map(session => this.mapper.toDomain(session)) ?? [];
    }
    async getSessionContext(
        id: Core.Sessions.Session['id']
    ): Promise<Core.Sessions.SessionContext[]> {
        const messages = this.databaseService.db
            .select({
                id: Schemas.messagesTable.id,
                session_id: Schemas.messagesTable.session_id,
                role: sql<Core.Messages.MessageRole | null>`${Schemas.messagesTable.role}`,
                content: Schemas.messagesTable.content,
                created_at: Schemas.messagesTable.created_at,
                status: sql<Core.Messages.MessageStatus | null>`${Schemas.messagesTable.status}`,
                type: sql<'message' | 'context_block'>`'message'`,
            })
            .from(Schemas.messagesTable)
            .where(eq(Schemas.messagesTable.session_id, id));

        const blocks = this.databaseService.db
            .select({
                id: Schemas.contextBlocksTable.id,
                session_id: Schemas.contextBlocksTable.session_id,
                role: sql<Core.Messages.MessageRole | null>`NULL`,
                content: Schemas.contextBlocksTable.content,
                status: sql<Core.Messages.MessageStatus | null>`NULL`,
                created_at: Schemas.contextBlocksTable.created_at,
                type: sql<'context_block' | 'message'>`'context_block'`,
            })
            .from(Schemas.contextBlocksTable)
            .where(eq(Schemas.contextBlocksTable.session_id, id));

        return await messages.unionAll(blocks).orderBy(asc(sql`created_at`));
    }
}
