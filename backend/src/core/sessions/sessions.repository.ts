import { DatabaseService } from "@/infrastructure/database/database.service";
import { Tx } from "@/infrastructure/database/unit-of-work";
import { Injectable } from "@nestjs/common";
import { and, eq, isNull } from "drizzle-orm";
import { Session } from "./sessions.entity";
import { sessionsTable } from "./sessions.model";
import { SessionsMapper } from "./sessions.mapper";


type CreateSessionArgs = {
    title: Session['title'];
    userId: Session['userId'];
}

@Injectable()
export class SessionsRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findById(id: Session['id']): Promise<Session | null> {
        const [session] = await this.databaseService.db.select().from(sessionsTable).where(and(eq(sessionsTable.id, id), isNull(sessionsTable.deleted_at)));
        return session ? SessionsMapper.toDomain(session) : null;
    }

    async listUserSessions(userId: Session['userId']): Promise<Session[]> {
        const sessions = await this.databaseService.db.select().from(sessionsTable).where(and(eq(sessionsTable.user_id, userId), isNull(sessionsTable.deleted_at)));
        return sessions?.map((session) => SessionsMapper.toDomain(session)) ?? []
    }

    async create(args: CreateSessionArgs, tx?: Tx): Promise<Session> {
        const connection = this.databaseService.getExecutor(tx);
        const [session] = await connection.insert(sessionsTable).values({
            title: args.title,
            user_id: args.userId,
        }).returning();
        return SessionsMapper.toDomain(session);
    }

    async update(id: Session['id'], args: Partial<typeof sessionsTable.$inferInsert>, tx?: Tx): Promise<Session> {
        const connection = this.databaseService.getExecutor(tx);
        const [session] = await connection.update(sessionsTable).set(args).where(eq(sessionsTable.id, id)).returning();
        return SessionsMapper.toDomain(session)
    }
}