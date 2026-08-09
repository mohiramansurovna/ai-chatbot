import { IEntity } from '../shared/entity.interface';

interface ContextBlockProps {
    id: number;
    sessionId: number;
    startMessageId: number;
    messageCount: number;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;
}
let temporaryId = -1;
export class ContextBlock implements IEntity {
    readonly id: number;
    readonly sessionId: number;
    readonly startMessageId: number;
    readonly messageCount: number;
    readonly content: string;
    readonly createdAt: Date;
    readonly updatedAt: Date | null;

    private constructor(props: ContextBlockProps) {
        this.id = props.id;
        this.sessionId = props.sessionId;
        this.startMessageId = props.startMessageId;
        this.messageCount = props.messageCount;
        this.content = props.content;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props: Omit<ContextBlockProps, 'id' | 'createdAt' | 'updatedAt'>): ContextBlock {
        return new ContextBlock({
            id: temporaryId--,
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromModel(props: ContextBlockProps): ContextBlock {
        return new ContextBlock(props);
    }
}
