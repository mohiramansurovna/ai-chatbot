import { Session } from "@/core/entities";
import { Message } from "@/core/messages/messages.entity";

export type SessionWithMessages = Session & {
    messages: Message[]
}

export class SessionsResponseDto {
    id: number;
    title: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}
export class SessionDetailsResponseDto {
    id: number;
    title: string;
    userId: number;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}