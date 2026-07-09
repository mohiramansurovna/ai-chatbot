import { Injectable } from "@nestjs/common";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { Core } from "@/core";
import { Database } from "../database";
import { Mappers } from "../mappers";
import { Schemas } from "../schemas";

@Injectable()
export class EmbeddingsRepository implements Core.Embeddings.IEmbeddingsRepository {
    constructor(private readonly databaseService: Database.DatabaseService) { }

    async findById(id: Core.Embeddings.Embedding['id']): Promise<Core.Embeddings.Embedding | null> {
        const [Embedding] = await this.databaseService.db.select().from(Schemas.embeddingsTable).where(eq(Schemas.embeddingsTable.id, id));
        return Embedding ? Mappers.EmbeddingsMapper.toDomain(Embedding) : null;
    }

    async findNearest(
        userId: Core.Embeddings.Embedding['userId'],
        queryEmbedding: Core.Embeddings.Embedding['embedding'],
        limit = 5
    ): Promise<Core.Embeddings.EmbeddingWithSimilarity[]> {
        const vectorLiteral = JSON.stringify(queryEmbedding);

        const rows = await this.databaseService.db
            .select({
                ...getTableColumns(Schemas.embeddingsTable),
                similarity: sql<number>`1 - (${Schemas.embeddingsTable.embedding} <=> ${vectorLiteral}::vector)`
            })
            .from(Schemas.embeddingsTable)
            .where(eq(Schemas.embeddingsTable.user_id, userId))
            .orderBy(sql`${Schemas.embeddingsTable.embedding} <=> ${vectorLiteral}::vector`)
            .limit(limit);

        return rows.map((embedding) => Mappers.EmbeddingsMapper.toDomainWithSimilarity(embedding))
    }
    async listBySessionId(sessionId: Core.Sessions.Session['id']): Promise<Core.Embeddings.Embedding[]> {
        const rows = await this.databaseService.db.select()
            .from(Schemas.embeddingsTable)
            .where(eq(Schemas.embeddingsTable.session_id, sessionId))
            .orderBy(Schemas.embeddingsTable.created_at);

        return rows.map((row) => Mappers.EmbeddingsMapper.toDomain(row))
    }

    async create(args: Core.Embeddings.EmbeddingInsert, tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.insert(Schemas.embeddingsTable).values({
            user_id: args.userId,
            session_id: args.sessionId,
            content: args.content,
            embedding: args.embedding,
            embedding_model: args.embeddingModel,
        });
    }

    async delete(
        id: Core.Embeddings.Embedding['id'], 
        options:Core.Embeddings.DeleteOptions, 
        tx?: Database.Tx
    ): Promise<void> {

        const connection = this.databaseService.getExecutor(tx);
        const conditions = [eq(Schemas.embeddingsTable.id, id)];


        if (options.userId){
            conditions.push(eq(Schemas.embeddingsTable.user_id, options.userId))
        }
        if(options.sessionId){    
            conditions.push(eq(Schemas.embeddingsTable.session_id, options.sessionId))
        }

        await connection.delete(Schemas.embeddingsTable)
            .where(and(...conditions))
    }

}