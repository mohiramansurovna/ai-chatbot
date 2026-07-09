import { Session } from "./sessions.entity";
export type SessionInsert = Pick<Session, 'title' | 'userId'>

export interface ISessionsRepository {
    findById(id: Session['id']): Promise<Session | null>;
    listUserSessions(userId: Session['userId']): Promise<Session[]>;
    create(args: SessionInsert): Promise<Session>;
    update(id: Session['id'], args: SessionInsert): Promise<Session>;
}

export const SESSIONS_REPOSITORY = Symbol('SESSIONS_REPOSITORY')