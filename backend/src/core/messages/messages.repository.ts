import { Message } from "./messages.entity";
import { Session } from "../sessions/sessions.entity";

export type MessageInsert=Omit<Message,'id'|'createdAt'>
export interface IMessagesRepository {
    create(args: MessageInsert): Promise<Message>
    delete(id: Message['id']): Promise<void>;
    listBySessionId(sessionId: Session['id']): Promise<Message[]>;
}
export const MESSAGES_REPOSITORY=Symbol("MESSAGES_REPOSITORY")