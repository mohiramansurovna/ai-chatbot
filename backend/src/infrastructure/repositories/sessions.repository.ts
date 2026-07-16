import { Database } from "../database";
import { Injectable } from "@nestjs/common";
import { and, eq, isNull, sql, asc } from "drizzle-orm";
import { Core } from "@/core";
import { Mappers } from "../mappers";
import { Schemas } from "../schemas";

@Injectable()
export class SessionsRepository implements Core.Sessions.ISessionsRepository {
    constructor(private readonly databaseService: Database.DatabaseService) { }

    async findById(id: Core.Sessions.Session['id']): Promise<Core.Sessions.Session | null> {
        const [session] = await this.databaseService.db.select().from(Schemas.sessionsTable)
            .where(and(eq(Schemas.sessionsTable.id, id), isNull(Schemas.sessionsTable.deleted_at)));
        return session ? Mappers.SessionsMapper.toDomain(session) : null;
    }

    async listUserSessions(userId: Core.Sessions.Session['userId']): Promise<Core.Sessions.Session[]> {
        const sessions = await this.databaseService.db.select().from(Schemas.sessionsTable)
            .where(and(eq(Schemas.sessionsTable.user_id, userId), isNull(Schemas.sessionsTable.deleted_at)));
        return sessions?.map((session) => Mappers.SessionsMapper.toDomain(session)) ?? []
    }

    async create(args: Core.Sessions.SessionInsert, tx?: Database.Tx): Promise<Core.Sessions.Session> {
        const connection = this.databaseService.getExecutor(tx);
        const [session] = await connection.insert(Schemas.sessionsTable).values({
            title: args.title,
            user_id: args.userId,
        }).returning();
        return Mappers.SessionsMapper.toDomain(session);
    }

    async update(id: Core.Sessions.Session['id'], args: Partial<Core.Sessions.SessionInsert>, tx?: Database.Tx): Promise<Core.Sessions.Session> {
        const connection = this.databaseService.getExecutor(tx);
        const [session] = await connection.update(Schemas.sessionsTable).set(args)
            .where(eq(Schemas.sessionsTable.id, id)).returning();
        return Mappers.SessionsMapper.toDomain(session)
    }
    async delete(id: Core.Sessions.Session['id'], tx?: Database.Tx) {
        const connection = this.databaseService.getExecutor(tx);
        await connection.update(Schemas.sessionsTable)
            .set({ deleted_at: new Date() }).where(eq(Schemas.sessionsTable.id, id))
    }
    async getSessionContext(id: Core.Sessions.Session["id"]): Promise<Core.Sessions.SessionContext[]> {

        const messages = this.databaseService.db.select({
            id: Schemas.messagesTable.id,
            session_id: Schemas.messagesTable.session_id,
            role: sql<Core.Messages.MessageRole | null>`${Schemas.messagesTable.role}`,
            content: Schemas.messagesTable.content,
            created_at: Schemas.messagesTable.created_at,
            status: sql<Core.Messages.MessageStatus|null> `${Schemas.messagesTable.status}`,
            type: sql<'message' | 'context_block'>`'message'`
        }).from(Schemas.messagesTable).where(eq(Schemas.messagesTable.session_id, id));

        const blocks = this.databaseService.db.select({
            id: Schemas.contextBlocksTable.id,
            session_id: Schemas.contextBlocksTable.session_id,
            role: sql<Core.Messages.MessageRole | null>`NULL`,
            content: Schemas.contextBlocksTable.content,
            status: sql<Core.Messages.MessageStatus | null>`NULL`,
            created_at: Schemas.contextBlocksTable.created_at,
            type: sql<'context_block' | 'message'>`'context_block'`
        }).from(Schemas.contextBlocksTable).where(eq(Schemas.contextBlocksTable.session_id, id));

        return await messages.unionAll(blocks).orderBy(asc(sql`created_at`));
    }
}