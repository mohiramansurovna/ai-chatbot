import { Database } from '../database';
import { Injectable } from '@nestjs/common';
import { Core } from '@/core';
import { Schemas } from '../schemas';
import { Mappers } from '../mappers';
import { Repository } from './repository';

@Injectable()
export class ContextBlocksRepository
    extends Repository<Core.ContextBlocks.ContextBlock, typeof Schemas.contextBlocksTable>
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
