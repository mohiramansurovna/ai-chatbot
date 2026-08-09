
import { IRepository } from '../shared/repository.interface';
import { ApiKey } from './api-keys.entity';

export interface IApiKeysRepository extends IRepository<ApiKey> {
    findActiveKey(userId: ApiKey['userId'], provider: ApiKey['provider']): Promise<ApiKey | null>;
    listUserKeys(userId: ApiKey['userId']): Promise<ApiKey[]>;
}
export const API_KEYS_REPOSITORY = Symbol('API_KEYS_REPOSITORY');
