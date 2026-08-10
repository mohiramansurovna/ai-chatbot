import { Injectable } from '@nestjs/common';
import { eq, getTableColumns, inArray, sql } from 'drizzle-orm';
import { Core } from '@/core';
import { Database } from '../database';
import { Mappers } from '../mappers';
import { Schemas } from '../schemas';
import { Repository } from './repository';

@Injectable()
export class UserMemoriesRepository
    extends Repository<
        Core.UserMemories.UserMemory,
        typeof Schemas.userMemoriesTable,
        Mappers.UserMemoriesMapper
    >
    implements Core.UserMemories.IUserMemoriesRepository
{
    constructor(databaseService: Database.DatabaseService, mapper: Mappers.UserMemoriesMapper) {
        super({
            table: Schemas.userMemoriesTable,
            pk: Schemas.userMemoriesTable.id,
            databaseService,
            mapper,
        });
    }
    async createMany(entities: Core.UserMemories.UserMemory[], tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection
            .insert(Schemas.userMemoriesTable)
            .values(entities.map(entity => this.mapper.toInsertModel(entity)));
    }
    async deleteMany(ids: number[], tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection
            .delete(Schemas.userMemoriesTable)
            .where(inArray(Schemas.userMemoriesTable.id, ids));
    }

    async listByUserId(
        userId: Core.UserMemories.UserMemory['userId']
    ): Promise<Core.UserMemories.UserMemory[]> {
        const rows = await this.databaseService.db
            .select()
            .from(Schemas.userMemoriesTable)
            .where(eq(Schemas.userMemoriesTable.user_id, userId))
            .orderBy(Schemas.userMemoriesTable.created_at);

        return rows.map(row => this.mapper.toDomain(row));
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
                similarity: sql<number>`1 - (${Schemas.userMemoriesTable.embedding} <=> ${vectorLiteral}::vector)`,
            })
            .from(Schemas.userMemoriesTable)
            .where(eq(Schemas.userMemoriesTable.user_id, userId))
            .orderBy(sql`${Schemas.userMemoriesTable.embedding} <=> ${vectorLiteral}::vector`)
            .limit(limit);

        return rows.map(UserMemory => this.mapper.toDomainWithSimilarity(UserMemory));
    }
}
