import { ApiKey } from "./api-keys.entity";

export type InsertApiKey = Omit<ApiKey, 'id' | 'createdAt' | 'status'>
export type UpdateApiKey = Partial<Omit<ApiKey, 'id'|'createdAt'>>

export interface IApiKeysRepository {
    findById(id: ApiKey['id']): Promise<ApiKey | null>;
    findActiveKey(userId: ApiKey['userId'], provider: ApiKey['provider']): Promise<ApiKey | null>;
    listUserKeys(userId: ApiKey['userId']): Promise<ApiKey[]>;
    create(args: InsertApiKey): Promise<void>;
    update(id: ApiKey['id'], args:UpdateApiKey): Promise<void>;
}
export const API_KEYS_REPOSITORY = Symbol("API_KEYS_REPOSITORY")