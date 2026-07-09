import { DatabaseService } from "@/infrastructure/database/database.service";
import { Tx } from "@/infrastructure/database/unit-of-work";
import { Injectable } from "@nestjs/common";
import { messagesTable } from "./messages.model";
import { Message } from "./messages.entity";
import { MessagesMapper } from "./messages.mapper";
import { eq } from "drizzle-orm";
import { Session } from "../entities";




@Injectable()
export class MessagesRepository {
    constructor(private readonly databaseService: DatabaseService) { }
    async create(args: Omit<Message, 'id' | 'createdAt'>, tx?: Tx): Promise<Message> {
        const connection = this.databaseService.getExecutor(tx);
        const [message] = await connection.insert(messagesTable).values({
            session_id: args.sessionId,
            role: args.role,
            content: args.content
        }).returning()
        return MessagesMapper.toDomain(message)
    }
    async delete(id: Message['id'], tx?: Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.delete(messagesTable).where(eq(messagesTable.id, id))
    }

    async listBySessionId(sessionId: Session['id']): Promise<Message[]> {
        const messages = await this.databaseService.db.select().from(messagesTable).where(eq(messagesTable.session_id, sessionId))
        return messages.map(message => MessagesMapper.toDomain(message))
    }
}