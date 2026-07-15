import { Database } from "../database";
import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { Core } from "@/core";
import { Schemas } from "../schemas";
import { Mappers } from "../mappers";

@Injectable()
export class ApiKeysRepository implements Core.ApiKeys.IApiKeysRepository {
    constructor(private readonly databaseService: Database.DatabaseService) { }

    async findById(id: Core.ApiKeys.ApiKey['id']): Promise<Core.ApiKeys.ApiKey | null> {
        const [apiKey] = await this.databaseService.db.select()
            .from(Schemas.apiKeysTable)
            .where(eq(Schemas.apiKeysTable.id, id));
        return apiKey ? Mappers.ApiKeysMapper.toDomain(apiKey) : null;
    }

    async findActiveKey(
        userId: Core.ApiKeys.ApiKey['userId'],
        provider: Core.ApiKeys.ApiKey['provider']
    ): Promise<Core.ApiKeys.ApiKey | null> {
        const [apiKey] = await this.databaseService.db.select().from(Schemas.apiKeysTable).where(and(
            eq(Schemas.apiKeysTable.user_id, userId),
            eq(Schemas.apiKeysTable.provider, provider),
            eq(Schemas.apiKeysTable.status, 'active'),
        ));
        return apiKey ? Mappers.ApiKeysMapper.toDomain(apiKey) : null;
    }

    async listUserKeys(userId: Core.ApiKeys.ApiKey['userId']): Promise<Core.ApiKeys.ApiKey[]> {
        const apiKeys = await this.databaseService.db.select().from(Schemas.apiKeysTable).where(eq(Schemas.apiKeysTable.user_id, userId));
        return apiKeys?.map((apiKey) => Mappers.ApiKeysMapper.toDomain(apiKey)) ?? []
    }

    async create(args: Core.ApiKeys.InsertApiKey, tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.insert(Schemas.apiKeysTable).values({
            user_id: args.userId,
            provider: args.provider,
            encrypted_key: args.encryptedKey,
        });
    }

    async update(
        id: Core.ApiKeys.ApiKey['id'],
        args: Partial<Core.ApiKeys.UpdateApiKey>,
        tx?: Database.Tx
    ): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.update(Schemas.apiKeysTable).set({
            user_id: args.userId,
            provider: args.provider,
            encrypted_key: args.encryptedKey,
            status: args.status,
        }).where(eq(Schemas.apiKeysTable.id, id));
    }
}