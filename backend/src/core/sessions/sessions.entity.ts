import { Messages } from '../messages';
import { User } from '../users/users.entity';
import { SessionAccessDeniedException } from './errors';
interface SessionProps {
    id: number;
    title: string;
    userId: User['id'];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
let temporaryId = -1;
export class Session {
    readonly id: number;
    readonly title: string;
    readonly userId: User['id'];
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
    static temporaryId = -1;

    private constructor(props: SessionProps) {
        this.id = props.id;
        this.title = props.title;
        this.userId = props.userId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.deletedAt = props.deletedAt;
    }

    static create(
        props: Omit<SessionProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    ): Session {
        return new Session({
            id: temporaryId--,
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
    }

    static fromModel(props: SessionProps): Session {
        return new Session(props);
    }
    public verifyAccess(userId: User['id']) {
        if (userId !== this.userId) {
            throw new SessionAccessDeniedException();
        }
    }
    public rename(title:string): Pick<Session, 'id' | 'title'> {
        return { id: this.id, title };
    }
}

export type SessionContext = {
    id: number;
    session_id: number;
    role: Messages.MessageRole | null;
    status: Messages.MessageStatus | null;
    content: string;
    created_at: Date;
    type: 'message' | 'context_block';
};
