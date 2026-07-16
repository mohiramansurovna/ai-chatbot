import { Core } from "@/core";

export type SessionWithMessages = Core.Sessions.Session & {
    messages: Core.Messages.Message[]
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
    messages: Core.Messages.Message[];
    createdAt: Date;
    updatedAt: Date;
}