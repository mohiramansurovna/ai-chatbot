import { DatabaseService } from "@/infrastructure/database/database.service";
import { Tx } from "@/infrastructure/database/unit-of-work";
import { Injectable } from "@nestjs/common";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { Embedding, EmbeddingWithSimilarity } from "./embeddings.entity";
import { embeddingsTable } from "./embeddings.model";
import { EmbeddingsMapper } from "./embeddings.mapper";
import { Session } from "../entities";


type CreateEmbeddingArgs = Omit<Embedding, 'id' | 'createdAt'>

@Injectable()
export class EmbeddingsRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findById(id: Embedding['id']): Promise<Embedding | null> {
        const [Embedding] = await this.databaseService.db.select().from(embeddingsTable).where(eq(embeddingsTable.id, id));
        return Embedding ? EmbeddingsMapper.toDomain(Embedding) : null;
    }

    async findNearest(userId: Embedding['userId'], queryEmbedding: Embedding['embedding'], limit = 5): Promise<EmbeddingWithSimilarity[]> {
        const vectorLiteral = JSON.stringify(queryEmbedding);

        const rows = await this.databaseService.db
            .select({
                ...getTableColumns(embeddingsTable),
                similarity: sql<number>`1 - (${embeddingsTable.embedding} <=> ${vectorLiteral}::vector)`
            })
            .from(embeddingsTable)
            .where(eq(embeddingsTable.user_id, userId))
            .orderBy(sql`${embeddingsTable.embedding} <=> ${vectorLiteral}::vector`)
            .limit(limit);

        return rows.map((embedding) => EmbeddingsMapper.toDomainWithSimilarity(embedding))
    }
    async listBySessionId(sessionId: Session['id']): Promise<Embedding[]> {
        const rows = await this.databaseService.db.select()
            .from(embeddingsTable)
            .where(eq(embeddingsTable.session_id, sessionId))
            .orderBy(embeddingsTable.created_at);

        return rows.map((row) => EmbeddingsMapper.toDomain(row))
    }

    async create(args: CreateEmbeddingArgs, tx?: Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.insert(embeddingsTable).values({
            user_id: args.userId,
            session_id: args.sessionId,
            role: args.role,
            content: args.content,
            embedding: args.embedding,
            embedding_model: args.embeddingModel,
        });
    }

    async deleteSessionEmbeddings(sessionId: Embedding['sessionId'], tx?: Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.delete(embeddingsTable).where(eq(embeddingsTable.session_id, sessionId))
    }
    async deleteUserEmbeddings(userId: Embedding['userId'], tx?: Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.delete(embeddingsTable).where(eq(embeddingsTable.user_id, userId))
    }
    async deleteById(id: Embedding['id'], tx?: Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.delete(embeddingsTable).where(eq(embeddingsTable.id, id))
    }

}