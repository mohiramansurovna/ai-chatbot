import { Database } from "../database";
import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { Core } from "@/core";
import { Schemas } from "../schemas";
import { Mappers } from "../mappers";

@Injectable()
export class ContextBlocksRepository implements Core.ContextBlocks.IContextBlocksRepository {
    constructor(private readonly databaseService: Database.DatabaseService) { }
    async findById(id: Core.ContextBlocks.ContextBlock['id']): Promise<Core.ContextBlocks.ContextBlock | null> {
        const [contextBlock] = await this.databaseService.db.select()
            .from(Schemas.contextBlocksTable)
            .where(eq(Schemas.contextBlocksTable.id, id));
        return contextBlock ? Mappers.ContextBlocksMapper.toDomain(contextBlock) : null;
    }
    async create(args: Core.ContextBlocks.InsertContextBlock, tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.insert(Schemas.contextBlocksTable).values({
            session_id: args.sessionId,
            content: args.content,
            start_message_id: args.startMessageId,
            message_count: args.messageCount
        });
    }
    async update(
        id: Core.ContextBlocks.ContextBlock['id'],
        args: Core.ContextBlocks.UpdateContextBlock,
        tx?: Database.Tx
    ): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.update(Schemas.contextBlocksTable).set({
            content: args.content
        }).where(eq(Schemas.contextBlocksTable.id, id));
    }
    async delete(id: Core.ContextBlocks.ContextBlock['id'], tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.delete(Schemas.contextBlocksTable).where(eq(Schemas.contextBlocksTable.id, id))
    }
}