import { DatabaseService } from "@/infrastructure/database/database.service";
import { Tx } from "@/infrastructure/database/unit-of-work";
import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { ApiKey } from "./api-keys.entity";
import { apiKeysTable } from "./api-keys.model";
import { ApiKeysMapper } from "./api-keys.mapper";


type CreateApiKeyArgs = {
    userId: ApiKey['userId'];
    provider: ApiKey['provider'];
    encryptedKey: ApiKey['encryptedKey'];
}

@Injectable()
export class ApiKeysRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findById(id: ApiKey['id']): Promise<ApiKey | null> {
        const [apiKey] = await this.databaseService.db.select().from(apiKeysTable).where(eq(apiKeysTable.id, id));
        return apiKey ? ApiKeysMapper.toDomain(apiKey) : null;
    }

    async findActiveKey(userId: ApiKey['userId'], provider: ApiKey['provider']): Promise<ApiKey | null> {
        const [apiKey] = await this.databaseService.db.select().from(apiKeysTable).where(and(
            eq(apiKeysTable.user_id, userId),
            eq(apiKeysTable.provider, provider),
            eq(apiKeysTable.status, 'active'),
        ));
        return apiKey ? ApiKeysMapper.toDomain(apiKey) : null;
    }

    async listUserKeys(userId: ApiKey['userId']): Promise<ApiKey[]> {
        const apiKeys = await this.databaseService.db.select().from(apiKeysTable).where(eq(apiKeysTable.user_id, userId));
        return apiKeys?.map((apiKey) => ApiKeysMapper.toDomain(apiKey)) ?? []
    }

    async create(args: CreateApiKeyArgs, tx?: Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.insert(apiKeysTable).values({
            user_id: args.userId,
            provider: args.provider,
            encrypted_key: args.encryptedKey,
        });
    }

    async update(id: ApiKey['id'], args: Partial<typeof apiKeysTable.$inferInsert>, tx?: Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection.update(apiKeysTable).set(args).where(eq(apiKeysTable.id, id));
    }
}