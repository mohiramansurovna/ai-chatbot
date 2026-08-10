import { Core } from '@/core';
import { eq } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { Database } from '../database';
import { Mappers } from '../mappers';

interface RepositoryArgs<Mapper> {
    table: PgTable;
    pk: PgColumn;

    databaseService: Database.DatabaseService;
    mapper: Mapper;
}

export class Repository<
    Entity extends Core.Shared.IEntity,
    TTable extends PgTable,
    Mapper extends Mappers.IMapper<Entity, TTable['$inferSelect'], TTable['$inferInsert']>,
> implements Core.Shared.IRepository<Entity> {
    protected readonly table: PgTable;
    protected readonly pk: PgColumn;
    protected readonly databaseService: Database.DatabaseService;
    protected readonly mapper: Mapper;
    constructor(args: RepositoryArgs<Mapper>) {
        this.table = args.table;
        this.pk = args.pk;
        this.databaseService = args.databaseService;
        this.mapper = args.mapper;
    }

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
