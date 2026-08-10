import { IRepository } from '../shared/repository.interface';
import { UserMemory, UserMemoryWithSimilarity } from './user-memories.entity';

export interface IUserMemoriesRepository extends IRepository<UserMemory> {
    createMany(args: UserMemory[], tx?: unknown): Promise<void>;
    deleteMany(ids: number[], tx?: unknown): Promise<void>;
    findRelevant(userId: number, queryEmbedding: number[], limit?: number): Promise<UserMemoryWithSimilarity[]>;
    listByUserId(userId: number): Promise<UserMemory[]>;
}

export const USER_MEMORIES_REPOSITORY = Symbol('USER_MEMORIES_REPOSITORY');
