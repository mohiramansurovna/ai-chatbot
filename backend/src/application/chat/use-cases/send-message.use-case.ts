import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Core } from "@/core";

@Injectable()
export class SendMessageUseCase {
    constructor(
        @Inject(Core.Sessions.SESSIONS_REPOSITORY) private readonly sessionsRepository: Core.Sessions.ISessionsRepository,
        @Inject(Core.Messages.MESSAGES_REPOSITORY) private readonly messagesRepository: Core.Messages.IMessagesRepository,
    ) { }
    async execute(
        sessionId: Core.Sessions.Session['id'],
        role: Core.Messages.Message['role'],
        content: Core.Messages.Message['content']
    ): Promise<Core.Messages.Message> {

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