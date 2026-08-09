import { Database } from '../database';
import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { Core } from '@/core';
import { Schemas } from '../schemas';
import { Mappers } from '../mappers';
import { Repository } from './repository';

@Injectable()
export class ApiKeysRepository
    extends Repository<Core.ApiKeys.ApiKey, typeof Schemas.apiKeysTable>
    implements Core.ApiKeys.IApiKeysRepository
{
    constructor(databaseService: Database.DatabaseService, mapper: Mappers.ApiKeysMapper) {
        super({
            table: Schemas.apiKeysTable,
            pk: Schemas.apiKeysTable.id,
            databaseService,
            mapper,
        });
    }

    async findActiveKey(
        userId: Core.ApiKeys.ApiKey['userId'],
        provider: Core.ApiKeys.ApiKey['provider']
    ): Promise<Core.ApiKeys.ApiKey | null> {
        const [apiKey] = await this.databaseService.db
            .select()
            .from(Schemas.apiKeysTable)
            .where(
                and(
                    eq(Schemas.apiKeysTable.user_id, userId),
                    eq(Schemas.apiKeysTable.provider, provider),
                    eq(Schemas.apiKeysTable.status, 'active')
                )
            );
        return apiKey ? this.mapper.toDomain(apiKey) : null;
    }

    async listUserKeys(userId: Core.ApiKeys.ApiKey['userId']): Promise<Core.ApiKeys.ApiKey[]> {
        const apiKeys = await this.databaseService.db
            .select()
            .from(Schemas.apiKeysTable)
            .where(eq(Schemas.apiKeysTable.user_id, userId));
        return apiKeys?.map(apiKey => this.mapper.toDomain(apiKey)) ?? [];
    }
}
