import { Session, SessionContext } from "./sessions.entity";
export type SessionInsert = Pick<Session, 'title' | 'userId'>
export type SessionUpdate=Partial<Omit<Session,'id'|'userId'|'createdAt'|'updatedAt'>>

export interface ISessionsRepository {
    findById(id: Session['id']): Promise<Session | null>;
    listUserSessions(userId: Session['userId']): Promise<Session[]>;
    create(args: SessionInsert): Promise<Session>;
    update(id: Session['id'], args: Partial<SessionInsert>): Promise<Session>;
    delete(id:Session['id']):Promise<void>;
    getSessionContext(id:Session['id']):Promise<SessionContext[]>;
}

export const SESSIONS_REPOSITORY = Symbol('SESSIONS_REPOSITORY')