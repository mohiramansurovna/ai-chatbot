import { UserMemory } from "./user-memories.entity";

export type InsertUserMemories = Pick<UserMemory, 'userId' | 'content' | 'embedding' | 'embeddingModel'>
export type UpdateUserMemories = Pick<UserMemory, 'content' | 'embedding' | 'embeddingModel'>

export interface IUserMemoriesRepository {
    create(args: InsertUserMemories): Promise<void>;
    createMany(args:InsertUserMemories[], tx?:unknown):Promise<void>;
    update(id: UserMemory['id'], args: UpdateUserMemories): Promise<void>;
    delete(id: UserMemory['id']): Promise<void>;
    deleteMany(ids:number[], tx?:unknown):Promise<void>;
    findById(id:number):Promise<UserMemory>;
    findRelevant(userId: number, queryEmbedding: number[], limit?: number): Promise<UserMemory[]>;
    list(userId: number): Promise<UserMemory[]>;
}

export const USER_MEMORIES_REPOSITORY=Symbol('USER_MEMORIES_REPOSITORY')