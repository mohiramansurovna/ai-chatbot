import { Session } from "@/core/entities";
import { Message } from "@/core/messages/messages.entity";
import { MessagesRepository } from "@/core/messages/messages.repository";
import { SessionsRepository } from "@/core/sessions/sessions.repository";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class SendMessageUseCase {
    constructor(
        private readonly sessionsRepository: SessionsRepository,
        private readonly messagesRepository: MessagesRepository
    ) { }
    async execute(sessionId: Session['id'], role: Message['role'], content: Message['content']): Promise<Message> {

        const session = await this.sessionsRepository.findById(sessionId);

        if (!session) {
            throw new NotFoundException('session not found')
        }

        return await this.messagesRepository.create({
            sessionId,
            role,
            content
        })
    }
}