export type MessageRole = 'user' | 'assistant';
export type MessageStatus = 'compressed' | 'compressing' | 'raw';

interface MessageProps {
    id: number;
    sessionId: number;
    role: MessageRole;
    status: MessageStatus;
    content: string;
    createdAt: Date;
}
let temporaryId = -1;

export class Message {
    readonly id: number;
    readonly sessionId: number;
    readonly role: MessageRole;
    readonly status: MessageStatus;
    readonly content: string;
    readonly createdAt: Date;

    private constructor(props: MessageProps) {
        this.id = props.id;
        this.sessionId = props.sessionId;
        this.role = props.role;
        this.status = props.status;
        this.content = props.content;
        this.createdAt = props.createdAt;
    }

    static create(props: Omit<MessageProps, 'id' | 'createdAt'>): Message {
        return new Message({ id: temporaryId--, ...props, createdAt: new Date() });
    }

    static fromModel(props: MessageProps): Message {
        return new Message(props);
    }
}
