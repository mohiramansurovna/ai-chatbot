import { Core } from '@/core';
import { Injectable } from '@nestjs/common';
import { Database } from '../database';
import { Mappers } from '../mappers';
import { Schemas } from '../schemas';
import { Repository } from './repository';

@Injectable()
export class ContextBlocksRepository
    extends Repository<
        Core.ContextBlocks.ContextBlock,
        typeof Schemas.contextBlocksTable,
        Mappers.ContextBlocksMapper
    >
    implements Core.ContextBlocks.IContextBlocksRepository
{
    constructor(databaseService: Database.DatabaseService, mapper: Mappers.ContextBlocksMapper) {
        super({
            table: Schemas.contextBlocksTable,
            pk: Schemas.contextBlocksTable.id,
            databaseService,
            mapper,
        });
    }
}
