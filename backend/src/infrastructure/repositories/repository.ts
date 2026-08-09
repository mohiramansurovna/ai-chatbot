import { Core } from '@/core';
import { eq } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { Database } from '../database';
import { Mappers } from '../mappers';

export class Repository<Entity extends Core.Shared.IEntity> implements Core.Shared.IRepository<Entity> {
    constructor(
        private readonly table: PgTable,
        private readonly pk: PgColumn,
        private readonly databaseService: Database.DatabaseService,
        private readonly mapper: Mappers.IMapper<
            Entity,
            typeof this.table.$inferSelect,
            typeof this.table.$inferInsert
        >
    ) {}

    async create(entity: Entity, tx?: Core.Shared.ITx): Promise<Entity> {
        const connection = this.databaseService.getExecutor(tx);
        const [row] = await connection
            .insert(this.table)
            .values(this.mapper.toInsertModel(entity))
            .returning();
        return this.mapper.toDomain(row);
    }
    async findById(id: number): Promise<Entity | null> {
        const [row] = await this.databaseService.db
            .select()
            .from(this.table)
            .where(eq(this.pk, id));

        return row ? this.mapper.toDomain(row) : null;
    }
    async list(): Promise<Entity[]> {
        const rows = await this.databaseService.db.select().from(this.table);
        return rows.map(row => this.mapper.toDomain(row));
    }

    async update(entity: Entity, tx?: Core.Shared.ITx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection
            .update(this.table)
            .set(this.mapper.toUpdateModel(entity))
            .where(eq(this.pk, entity.id));
    }
    async delete(id: number, tx?: Core.Shared.ITx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.delete(this.table).where(eq(this.pk, id));
    }
}
