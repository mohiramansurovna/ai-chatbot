import { Injectable } from '@nestjs/common';
import { eq, asc, and, gte } from 'drizzle-orm';
import { Database } from '../database';
import { Core } from '@/core';
import { Schemas } from '../schemas';
import { Mappers } from '../mappers';
import { ListBySessionIdOptions } from '@/core/messages/messages.repository';
import { Repository } from './repository';

@Injectable()
export class MessagesRepository
    extends Repository<Core.Messages.Message, typeof Schemas.messagesTable, Mappers.MessagesMapper>
    implements Core.Messages.IMessagesRepository
{
    constructor(databaseService: Database.DatabaseService, mapper: Mappers.MessagesMapper) {
        super({
            table: Schemas.messagesTable,
            pk: Schemas.messagesTable.id,
            databaseService,
            mapper,
        });
    }

    async listBySessionId(
        sessionId: Core.Sessions.Session['id'],
        options?: ListBySessionIdOptions
    ): Promise<Core.Messages.Message[]> {
        const { startMessageId, status, limit } = options ?? {};

        const conditions = [eq(Schemas.messagesTable.session_id, sessionId)];

        if (status !== undefined) {
            conditions.push(eq(Schemas.messagesTable.status, status));
        }

        if (startMessageId !== undefined) {
            conditions.push(
                gte(
                    Schemas.messagesTable.created_at,
                    this.databaseService.db
                        .select({ created_at: Schemas.messagesTable.created_at })
                        .from(Schemas.messagesTable)
                        .where(eq(Schemas.messagesTable.id, startMessageId))
                )
            );
        }

        let query = this.databaseService.db
            .select()
            .from(Schemas.messagesTable)
            .where(and(...conditions))
            .orderBy(asc(Schemas.messagesTable.created_at))
            .$dynamic();

        if (limit !== undefined) {
            query = query.limit(limit);
        }

        const messages = await query;
        return messages.map(message => this.mapper.toDomain(message));
    }
}
