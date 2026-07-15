import { ContextBlock } from "../context-blocks/context-blocks.entity";
import { Message } from "../messages/messages.entity";
import { User } from "../users/users.entity";
import { SessionAccessDeniedException } from "./errors";

type SessionProps = Pick<Session, 'id' | 'title' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'>

export class Session {
    id: number;
    title: string;
    userId: User['id'];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    constructor(props: SessionProps) {
        Object.assign(this, props)
    }

    verifyAccess(userId: User['id']) {
        if (userId !== this.userId) {
            throw new SessionAccessDeniedException()
        }
    }
}

export type SessionContext = {
    id: number;
    session_id: number;
    role: "assistant" | "user" | null;
    is_compressed: boolean | null;
    content: string;
    created_at: Date;
    type: 'message' | 'context_block';
}