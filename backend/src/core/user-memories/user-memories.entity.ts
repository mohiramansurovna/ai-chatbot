import { IEntity } from '../shared/entity.interface';
import { UserMemoryAccessDeniedException } from './errors';

interface UserMemoryProps {
    id: number;
    userId: number;
    content: string;
    embedding: number[];
    embeddingModel: string;
    createdAt: Date;
    updatedAt: Date | null;
}
let temporaryId = -1;
export class UserMemory implements IEntity {
    readonly id: number;
    readonly userId: number;
    readonly content: string;
    readonly embedding: number[];
    readonly embeddingModel: string;
    readonly createdAt: Date;
    readonly updatedAt: Date | null;

    private constructor(props: UserMemoryProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.content = props.content;
        this.embedding = props.embedding;
        this.embeddingModel = props.embeddingModel;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props: Omit<UserMemoryProps, 'id' | 'createdAt' | 'updatedAt'>): UserMemory {
        return new UserMemory({
            id: temporaryId--,
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    static fromModel(props: UserMemoryProps): UserMemory {
        return new UserMemory(props);
    }

    public verifyAccess(userId: number): void {
        if (this.userId !== userId) {
            throw new UserMemoryAccessDeniedException();
        }
    }
}
export interface UserMemoryWithSimilarity extends UserMemory {
    similarity: number;
}
