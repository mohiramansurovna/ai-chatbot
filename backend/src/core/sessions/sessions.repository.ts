import { IRepository } from "../shared/repository.interface";
import { Session, SessionContext } from "./sessions.entity";
export type SessionInsert = Pick<Session, 'title' | 'userId'>
export type SessionUpdate=Partial<Omit<Session,'id'|'userId'|'createdAt'|'updatedAt'>>

export interface ISessionsRepository extends IRepository<Session>{
    listUserSessions(userId: Session['userId']): Promise<Session[]>;
    getSessionContext(id:Session['id']):Promise<SessionContext[]>;
}

export const SESSIONS_REPOSITORY = Symbol('SESSIONS_REPOSITORY')