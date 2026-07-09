import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { Database } from "../database";
import { Core } from "@/core";
import { Schemas } from "../schemas";
import { Mappers } from "../mappers";

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

    async listBySessionId(sessionId: Core.Sessions.Session['id']): Promise<Core.Messages.Message[]> {
        const messages = await this.databaseService.db.select().from(Schemas.messagesTable).where(eq(Schemas.messagesTable.session_id, sessionId))
        return messages.map(message => Mappers.MessagesMapper.toDomain(message))
    }
}