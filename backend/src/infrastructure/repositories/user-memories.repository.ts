import { Injectable } from "@nestjs/common";
import { eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { Core } from "@/core";
import { Database } from "../database";
import { Mappers } from "../mappers";
import { Schemas } from "../schemas";

@Injectable()
export class UserMemoriesRepository implements Core.UserMemories.IUserMemoriesRepository {
    constructor(private readonly databaseService: Database.DatabaseService) { }
    async create(args: Core.UserMemories.InsertUserMemories, tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.insert(Schemas.userMemoriesTable).values({
            user_id: args.userId,
            content: args.content,
            embedding: args.embedding,
            embedding_model: args.embeddingModel,
        });
    }
    async createMany(args: Core.UserMemories.InsertUserMemories[], tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.insert(Schemas.userMemoriesTable).values(args.map(memory => ({
            user_id: memory.userId,
            content: memory.content,
            embedding: memory.embedding,
            embedding_model: memory.embeddingModel,
        })));
    }
    async update(id: Core.UserMemories.UserMemory['id'], args: Core.UserMemories.UpdateUserMemories, tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.update(Schemas.userMemoriesTable).set(args)
            .where(eq(Schemas.userMemoriesTable.id, id))
    }

    async delete(id: Core.UserMemories.UserMemory['id'], tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.delete(Schemas.userMemoriesTable)
            .where(eq(Schemas.userMemoriesTable.id, id))
    }
    async deleteMany(ids: number[], tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.delete(Schemas.userMemoriesTable)
            .where(inArray(Schemas.userMemoriesTable.id, ids))
    }
    async findById(id: number): Promise<Core.UserMemories.UserMemory> {
        const [userMemory] = await this.databaseService.db.select()
            .from(Schemas.userMemoriesTable).where(eq(Schemas.userMemoriesTable.id, id));
        return Mappers.UserMemoriesMapper.toDomain(userMemory)
    }
    async list(userId: Core.UserMemories.UserMemory['userId']): Promise<Core.UserMemories.UserMemory[]> {
        const rows = await this.databaseService.db.select()
            .from(Schemas.userMemoriesTable)
            .where(eq(Schemas.userMemoriesTable.user_id, userId))
            .orderBy(Schemas.userMemoriesTable.created_at);

        return rows.map((row) => Mappers.UserMemoriesMapper.toDomain(row))
    }
    async findRelevant(
        userId: Core.UserMemories.UserMemory['userId'],
        queryEmbedding: Core.UserMemories.UserMemory['embedding'],
        limit = 5
    ): Promise<Core.UserMemories.UserMemoryWithSimilarity[]> {
        const vectorLiteral = JSON.stringify(queryEmbedding);

        const rows = await this.databaseService.db
            .select({
                ...getTableColumns(Schemas.userMemoriesTable),
                similarity: sql<number>`1 - (${Schemas.userMemoriesTable.embedding} <=> ${vectorLiteral}::vector)`
            })
            .from(Schemas.userMemoriesTable)
            .where(eq(Schemas.userMemoriesTable.user_id, userId))
            .orderBy(sql`${Schemas.userMemoriesTable.embedding} <=> ${vectorLiteral}::vector`)
            .limit(limit);

        return rows.map((UserMemory) => Mappers.UserMemoriesMapper.toDomainWithSimilarity(UserMemory))
    }

}