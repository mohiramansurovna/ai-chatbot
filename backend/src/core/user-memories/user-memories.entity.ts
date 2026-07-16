import { UserMemoryAccessDeniedException } from "./errors";

export class UserMemory {
    id: number;
    userId: number;
    content: string;
    embedding: number[];
    embeddingModel: string;
    createdAt: Date;
    updatedAt: Date | null;

    constructor(params: Omit<UserMemory, 'verifyAccess'>) {
        Object.assign(this, params);
    }
    verifyAccess(userId: number): void {
        if (this.userId !== userId) {
            throw new UserMemoryAccessDeniedException()
        }
    }

}
export type UserMemoryWithSimilarity = UserMemory & {
    similarity: number;
}