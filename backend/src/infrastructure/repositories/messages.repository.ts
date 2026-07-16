import { Injectable } from "@nestjs/common";
import { eq, asc, and, gte } from "drizzle-orm";
import { Database } from "../database";
import { Core } from "@/core";
import { Schemas } from "../schemas";
import { Mappers } from "../mappers";
import { ListBySessionIdOptions } from "@/core/messages/messages.repository";

@Injectable()
export class MessagesRepository implements Core.Messages.IMessagesRepository {
    constructor(private readonly databaseService: Database.DatabaseService) { }
    async create(args: Core.Messages.MessageInsert, tx?: Database.Tx): Promise<Core.Messages.Message> {
        const connection = this.databaseService.getExecutor(tx);
        const [message] = await connection.insert(Schemas.messagesTable).values({
            session_id: args.sessionId,
            role: args.role,
            content: args.content
        }).returning()
        return Mappers.MessagesMapper.toDomain(message)
    }
    async delete(id: Core.Messages.Message['id'], tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.delete(Schemas.messagesTable).where(eq(Schemas.messagesTable.id, id))
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
        return messages.map(message => Mappers.MessagesMapper.toDomain(message));
    }
}