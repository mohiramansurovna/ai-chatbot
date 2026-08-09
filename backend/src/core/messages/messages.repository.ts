import { Message, MessageStatus } from "./messages.entity";
import { Session } from "../sessions/sessions.entity";
import { IRepository } from "../shared/repository.interface";

export type ListBySessionIdOptions={
    startMessageId:number,
    limit:number,
    status:MessageStatus
}
export interface IMessagesRepository extends IRepository<Message>{
    listBySessionId(sessionId: Session['id'], options?:ListBySessionIdOptions): Promise<Message[]>;
}
export const MESSAGES_REPOSITORY=Symbol("MESSAGES_REPOSITORY")