export class ContextBlock {
    id: number;
    sessionId: number;
    startMessageId:number;
    messageCount:number;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;

    constructor(props: ContextBlock) {
        Object.assign(this, props)
    }
}
